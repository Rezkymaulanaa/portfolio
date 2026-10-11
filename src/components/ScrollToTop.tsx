"use client";

import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/scroll";
import { ArrowUpIcon } from "./icons";

// Round "back to top" button in the bottom-right corner.
// It appears after scrolling down more than one screen.

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    scrollToTop();
    // The button hides at the top, so don't leave keyboard focus on it.
    event.currentTarget.blur();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed right-4 bottom-4 z-40 flex size-12 items-center justify-center rounded-full bg-ink text-page shadow-float transition-[opacity,transform,visibility,background-color] duration-300 hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none lg:right-8 lg:bottom-8 lg:size-14 ${
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
      }`}
    >
      <ArrowUpIcon className="size-5 lg:size-6" />
    </button>
  );
}
