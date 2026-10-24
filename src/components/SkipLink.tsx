"use client";

import { useDictionary } from "@/i18n/I18nProvider";

// Hidden link that appears on the first Tab press, so keyboard users can
// jump straight to the page content (without a step in the browser history).

export function SkipLink() {
  const label = useDictionary().common.skipToContent;

  return (
    <a
      href="#main"
      onClick={(event) => {
        const main = document.getElementById("main");
        if (!main) return;
        event.preventDefault();
        // Keyboard focus moves into the content, so the next Tab continues there.
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
        main.scrollIntoView({ block: "start" });
      }}
      className="sr-only rounded-card bg-ink px-5 py-2 text-page focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
    >
      {label}
    </a>
  );
}
