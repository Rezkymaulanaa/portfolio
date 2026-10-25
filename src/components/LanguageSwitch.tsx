"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LOCALE_COOKIE, LOCALES, localizePath, splitLocale, type Locale } from "@/i18n/config";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";

// "EN | ID" switch: shows the same page in the other language and remembers
// the choice (cookie, 1 year), so proxy.ts does not switch it back.
// The switch happens in place: no page reload, same scroll position, and
// no entrance animations (data-reveal-instant, see globals.css).

const LABELS: Record<Locale, string> = { en: "EN", id: "ID" };
const ONE_YEAR = 60 * 60 * 24 * 365;

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useDictionary();
  const router = useRouter();
  const { path } = splitLocale(usePathname());
  // The picked language lights up at once, even while the page is loading.
  const [picked, setPicked] = useState<Locale | null>(null);
  // Forget the pick once the page language changed (also via the back button).
  const [pickedOn, setPickedOn] = useState(locale);
  if (pickedOn !== locale) {
    setPickedOn(locale);
    setPicked(null);
  }
  const shown = picked ?? locale;

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, option: Locale) {
    // Let Ctrl/Cmd-click open the other language in a new tab as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    if (option === shown) return;
    setPicked(option);
    rememberLocale(option);
    showNextPageInstantly();
    // replace, not push: switching language is not a step back in history,
    // so Back still goes to the page before.
    router.replace(localizePath(option, path) + window.location.search + window.location.hash, { scroll: false });
  }

  return (
    <nav aria-label={t.common.language} className={className}>
      <ul className="flex items-center rounded-full border border-line/70 bg-surface/70 p-0.5 text-label font-semibold">
        {LOCALES.map((option) => {
          const isActive = option === shown;
          return (
            <li key={option}>
              <a
                href={localizePath(option, path)}
                hrefLang={option}
                lang={option}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => handleClick(event, option)}
                className={`block rounded-full px-2.5 py-1 tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink motion-reduce:transition-none ${
                  isActive ? "bg-ink text-page" : "text-muted hover:text-ink"
                }`}
              >
                {LABELS[option]}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Cookie read by proxy.ts on the next visit.
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

// Skips the entrance animations of the rebuilt page. RevealObserver picks
// this up when the new page is in place (a flag on <html> would not survive
// the rebuild, see there).
function showNextPageInstantly() {
  window.__revealInstant = true;
  // Safety net if the new page never arrives (e.g. offline).
  window.setTimeout(() => {
    window.__revealInstant = false;
  }, 5000);
}
