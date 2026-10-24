import type { ReactNode } from "react";
import { LocalizedLink } from "./LocalizedLink";
import { SectionLink } from "./SectionLink";

// Shared buttons and links.
// variant: accent (pink), dark (near-black), outline (bordered), light (white).
// shape: "card" (4px corners, the default) or "pill" (fully round; navbar).

type Variant = "accent" | "dark" | "outline" | "light";

const variantClasses: Record<Variant, string> = {
  accent: "bg-accent text-ink shadow-pill hover:brightness-95",
  dark: "bg-ink text-page shadow-pill hover:bg-ink/85",
  outline: "border border-line text-ink hover:bg-surface",
  light: "border border-line bg-page text-ink shadow-pill hover:bg-surface",
};

export function pillClasses(variant: Variant, extra = "", shape: "card" | "pill" = "card") {
  return [
    `inline-flex items-center justify-center gap-[0.5em] ${shape === "pill" ? "rounded-full" : "rounded-card"} px-[1.1em] py-[0.45em]`,
    "whitespace-nowrap transition duration-200 motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    variantClasses[variant],
    extra,
  ].join(" ");
}

type PillLinkProps = {
  href: string;
  variant: Variant;
  children: ReactNode;
  className?: string;
  /** Opens in a new tab (for links to other websites). */
  external?: boolean;
  onClick?: () => void;
};

export function PillLink({ href, variant, children, className, external, onClick }: PillLinkProps) {
  const classes = pillClasses(variant, className);

  // Links to other sites, email links, and in-page anchors use a plain <a>.
  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  // Links to a section ("#work", "/#work") scroll there on every click.
  if (href.includes("#")) {
    return (
      <SectionLink href={href} className={classes} onClick={onClick}>
        {children}
      </SectionLink>
    );
  }

  return (
    <LocalizedLink href={href} className={classes} onClick={onClick}>
      {children}
    </LocalizedLink>
  );
}
