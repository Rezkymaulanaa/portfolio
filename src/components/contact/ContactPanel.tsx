"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendMessage, type SendMessageState } from "@/lib/send-message";
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

  const fields = state.status === "error" ? state.fields : undefined;

  return (
    <div
      role="dialog"
      aria-labelledby="contact-panel-title"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={`fixed inset-x-3 bottom-3 z-[55] flex max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-frame bg-surface shadow-float ring-1 ring-line/50 transition duration-300 motion-reduce:transition-none sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem] lg:w-[30rem] ${
        isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-ink px-4 py-3 text-page">
        <UserCircleIcon className="size-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <p id="contact-panel-title" className="font-semibold lg:text-lg">
            {ownerName}
          </p>
          <p className="flex items-center gap-1.5 text-xs lg:text-sm text-page/75">
            <span aria-hidden="true" className="size-2 rounded-full bg-available" />
            Usually replies within 1–2 days
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close message panel"
          className="flex size-9 items-center justify-center rounded-full text-xl leading-none transition hover:bg-page/15 focus-visible:outline-2 focus-visible:outline-page"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {/* Conversation */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-page px-4 py-4">
        <ChatBubble>
          Hi! 👋 Tell me a bit about your project or idea. Your message goes straight to my
          email, and I&apos;ll reply to you there.
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
              className={pillClasses("outline", "text-[0.95rem] lg:text-[1.1rem]")}
            >
              Send another message
            </button>
          </>
        ) : (
          <form key={formKey} action={formAction} className="space-y-3" noValidate>
            <Field label="Your name">
              <input
                ref={firstFieldRef}
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                defaultValue={fields?.name}
                className={inputClasses}
              />
            </Field>
            <Field label="Your email">
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
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
                defaultValue={fields?.message}
                className={`${inputClasses} resize-none`}
              />
            </Field>

            {/* Spam trap: hidden from people, bots tend to fill it in. */}
            <div aria-hidden="true" className="hidden">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {state.status === "error" && (
              <p role="alert" className="rounded-card bg-surface px-3 py-2 text-[0.95rem] lg:text-[1.1rem] text-ink ring-1 ring-line">
                {state.message} You can also email me directly at{" "}
                <CopyEmailButton email={contactEmail} />.
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={pillClasses("accent", "w-full cursor-pointer text-base disabled:cursor-wait disabled:opacity-70 lg:text-[1.2rem]")}
            >
              {isPending ? "Sending…" : "Send message"} {!isPending && <ArrowUpRightIcon />}
            </button>
          </form>
        )}
      </div>

      {/* Fallback */}
      <p className="border-t border-line/50 px-4 py-2.5 text-center text-xs lg:text-sm text-muted">
        Prefer email? <CopyEmailButton email={contactEmail} />
      </p>
    </div>
  );
}

const inputClasses =
  "mt-1 block w-full rounded-card border border-line bg-surface px-3 py-2 text-[0.95rem] lg:text-[1.1rem] text-ink outline-none transition focus:border-ink focus:ring-1 focus:ring-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[0.95rem] lg:text-[1.1rem] font-medium">
      {label}
      {children}
    </label>
  );
}

function ChatBubble({ children, fromVisitor = false }: { children: React.ReactNode; fromVisitor?: boolean }) {
  return (
    <p
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.95rem] lg:text-[1.1rem] leading-relaxed ${
        fromVisitor ? "ml-auto rounded-br-sm bg-accent text-ink" : "rounded-bl-sm bg-surface text-ink shadow-sm"
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
      className="cursor-pointer font-medium text-ink underline underline-offset-2 hover:no-underline"
    >
      {copied ? "Copied!" : `Copy ${email}`}
    </button>
  );
}
