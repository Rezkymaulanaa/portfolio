"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { scrollToSection } from "@/lib/scroll";

// Link to a section of a page, e.g. "/#work" or "#work".
// If the section is on the current page, it scrolls there every time it is
// clicked. Otherwise it navigates normally (e.g. from /work to /#work).

type SectionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function SectionLink({ href, className, children, onClick }: SectionLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    // Let Ctrl/Cmd-click open a new tab as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;

    const [path, id] = href.split("#");
    const isSamePage = path === "" || path === window.location.pathname;
    if (id && isSamePage && scrollToSection(id)) {
      event.preventDefault();
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
