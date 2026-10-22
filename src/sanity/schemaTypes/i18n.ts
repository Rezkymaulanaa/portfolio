import type { FieldDefinition } from "sanity";

// Indonesian version of a text field, placed right below the English one:
// "title" gets a twin "titleId" (Id = Indonesia). The English fields keep
// their old names, so existing content is untouched.
// On /id pages the website shows the twin, and falls back to the English
// text while the twin is empty (see src/sanity/lib/localize.ts).
//
// Usage inside a fields list: ...withIndonesian(defineField({ ... }))

export const INDONESIAN_SUFFIX = "Id";

export function withIndonesian(field: FieldDefinition): FieldDefinition[] {
  const twin = {
    ...field,
    name: `${field.name}${INDONESIAN_SUFFIX}`,
    title: `${field.title ?? field.name} (Indonesia)`,
    description: "Bahasa Indonesia. Leave empty to show the English text on the Indonesian site.",
    // Optional: an empty twin simply shows the English text.
    validation: undefined,
    initialValue: undefined,
  } as FieldDefinition;
  return [field, twin];
}
