import { defineArrayMember, defineField, defineType } from "sanity";
import { withIndonesian } from "./i18n";

export const skillGroup = defineType({
  name: "skillGroup",
  title: "Skill group",
  type: "document",
  fields: [
    ...withIndonesian(
      defineField({
        name: "title",
        title: "Title",
        description: "e.g. “Business Process Management”.",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ),
    ...withIndonesian(
      defineField({
        name: "items",
        title: "Items",
        description: "Each item is one bullet point.",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
        validation: (rule) => rule.required().min(1),
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
