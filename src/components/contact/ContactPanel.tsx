"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { getFormToken, sendMessage, type SendMessageState } from "@/lib/send-message";
import { ArrowUpRightIcon, UserCircleIcon } from "../icons";
import { pillClasses } from "../Pill";
import { useContact } from "./ContactProvider";

// Chat-style message panel in the bottom-right corner.
// It looks like a chat, but it is a message form: the message is sent to
// your email and you reply later, so the panel says that clearly.

const initialState: SendMessageState = { status: "idle" };

type ContactPanelProps = {
  ownerName: string;
  contactEmail: string;
};

export function ContactPanel({ ownerName, contactEmail }: ContactPanelProps) {
  const { isOpen, close } = useContact();
  const [state, formAction, isPending] = useActionState(sendMessage, initialState);
  // "Send another message" hides the last success message and shows an
  // empty form again (a new key gives a fresh form).
  const [dismissedState, setDismissedState] = useState<SendMessageState | null>(null);
  const [formKey, setFormKey] = useState(0);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  // Signed time token for the spam check (see send-message.ts).
  const [token, setToken] = useState("");

  const isSuccess = state.status === "success" && state !== dismissedState;

  // Focus the first field when the panel opens; Escape closes it.
  useEffect(() => {
    if (!isOpen) return;
    firstFieldRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // A fresh token whenever the panel opens and after every answer.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    getFormToken().then(
      (fresh) => {
        if (!cancelled) setToken(fresh);
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [isOpen, state, formKey]);

  const fields = state.status === "error" ? state.fields : undefined;

  return (
    <div
      role="dialog"
      aria-labelledby="contact-panel-title"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={`fixed inset-x-3 bottom-3 z-[55] flex max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-frame border border-line/60 bg-surface shadow-float transition duration-300 ease-out motion-reduce:transition-none sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[23rem] lg:w-[27rem] ${
        isOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-3 scale-[0.98] opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line/60 px-5 py-3.5">
        <span className="relative shrink-0">
          <UserCircleIcon className="size-9 text-ink" />
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 size-2.5 rounded-full bg-available ring-2 ring-surface"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p id="contact-panel-title" className="text-small leading-tight font-semibold">
            {ownerName}
          </p>
          <p className="text-label text-muted">Usually replies within 1–2 days</p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close message panel"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-4" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {/* Conversation */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <ChatBubble>
          Hi! Tell me a bit about your project or idea. Your message goes straight to my email,
          and I&apos;ll reply to you there.
        </ChatBubble>

        {isSuccess && state.status === "success" ? (
          <>
            <ChatBubble fromVisitor>Message sent ✓</ChatBubble>
            <ChatBubble>
              Thanks, {state.name}! I got your message and will reply to{" "}
              <strong className="font-semibold">{state.email}</strong> soon.
            </ChatBubble>
            <button
              type="button"
              onClick={() => {
                setDismissedState(state);
                setFormKey((key) => key + 1);
              }}
              className={pillClasses("outline", "cursor-pointer text-label")}
            >
              Send another message
            </button>
          </>
        ) : (
          <form key={formKey} action={formAction} className="space-y-3" noValidate>
            <Field label="Name">
              <input
                ref={firstFieldRef}
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Your name"
                defaultValue={fields?.name}
                className={inputClasses}
              />
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                placeholder="you@email.com"
                defaultValue={fields?.email}
                className={inputClasses}
              />
            </Field>
            <Field label="Message">
              <textarea
                name="message"
                required
                rows={4}
                minLength={10}
                maxLength={5000}
                placeholder="What are you working on?"
                defaultValue={fields?.message}
                className={`${inputClasses} resize-none`}
              />
            </Field>

            <input type="hidden" name="token" value={token} />

            {/* Spam trap: hidden from people, bots tend to fill it in. */}
            <div aria-hidden="true" className="hidden">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {state.status === "error" && (
              <p role="alert" className="rounded-card bg-page px-3 py-2 text-label text-ink">
                {state.message} You can also email me directly at{" "}
                <CopyEmailButton email={contactEmail} />.
              </p>
            )}

            <button
              type="submit"
              // Also waits for the spam-check token, otherwise the message
              // would be treated as a bot and silently dropped.
              disabled={isPending || !token}
              className={pillClasses(
                "dark",
                "w-full cursor-pointer py-[0.75em] text-small font-medium disabled:cursor-wait disabled:opacity-70",
              )}
            >
              {isPending ? "Sending…" : "Send message"} {!isPending && <ArrowUpRightIcon />}
            </button>
          </form>
        )}
      </div>

      {/* Fallback */}
      <p className="border-t border-line/60 px-5 py-3 text-center text-label text-muted">
        Prefer email? <CopyEmailButton email={contactEmail} />
      </p>
    </div>
  );
}

// Phones keep inputs at 16px (text-body), otherwise iOS zooms in on focus.
// Larger screens use the smaller text-small.
const inputClasses =
  "mt-1 block w-full rounded-card border border-transparent bg-page px-3 py-2 text-body leading-normal sm:text-small sm:leading-normal text-ink outline-none transition placeholder:text-muted/70 hover:border-line focus:border-ink focus:bg-surface";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-label font-medium text-ink">
      {label}
      {children}
    </label>
  );
}

function ChatBubble({ children, fromVisitor = false }: { children: React.ReactNode; fromVisitor?: boolean }) {
  return (
    <p
      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.55] ${
        fromVisitor ? "ml-auto rounded-br-md bg-ink text-page" : "rounded-bl-md bg-page text-ink"
      }`}
    >
      {children}
    </p>
  );
}

// Copies the email address to the clipboard and shows "Copied!" for a moment.
function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address is still visible in the title.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={email}
      className="cursor-pointer font-medium text-ink underline decoration-line underline-offset-4 transition hover:decoration-ink"
    >
      {copied ? "Copied!" : `Copy ${email}`}
    </button>
  );
}
