"use client";

import { useEffect } from "react";
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
// Also remembers the scroll position of every page, so Back and Forward
// return to the exact spot. The browser normally does this itself, but GSAP
// ScrollTrigger switches that off at times (history.scrollRestoration), and
// the page would then open at the top (the hero) instead.

// Last scroll position per page, without the language part of the address,
// so a page left in English is restored in Indonesian too (KeepLanguage).
const positions = new Map<string, number>();
// True between a Back/Forward step and the moment its page is shown.
let restoring = false;

const pageKey = () => splitLocale(window.location.pathname).path;

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

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Remember the position the moment something is clicked (a link to
    // another page, the Back button, EN | ID), before the page changes.
    // Not while scrolling: when a page is left, its pinned sections are
    // removed first and the browser cuts the scroll position down to the
    // now shorter page, which would be remembered instead.
    const remember = () => positions.set(pageKey(), window.scrollY);
    const onPopState = () => {
      restoring = true;
    };
    window.history.scrollRestoration = "manual";
    document.addEventListener("click", remember, true);
    window.addEventListener("popstate", onPopState);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        document.removeEventListener("click", remember, true);
        window.removeEventListener("popstate", onPopState);
      };
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
    setSmoothScroll(lenis);

    // GSAP's clock drives Lenis, and every Lenis step updates ScrollTrigger,
    // so both move in the same frame.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", remember, true);
      window.removeEventListener("popstate", onPopState);
      gsap.ticker.remove(tick);
      setSmoothScroll(null);
      lenis.destroy();
    };
  }, []);

  // After a page change: Back/Forward returns to the remembered position,
  // repeated on the next frames, after ScrollTrigger has added the space for
  // its pinned sections. Otherwise the page stays where Next.js put it (top
  // of a new page, same spot after a language switch). Either way a glide
  // still running from the previous page must not carry on.
  useEffect(() => {
    const saved = restoring ? positions.get(pageKey()) : undefined;
    restoring = false;
    if (saved === undefined) {
      getSmoothScroll()?.scrollTo(window.scrollY, { immediate: true, force: true });
      return;
    }
    const target = saved;
    scrollToPosition(target);
    // Pinned sections are measured again (ScrollTrigger refresh) right after
    // the page is shown, which can move the page; the position is set again
    // after that, and on the next frames, for up to half a second.
    const again = () => scrollToPosition(target);
    ScrollTrigger.addEventListener("refresh", again);
    let frame = requestAnimationFrame(() => {
      again();
      frame = requestAnimationFrame(again);
    });
    const timers = [100, 250, 500].map((delay) => window.setTimeout(again, delay));
    const stop = window.setTimeout(() => ScrollTrigger.removeEventListener("refresh", again), 600);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(stop);
      ScrollTrigger.removeEventListener("refresh", again);
    };
  }, [pathname]);

  return null;
}
