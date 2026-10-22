import { defineField, defineType } from "sanity";
import { withIndonesian } from "./i18n";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    ...withIndonesian(
      defineField({
        name: "title",
        title: "Title",
        description: "Shown in large uppercase letters, e.g. “UI/UX Design”.",
        type: "string",
        validation: (rule) => rule.required().max(40),
      }),
    ),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    ...withIndonesian(
      defineField({
        name: "description",
        title: "Description",
        description: "Short text that appears when the row is hovered (one or two lines).",
        type: "text",
        rows: 2,
        validation: (rule) => rule.required().max(140),
      }),
    ),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers are shown first.",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
