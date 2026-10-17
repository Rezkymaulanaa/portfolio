"use client";

import { useEffect } from "react";

// Scroll animation for every element with the class "reveal" (styles in
// globals.css). An element animates in when it scrolls into view, and resets
// when it leaves again below the screen (scrolling back up), so it plays again
// on the next scroll down. Leaving at the top does not reset it, so content
// never disappears while reading down the page.
// Elements that enter at the same moment get a small delay one after another
// (stagger). New elements (page changes, filter tabs) are picked up
// automatically.

const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 6;

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

export function RevealObserver() {
  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-reveal")) return;
    window.__revealReady = true;

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
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      showObserver.disconnect();
      resetObserver.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
