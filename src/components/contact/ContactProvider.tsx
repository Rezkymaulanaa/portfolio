"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useDictionary } from "@/i18n/I18nProvider";
import { ArrowUpRightIcon } from "../icons";
import { pillClasses } from "../Pill";
import { ContactPanel } from "./ContactPanel";

// Shares the open/closed state of the message panel, so every
// "Let's Talk" button on the page can open the same panel.

type ContactContextValue = {
  isOpen: boolean;
  open: (opener?: HTMLElement | null) => void;
  close: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContact() {
  const value = useContext(ContactContext);
  if (!value) throw new Error("useContact must be used inside <ContactProvider>");
  return value;
}

type ContactProviderProps = {
  children: ReactNode;
  ownerName: string;
  contactEmail: string;
};

export function ContactProvider({ children, ownerName, contactEmail }: ContactProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  // The button that opened the panel gets keyboard focus back on close.
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((opener?: HTMLElement | null) => {
    openerRef.current = opener ?? null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    openerRef.current?.focus();
  }, []);

  return (
    <ContactContext.Provider value={{ isOpen, open, close }}>
      {children}
      <ContactPanel ownerName={ownerName} contactEmail={contactEmail} />
    </ContactContext.Provider>
  );
}

type LetsTalkButtonProps = {
  variant: "accent" | "dark";
  className?: string;
  onClick?: () => void;
};

// Unstyled button that opens the message panel (e.g. the big footer heading).
export function LetsTalkTrigger({ className, children }: { className?: string; children: ReactNode }) {
  const { isOpen, open } = useContact();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onClick={(event) => open(event.currentTarget)}
      className={className}
    >
      {children}
    </button>
  );
}

// Pill button that opens the message panel.
export function LetsTalkButton({ variant, className, onClick }: LetsTalkButtonProps) {
  const { isOpen, open } = useContact();
  const t = useDictionary();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onClick={(event) => {
        onClick?.();
        open(event.currentTarget);
      }}
      className={pillClasses(variant, `cursor-pointer ${className ?? ""}`)}
    >
      {t.common.letsTalk} <ArrowUpRightIcon />
    </button>
  );
}
