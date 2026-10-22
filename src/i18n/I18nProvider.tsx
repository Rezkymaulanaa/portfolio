"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

// Gives components in the browser the current language and its texts.
// Mounted once in app/[lang]/layout.tsx. Server components get the texts
// from getDictionary() instead.

const LocaleContext = createContext<Locale>("en");

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useDictionary(): Dictionary {
  return getDictionary(useLocale());
}
