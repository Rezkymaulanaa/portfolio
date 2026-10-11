import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./imageWithAlt";

export const PROJECT_CATEGORIES = [
  { title: "Real Project", value: "real-project" },
  { title: "Exploration", value: "exploration" },
];

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Project name shown on the card and the detail page.",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      description:
        "Part of the page address: /work/<slug>. Click “Generate” to create it from the title.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Used by the filter tabs (All / Real Project / Exploration).",
      type: "string",
      options: { list: PROJECT_CATEGORIES, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Short labels shown as pink pills, e.g. “Web App”. Type and press Enter.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "service",
      title: "Service",
      description: "Which service this project belongs to (shown on the detail page).",
      type: "reference",
      to: [{ type: "service" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      description: "One or two sentences shown under the title on the detail page.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      description: "How long the project took, e.g. “4 Weeks”.",
      type: "string",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      description: "Tools used in this project (icons on the detail page).",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tool" }] })],
      validation: (rule) => rule.unique(),
    }),
    imageWithAlt({
      name: "coverImage",
      title: "Cover image",
      description: "Main image used on the card and at the top of the detail page.",
      required: true,
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Extra images shown below the cover on the detail page (optional).",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required().error("Alt text is required."),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "livePreviewUrl",
      title: "Live preview URL",
      description: "Link for the “Live Preview” button. Leave empty to hide the button.",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "featured",
      title: "Featured on home page",
      description: "Turn on to show this project in “Selected Work” on the home page.",
      type: "boolean",
      initialValue: false,
    }),
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
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
    prepare({ title, subtitle, media }) {
      const category = PROJECT_CATEGORIES.find((c) => c.value === subtitle);
      return { title, subtitle: category?.title, media };
    },
  },
});
