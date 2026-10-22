"use server";

// Server action for the "Let's Talk" message panel.
// Runs on the server only, so the Resend API key stays secret.
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL (see .env.example).
//
// Spam protection, in layers:
// 1. Only this website can call it (Next.js checks the Origin header).
// 2. Hidden "website" field that only bots fill in.
// 3. Signed time token: the form must be open for at least 3 seconds and the
//    token cannot be faked or reused after 2 hours.
// 4. At most 3 links per message.
// 5. Per visitor (IP address): at most 3 attempts per 10 minutes and 10 per day.
// 6. The same message is never sent twice within an hour.
// Bots get a fake "sent" answer for 2, 3 and 6, so they do not try again.
// Note: limits 5 and 6 are kept in the server's memory. On hosting with
// several server instances (like Vercel) each instance counts on its own,
// so they slow spam down rather than stopping it to the exact number.

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, format, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export type SendMessageState =
  | { status: "idle" }
  | { status: "success"; name: string; email: string }
  | { status: "error"; message: string; fields?: { name: string; email: string; message: string } };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINK_PATTERN = /https?:\/\/|www\./gi;
const MAX_LINKS = 3;

const MINUTE = 60 * 1000;
const MIN_FILL_TIME = 3 * 1000;
const MAX_TOKEN_AGE = 120 * MINUTE;
const RATE_LIMITS = [
  { window: 10 * MINUTE, max: 3 },
  { window: 24 * 60 * MINUTE, max: 10 },
];
const DUPLICATE_WINDOW = 60 * MINUTE;

// IP address → times of send attempts in the last day.
const sentByVisitor = new Map<string, number[]>();
// Fingerprint of email + message → time sent.
const recentMessages = new Map<string, number>();

// Gives the form a signed time token when the panel opens.
export async function getFormToken(): Promise<string> {
  const issuedAt = String(Date.now());
  return `${issuedAt}.${sign(issuedAt)}`;
}

export async function sendMessage(
  _previous: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const fields = { name, email, message };
  const lang = String(formData.get("lang") ?? "");
  const t = getDictionary(isLocale(lang) ? lang : DEFAULT_LOCALE).contact.errors;

  const pretendSent: SendMessageState = { status: "success", name, email };

  // Hidden "website" field: people never see it, spam bots often fill it in.
  if (String(formData.get("website") ?? "") !== "") return pretendSent;

  // Time token: missing or faked → bot; sent within 3 seconds → bot;
  // older than 2 hours → the panel was left open, ask to send again
  // (the panel fetches a fresh token after every answer).
  const tokenAge = getTokenAge(String(formData.get("token") ?? ""));
  if (tokenAge === null || tokenAge < MIN_FILL_TIME) return pretendSent;
  if (tokenAge > MAX_TOKEN_AGE) {
    return { status: "error", message: t.timedOut, fields };
  }

  if (!name || name.length > 100) {
    return { status: "error", message: t.name, fields };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 200) {
    return { status: "error", message: t.email, fields };
  }
  if (message.length < 10 || message.length > 5000) {
    return { status: "error", message: t.message, fields };
  }

  if ((message.match(LINK_PATTERN)?.length ?? 0) > MAX_LINKS) {
    return { status: "error", message: format(t.links, { max: MAX_LINKS }), fields };
  }

  const now = Date.now();
  // Forget visitors whose last message is more than a day old.
  if (sentByVisitor.size > 1000) {
    for (const [key, times] of sentByVisitor) {
      if (now - (times.at(-1) ?? 0) > RATE_LIMITS[RATE_LIMITS.length - 1].window) sentByVisitor.delete(key);
    }
  }
  const visitor = await getVisitorId();
  const sentTimes = (sentByVisitor.get(visitor) ?? []).filter(
    (time) => now - time < RATE_LIMITS[RATE_LIMITS.length - 1].window,
  );
  if (RATE_LIMITS.some((limit) => sentTimes.filter((time) => now - time < limit.window).length >= limit.max)) {
    return { status: "error", message: t.tooMany, fields };
  }

  for (const [key, time] of recentMessages) {
    if (now - time > DUPLICATE_WINDOW) recentMessages.delete(key);
  }
  const fingerprint = createHash("sha256").update(`${email.toLowerCase()}
${message}`).digest("hex");
  if (recentMessages.has(fingerprint)) return pretendSent;

  // Every attempt counts, also when sending fails, so hammering the form
  // does not get around the limit.
  sentByVisitor.set(visitor, [...sentTimes, now]);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
    return { status: "error", message: t.notSetUp, fields };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // resend.dev is Resend's free test sender. It can only deliver to the
        // email of your Resend account, which is why CONTACT_TO_EMAIL must match it.
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [to],
        // Clicking "Reply" in your inbox answers the visitor directly.
        reply_to: email,
        subject: `New message from ${name} (portfolio)`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error("Resend error", response.status, await response.text());
      return { status: "error", message: t.failed, fields };
    }
  } catch (error) {
    console.error("Resend request failed", error);
    return { status: "error", message: t.failed, fields };
  }

  recentMessages.set(fingerprint, now);
  return { status: "success", name, email };
}

// The token is signed with the secret Resend API key, so only this server
// can make one. (Without a key nothing can be sent anyway.)
function sign(value: string) {
  return createHmac("sha256", process.env.RESEND_API_KEY ?? "").update(value).digest("base64url");
}

// Age of a valid token in milliseconds, or null when it is missing or faked.
function getTokenAge(token: string): number | null {
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return null;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(issuedAt));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 ? age : null;
}

// Visitor IP address from the hosting proxy (first address of x-forwarded-for).
async function getVisitorId() {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0].trim() || list.get("x-real-ip") || "unknown";
}
