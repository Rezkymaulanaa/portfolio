"use client";

import { useEffect, useLayoutEffect } from "react";

// Scroll animation for every element with the class "reveal" (styles in
// globals.css). An element animates in when it scrolls into view, and resets
// when it leaves again below the screen (scrolling back up), so it plays again
// on the next scroll down. Leaving at the top does not reset it, so content
// never disappears while reading down the page.
// Elements that enter at the same moment get a small delay one after another
// (stagger). New elements (page changes, filter tabs) are picked up
// automatically.
//
// Animations are on when the <head> script set data-reveal on <html>. React
// resets <html> to the attributes written in the layout whenever it rebuilds
// it (a language switch, and every remount in development), which removes
// data-reveal. So once animations are on, this component puts the attribute
// back every time it disappears.

const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 6;

declare global {
  interface Window {
    __revealReady?: boolean;
    /** Set by the EN | ID switch: show the rebuilt page without animations. */
    __revealInstant?: boolean;
  }
}

// Decided once per visit (the page JavaScript stays loaded across navigations):
// true when the <head> script switched animations on.
let animationsOn: boolean | null = null;
// True for the two frames of a language switch (data-reveal-instant).
let instantActive = false;

function restoreAttributes() {
  const root = document.documentElement;
  if (animationsOn && !root.hasAttribute("data-reveal")) root.setAttribute("data-reveal", "");
  if (instantActive && !root.hasAttribute("data-reveal-instant")) root.setAttribute("data-reveal-instant", "");
}

export function RevealObserver({ locale }: { locale: string }) {
  // After a language switch: mark everything down to the bottom of the screen
  // as already shown, then let animations work again (see globals.css).
  // A layout effect runs after the page is rebuilt but before the browser
  // draws it, so the new content never shows up hidden or animating.
  useLayoutEffect(() => {
    restoreAttributes();
    if (!animationsOn || !window.__revealInstant) return;
    instantActive = true;
    restoreAttributes();
    document.querySelectorAll<HTMLElement>(".reveal").forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        element.style.setProperty("--reveal-delay", "0ms");
        element.classList.add("is-visible");
      }
    });
    // Two frames later, so the browser has applied the classes without
    // animating. Only then is the switch finished (in development React runs
    // this twice; the second run must still find the flag).
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        window.__revealInstant = false;
        instantActive = false;
        document.documentElement.removeAttribute("data-reveal-instant");
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  useEffect(() => {
    const root = document.documentElement;
    animationsOn ??= root.hasAttribute("data-reveal");
    if (!animationsOn) return;
    window.__revealReady = true;
    restoreAttributes();

    // Puts data-reveal back right away whenever React removes it.
    const attributes = new MutationObserver(restoreAttributes);
    attributes.observe(root, { attributes: true, attributeFilter: ["data-reveal", "data-reveal-instant"] });

    // Shows elements once they are a little inside the screen.
    const showObserver = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting && !entry.target.classList.contains("is-visible"))
          .map((entry) => entry.target as HTMLElement)
          // Page order, so the stagger runs from top to bottom.
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

        entering.forEach((element, index) => {
          const delay = Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;
          element.style.setProperty("--reveal-delay", `${delay}ms`);
          element.classList.add("is-visible");
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    // Resets elements that are completely out of the screen below.
    const resetObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          const element = entry.target as HTMLElement;
          element.style.setProperty("--reveal-delay", "0ms");
          element.classList.remove("is-visible");
        }
      }
    });

    const observed = new WeakSet<Element>();
    const observeNew = () => {
      document.querySelectorAll(".reveal").forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        showObserver.observe(element);
        resetObserver.observe(element);
      });
    };
    observeNew();

    // Watch for elements added later (client-side page changes, filters).
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observeNew);
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      attributes.disconnect();
      showObserver.disconnect();
      resetObserver.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
