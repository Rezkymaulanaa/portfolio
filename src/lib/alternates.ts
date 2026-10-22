import { DEFAULT_LOCALE, LOCALES, localizePath, type Locale } from "@/i18n/config";

// Canonical address of a page plus its address in every language, for
// Google ("hreflang") and link previews. path is the English address,
// e.g. "/work". "x-default" tells Google which version to show to everyone else.
export function alternatesFor(locale: Locale, path: string) {
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((other) => [other, localizePath(other, path)]),
  );
  languages["x-default"] = localizePath(DEFAULT_LOCALE, path);
  return { canonical: localizePath(locale, path), languages };
}
