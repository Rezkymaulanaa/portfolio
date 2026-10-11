"use server";

// Server action for the "Let's Talk" message panel.
// Runs on the server only, so the Resend API key stays secret.
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL (see .env.example).

export type SendMessageState =
  | { status: "idle" }
  | { status: "success"; name: string; email: string }
  | { status: "error"; message: string; fields?: { name: string; email: string; message: string } };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMessage(
  _previous: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const fields = { name, email, message };

  // Hidden "website" field: people never see it, spam bots often fill it in.
  // Pretend it worked so the bot does not retry.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", name, email };
  }

  if (!name || name.length > 100) {
    return { status: "error", message: "Please enter your name.", fields };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 200) {
    return { status: "error", message: "Please enter a valid email address.", fields };
  }
  if (message.length < 10 || message.length > 5000) {
    return { status: "error", message: "Please write a message of at least 10 characters.", fields };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
    return { status: "error", message: "Sending is not set up yet.", fields };
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
      return { status: "error", message: "Your message could not be sent.", fields };
    }
  } catch (error) {
    console.error("Resend request failed", error);
    return { status: "error", message: "Your message could not be sent.", fields };
  }

  return { status: "success", name, email };
}
