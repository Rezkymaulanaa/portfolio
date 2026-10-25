"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitLocale } from "@/i18n/config";
import { getSmoothScroll, setSmoothScroll } from "@/lib/smooth-scroll";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// Smooth scrolling with Lenis (like charlesleclerc.com): the mouse wheel and
// touchpad glide to a stop instead of jumping per wheel step, so every
// scroll animation (GSAP ScrollTrigger) moves smoothly too.
// Lenis still uses the browser's own scroll position, so sticky elements
// and links to sections keep working as before.
// Touch screens keep their own (already smooth) scrolling. Off for visitors
// who prefer reduced motion.
//
// Also decides where every page opens, because GSAP ScrollTrigger switches
// the browser's own scroll memory off at times (history.scrollRestoration):
// - a new page opens at the top (or at its #section),
// - Back and Forward return to the exact spot the page was left at,
// - EN | ID keeps the spot.

// Last scroll position per page, without the language part of the address,
// so a page left in English is restored in Indonesian too (KeepLanguage).
const positions = new Map<string, number>();
// True between a Back/Forward step and the moment its page is shown.
let restoring = false;
// The page on screen and its scroll position, kept up to date while
// scrolling. Saved for that page the moment the next page is shown: not
// later, because the browser then cuts the position down to the new,
// often shorter page (and to the home page without its pinned sections).
let shownPage: string | null = null;
let shownTop = 0;
// Stops a restore that is still running (see restore below).
let stopRestore: (() => void) | null = null;

function scrollToPosition(top: number) {
  const lenis = getSmoothScroll();
  if (lenis) {
    // Lenis measures the page height only now and then; right after a page
    // change it still has the previous page's height and would stop short.
    lenis.resize();
    lenis.scrollTo(top, { immediate: true, force: true });
  } else {
    window.scrollTo({ top, behavior: "instant" });
  }
}

// Scrolls to `top`, and again every time the page grows or is measured again
// during the next second: the pinned sections of the home page (ScrollTrigger)
// add their space only after the page is shown, and the position would be cut
// short before that. Stops early once the visitor scrolls, clicks or types.
function restore(top: number) {
  stopRestore?.();
  const again = () => scrollToPosition(top);
  again();

  const resizes = new ResizeObserver(again);
  resizes.observe(document.body);
  ScrollTrigger.addEventListener("refresh", again);
  let frame = requestAnimationFrame(() => {
    again();
    frame = requestAnimationFrame(again);
  });
  const inputs = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  const stop = () => {
    resizes.disconnect();
    ScrollTrigger.removeEventListener("refresh", again);
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    inputs.forEach((type) => window.removeEventListener(type, stop, true));
    if (stopRestore === stop) stopRestore = null;
  };
  const timer = window.setTimeout(stop, 1000);
  inputs.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }));
  stopRestore = stop;
}

// Listening once for the whole visit, not per mounted component: Next.js
// shows the page of a Back/Forward step right inside its own popstate
// listener, so this one must run before it. Listeners added at this point
// (before the app starts) come first; listeners added again after a language
// switch rebuilt this component would come after Next.js, and Back would be
// taken for a new page (opening at the top).
if (typeof window !== "undefined" && !window.__smoothScrollListening) {
  window.__smoothScrollListening = true;
  window.addEventListener("scroll", () => (shownTop = window.scrollY), { passive: true });
  // A click starts a new step (a link, or the Back button of a project,
  // which sets this again through popstate).
  document.addEventListener("click", () => (restoring = false), true);
  window.addEventListener("popstate", () => (restoring = true));
}

declare global {
  interface Window {
    __smoothScrollListening?: boolean;
  }
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // stopInertiaOnNavigate: a glide still running when a link to another
    // page is clicked stops right there, so it does not carry on in the new
    // page (it would pull the new page down to the middle).
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false, stopInertiaOnNavigate: true });
    setSmoothScroll(lenis);

    // GSAP's clock drives Lenis, and every Lenis step updates ScrollTrigger,
    // so both move in the same frame.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setSmoothScroll(null);
      lenis.destroy();
    };
  }, []);

  // When a page is shown, before the browser draws it (and before Next.js
  // looks at the scroll position). This component is also rebuilt by a
  // language switch, so it may run for the same page again.
  useLayoutEffect(() => {
    const page = splitLocale(pathname).path;
    // A glide still running from the previous page must not carry on
    // (e.g. Back pressed with the browser button while scrolling).
    getSmoothScroll()?.scrollTo(window.scrollY, { immediate: true, force: true });

    const previous = shownPage;
    shownPage = page;
    if (previous === null) return; // First page of the visit.
    positions.set(previous, shownTop);
    const isBackOrForward = restoring;
    restoring = false;

    if (page === previous) {
      // Same page in the other language (EN | ID, or KeepLanguage right
      // after Back). A restore still running keeps its target.
      if (!stopRestore) restore(shownTop);
    } else if (isBackOrForward) {
      restore(positions.get(page) ?? 0);
    } else {
      stopRestore?.();
      // A new page starts at the top; Next.js scrolls to a #section itself.
      if (!window.location.hash) scrollToPosition(0);
    }
  }, [pathname]);

  return null;
}
