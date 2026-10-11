"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon } from "./icons";
import { PillLink } from "./Pill";
import { SectionLink } from "./SectionLink";

// Floating pill navbar with two variants:
// - expanded: full bar (availability pill, links, "Let's Talk")
// - collapsed: small pill with four dots
//
// Desktop: expanded at the top of the page, collapsed after scrolling.
// It expands again on mouse hover or keyboard focus.
// Phones/tablets: always collapsed; tapping the dots opens a stacked menu.
// Hidden on project detail pages.

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Service", href: "/#service" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "About Me", href: "/#about" },
];

// Scroll positions (px) where the bar collapses / expands again.
// Two different values stop it from flickering around one point.
const COLLAPSE_AFTER = 24;
const EXPAND_BEFORE = 8;
// Delay before collapsing when the mouse leaves the bar.
const LEAVE_DELAY_MS = 300;

type NavbarProps = {
  availabilityLabel?: string;
  isAvailable?: boolean;
  contactEmail: string;
};

export function Navbar({ availabilityLabel, isAvailable, contactEmail }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const openedAtScrollY = useRef(0);

  const [isDesktop, setIsDesktop] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);

  const pathname = usePathname();
  const expanded = (isDesktop && atTop) || hovered || focused || tapped;

  // Desktop or not (the full bar only fits on large screens).
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Watch the scroll position.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop((wasAtTop) => (wasAtTop ? y < COLLAPSE_AFTER : y < EXPAND_BEFORE));
      // A tapped-open menu closes when the user scrolls.
      if (Math.abs(y - openedAtScrollY.current) > 10) {
        setTapped(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A tapped-open menu closes when the user taps outside of it or presses Escape.
  useEffect(() => {
    if (!tapped) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setTapped(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTapped(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [tapped]);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  function handlePointerEnter(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(leaveTimer.current);
    setHovered(true);
  }

  function handlePointerLeave(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    leaveTimer.current = window.setTimeout(() => setHovered(false), LEAVE_DELAY_MS);
  }

  function handleFocus(event: React.FocusEvent) {
    // Only keyboard focus expands the bar (mouse and touch have their own rules).
    if ((event.target as HTMLElement).matches(":focus-visible")) setFocused(true);
  }

  function handleBlur(event: React.FocusEvent) {
    if (!navRef.current?.contains(event.relatedTarget as Node)) setFocused(false);
  }

  function toggleMenu() {
    openedAtScrollY.current = window.scrollY;
    setTapped((open) => !open);
  }

  function closeMenu() {
    setTapped(false);
  }

  const showBarStyle = expanded && atTop && isDesktop;

  // Project detail pages (/work/<slug>) have no navbar, as in the design.
  if (pathname.startsWith("/work/")) return null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 lg:top-10">
      <nav
        ref={navRef}
        aria-label="Main"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={[
          "pointer-events-auto relative overflow-hidden rounded-[2.5rem] border",
          "transition-[width,height,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          expanded
            ? "h-auto w-full max-w-sm lg:h-[5.625rem] lg:max-w-[82.5rem]"
            : "h-14 w-24 lg:h-[4.75rem] lg:w-28",
          showBarStyle
            ? "border-white/70 bg-white/25 backdrop-blur-md"
            : "border-line/40 bg-page/95 shadow-float backdrop-blur-md",
        ].join(" ")}
      >
        {/* Collapsed variant: the four-dot button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Open navigation"
          aria-expanded={expanded}
          aria-controls="main-menu"
          className={`absolute inset-x-0 top-0 flex h-14 items-center justify-center text-2xl leading-none tracking-[0.1em] transition-opacity duration-200 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none lg:h-[4.75rem] ${
            expanded ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span aria-hidden="true" className="-mt-2 font-bold">
            ••••
          </span>
        </button>

        {/* Expanded variant: the full menu */}
        <div
          id="main-menu"
          className={[
            "flex flex-col items-stretch gap-3 p-4",
            "lg:h-full lg:w-[min(calc(82.5rem_-_2px),calc(100vw_-_2rem_-_2px))] lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-6 lg:py-0",
            "transition-opacity motion-reduce:transition-none",
            expanded
              ? "opacity-100 delay-150 duration-300"
              : "pointer-events-none opacity-0 duration-150",
          ].join(" ")}
        >
          {isAvailable && availabilityLabel && (
            <p className="flex items-center gap-3 self-start rounded-full border border-line/60 bg-page px-5 py-2 text-nav shadow-pill lg:self-auto">
              <span aria-hidden="true" className="size-4 shrink-0 rounded-full bg-available lg:size-5" />
              {availabilityLabel}
            </p>
          )}

          <ul className="flex flex-col lg:flex-row lg:gap-[clamp(1.25rem,3vw,3.5rem)]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <SectionLink
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-full px-1 py-2 text-nav transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-ink"
                >
                  {link.label}
                </SectionLink>
              </li>
            ))}
          </ul>

          <PillLink
            href={`mailto:${contactEmail}`}
            variant="dark"
            onClick={closeMenu}
            className="self-start text-nav lg:self-auto"
          >
            Let&apos;s Talk <ArrowUpRightIcon />
          </PillLink>
        </div>
      </nav>
    </header>
  );
}
