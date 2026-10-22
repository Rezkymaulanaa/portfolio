import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

// Picks the language of content from Sanity. Text fields have an Indonesian
// twin with the suffix "Id" (title → titleId, see schemaTypes/i18n.ts).
// For Indonesian, every field whose twin is filled in gets the twin's value;
// an empty twin keeps the English text. Works through nested objects and
// arrays (case study blocks), and removes the twins from the result.

const SUFFIX = "Id";

// Translatable fields hold text or a list. Other "...Id" pairs (e.g. an
// image "asset" object next to "assetId") are never treated as twins.
function isTextLike(value: unknown) {
  return typeof value === "string" || Array.isArray(value) || value === null || value === undefined;
}

function hasContent(value: unknown) {
  if (typeof value === "string") return value.trim() !== "";
  return Array.isArray(value) && value.length > 0;
}

function isTwinPair(source: Record<string, unknown>, key: string, twinKey: string) {
  return key in source && isTextLike(source[key]) && isTextLike(source[twinKey]);
}

export function localize<T>(value: T, locale: Locale): T {
  if (Array.isArray(value)) return value.map((item) => localize(item, locale)) as T;
  if (!value || typeof value !== "object") return value;

  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, fieldValue] of Object.entries(source)) {
    // The twin itself ("titleId" next to "title") is not passed on.
    if (key.endsWith(SUFFIX) && isTwinPair(source, key.slice(0, -SUFFIX.length), key)) continue;
    const twinKey = `${key}${SUFFIX}`;
    const useTwin =
      locale !== DEFAULT_LOCALE && twinKey in source && isTwinPair(source, key, twinKey) && hasContent(source[twinKey]);
    result[key] = localize(useTwin ? source[twinKey] : fieldValue, locale);
  }
  return result as T;
}
