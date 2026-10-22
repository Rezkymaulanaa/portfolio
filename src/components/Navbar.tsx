"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { splitLocale } from "@/i18n/config";
import { useDictionary } from "@/i18n/I18nProvider";
import { LetsTalkButton } from "./contact/ContactProvider";
import { LanguageSwitch } from "./LanguageSwitch";
import { SectionLink } from "./SectionLink";

// Floating pill navbar with two variants:
// - expanded: full bar (availability pill, links, "Let's Talk")
// - collapsed: small pill with four dots
//
// Desktop: expanded at the top of the page, collapsed after scrolling.
// It expands again on mouse hover or keyboard focus.
// Phones/tablets: always collapsed; tapping the dots opens a stacked menu.
// Hidden on the work pages (/work and /work/<slug>), which have a Back button.
// The EN | ID switch sits next to "Let's Talk".

const NAV_LINKS = [
  { key: "work", href: "/#work" },
  { key: "service", href: "/#service" },
  { key: "capabilities", href: "/#capabilities" },
  { key: "about", href: "/#about" },
] as const;

// Scroll positions (px) where the bar collapses / expands again.
// Two different values stop it from flickering around one point.
const COLLAPSE_AFTER = 24;
const EXPAND_BEFORE = 8;
// Delay before collapsing when the mouse leaves the bar.
const LEAVE_DELAY_MS = 300;

type NavbarProps = {
  availabilityLabel?: string;
  isAvailable?: boolean;
};

export function Navbar({ availabilityLabel, isAvailable }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const openedAtScrollY = useRef(0);

  const [isDesktop, setIsDesktop] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);

  const { path } = splitLocale(usePathname());
  const t = useDictionary();
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

  // The work pages (/work and /work/<slug>) use a Back button instead.
  if (path === "/work" || path.startsWith("/work/")) return null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 lg:top-5">
      <nav
        ref={navRef}
        aria-label={t.nav.label}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={[
          "pointer-events-auto relative overflow-hidden rounded-[2.5rem] border",
          "transition-[width,height,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          // The open width is one value ("full width, at most 24rem / 82.5rem"),
          // not w-full + max-w: a max-width cannot animate, so on closing the
          // bar first jumped to the full screen width before shrinking.
          expanded
            ? "h-auto w-[min(24rem,100%)] lg:h-[4.25rem] lg:w-[min(82.5rem,100%)]"
            : "h-11 w-[4.5rem] lg:h-[3.75rem] lg:w-24",
          showBarStyle
            ? "border-white/70 bg-white/25 backdrop-blur-md"
            : "border-line/40 bg-page/95 shadow-float backdrop-blur-md",
        ].join(" ")}
      >
        {/* Collapsed variant: the four-dot button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={t.nav.open}
          aria-expanded={expanded}
          aria-controls="main-menu"
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none ${
            expanded ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Four real circles (not "••••" text), so they sit exactly in the middle.
              Whole-pixel sizes keep them crisp (rem is scaled on desktop). */}
          <span aria-hidden="true" className="flex items-center gap-[5px] 2xl:gap-1.5">
            {[0, 1, 2, 3].map((dot) => (
              <span key={dot} className="size-1.5 rounded-full bg-ink lg:size-[7px] 2xl:size-2" />
            ))}
          </span>
        </button>

        {/* Expanded variant: the full menu */}
        <div
          id="main-menu"
          className={[
            "flex flex-col items-stretch gap-3 p-4",
            "lg:h-full lg:w-[min(calc(82.5rem_-_2px),calc(100vw_-_2rem_-_2px))] lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-3.5 lg:py-0",
            "transition-opacity motion-reduce:transition-none",
            expanded
              ? "opacity-100 delay-150 duration-300"
              : "pointer-events-none opacity-0 duration-150",
          ].join(" ")}
        >
          {isAvailable && availabilityLabel && (
            <p className="flex items-center gap-3 self-start rounded-full border border-line/60 bg-page px-5 py-2 text-nav shadow-pill lg:gap-2 lg:self-auto lg:px-3.5 lg:py-1.5 lg:text-small">
              <span aria-hidden="true" className="size-4 shrink-0 rounded-full bg-available lg:size-3" />
              {availabilityLabel}
            </p>
          )}

          <ul className="flex flex-col lg:flex-row lg:gap-[clamp(1.25rem,3vw,3.5rem)]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <SectionLink
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-full px-1 py-2 text-nav transition-opacity lg:text-small hover:opacity-60 focus-visible:outline-2 focus-visible:outline-ink"
                >
                  {t.nav[link.key]}
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <LanguageSwitch />
            <LetsTalkButton variant="dark" onClick={closeMenu} className="text-nav lg:text-small" />
          </div>
        </div>
      </nav>
    </header>
  );
}
