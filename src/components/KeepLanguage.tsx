"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLocale, LOCALE_COOKIE, localizePath, splitLocale } from "@/i18n/config";

// Back/Forward can land on a page in the other language, e.g. switching to
// Indonesian on a project page and then going back to the (English) home
// page. This shows that page in the picked language instead, in place and
// without adding a step to the history. Only after Back/Forward: an /id or
// English link that was opened on purpose stays as it is.
// Mounted once in the site layout.

type Router = ReturnType<typeof useRouter>;

// The app router (the same object on every page).
let router: Router | null = null;

function pickedLocale() {
  const value = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))?.[1];
  return value && isLocale(value) ? value : null;
}

function keepPickedLanguage() {
  const picked = pickedLocale();
  const { locale, path } = splitLocale(window.location.pathname);
  if (!router || !picked || picked === locale) return;
  window.__revealInstant = true;
  router.replace(localizePath(picked, path) + window.location.search + window.location.hash, { scroll: false });
}

// Listening once for the whole visit, not per page: Next.js shows the page of
// a Back/Forward step right inside its own listener, which removes the old
// page (and a listener tied to it) before that listener would run. The check
// waits until Next.js is done with the step.
if (typeof window !== "undefined" && !window.__keepLanguageListening) {
  window.__keepLanguageListening = true;
  window.addEventListener("popstate", () => window.setTimeout(keepPickedLanguage, 0));
}

declare global {
  interface Window {
    __keepLanguageListening?: boolean;
  }
}

export function KeepLanguage() {
  const currentRouter = useRouter();

  useEffect(() => {
    router = currentRouter;
  }, [currentRouter]);

  return null;
}
