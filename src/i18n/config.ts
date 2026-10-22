// Languages of the website. English lives at the normal addresses (/work),
// Indonesian under /id (/id/work). proxy.ts sends English requests to the
// [lang] = "en" pages behind the scenes, so the address bar stays clean.

export const LOCALES = ["en", "id"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Cookie that remembers the language picked with the EN | ID switch.
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Used for <html lang> and link previews.
export const OG_LOCALES: Record<Locale, string> = { en: "en_US", id: "id_ID" };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Address of a page in a language: localizePath("id", "/work") → "/id/work".
// Keeps "#section" and "?query" parts. Only for addresses starting with "/".
export function localizePath(locale: Locale, href: string) {
  if (locale === DEFAULT_LOCALE || !href.startsWith("/")) return href;
  const [, path, rest] = href.match(/^([^#?]*)(.*)$/) ?? ["", href, ""];
  return `/${locale}${path === "/" ? "" : path}${rest}`;
}

// Splits an address into its language and the address without it:
// "/id/work" → { locale: "id", path: "/work" }, "/work" → { locale: "en", path: "/work" }.
// Also understands the internal "/en/..." form.
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, rest] = pathname.match(/^\/([^/]+)(\/.*)?$/) ?? [];
  if (first && isLocale(first)) return { locale: first, path: rest ?? "/" };
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

// Fills in "{name}"-style placeholders in a dictionary text.
export function format(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}
