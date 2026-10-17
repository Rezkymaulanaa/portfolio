import { defineArrayMember, defineField } from "sanity";
import { MOCKUP_SIZE_HINT, mockupField, mockupImagesField } from "./mockup";

// Content blocks for the project detail page ("case study").
// Each project picks the blocks it needs and drags them into order.
// A block with a heading also gets a link in the side menu.

const heading = defineField({
  name: "heading",
  title: "Heading",
  description: "Section title. Also shown in the side menu.",
  type: "string",
});

const intro = defineField({
  name: "intro",
  title: "Intro",
  description: "Optional short text below the heading.",
  type: "text",
  rows: 3,
});

const textBlock = defineArrayMember({
  name: "caseText",
  title: "Text",
  type: "object",
  fields: [
    heading,
    defineField({
      name: "body",
      title: "Text",
      description: "Leave an empty line between paragraphs.",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "points",
      title: "Bullet points",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 2 })],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Text", subtitle: "Text" }) },
});

const statsBlock = defineArrayMember({
  name: "caseStats",
  title: "Numbers",
  type: "object",
  fields: [
    heading,
    defineField({
      name: "items",
      title: "Numbers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", description: "e.g. “100%”", type: "string" }),
            defineField({ name: "label", title: "Label", description: "e.g. “Test success rate”", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.min(1).max(4),
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Numbers", subtitle: "Numbers" }) },
});

const problemsBlock = defineArrayMember({
  name: "caseProblems",
  title: "Problem → Solution",
  type: "object",
  fields: [
    heading,
    intro,
    defineField({
      name: "items",
      title: "Pairs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "problem", title: "Problem", type: "text", rows: 3 }),
            defineField({ name: "solution", title: "Solution", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "problem", subtitle: "solution" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title ?? "Problem → Solution", subtitle: "Problem → Solution" }),
  },
});

const stepsBlock = defineArrayMember({
  name: "caseSteps",
  title: "Steps",
  type: "object",
  fields: [
    heading,
    intro,
    defineField({
      name: "steps",
      title: "Steps",
      description: "Numbered automatically in this order.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Steps", subtitle: "Steps" }) },
});

const imagesBlock = defineArrayMember({
  name: "caseImages",
  title: "Images",
  type: "object",
  fields: [
    heading,
    intro,
    defineField({
      name: "images",
      title: "Images",
      description: `Diagrams, wireframes or screenshots. One per row. ${MOCKUP_SIZE_HINT}`,
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
            defineField({ name: "caption", title: "Caption", type: "string" }),
            mockupField({ name: "mockup", title: "Mockup", description: "Show this image inside a device." }),
            mockupImagesField({
              name: "mockupImages",
              getMockup: ({ parent }) => (parent as { mockup?: string } | undefined)?.mockup,
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", media: "images.0" },
    prepare: ({ title, media }) => ({ title: title ?? "Images", subtitle: "Images", media }),
  },
});

const tableBlock = defineArrayMember({
  name: "caseTable",
  title: "Table",
  type: "object",
  fields: [
    heading,
    intro,
    defineField({
      name: "columns",
      title: "Column titles",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "rows",
      title: "Rows",
      description: "Each row needs one cell per column, in the same order.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 2 })],
            }),
          ],
          preview: { select: { title: "cells.0", subtitle: "cells.1" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Table", subtitle: "Table" }) },
});

export const caseStudyFields = [
  defineField({
    name: "facts",
    title: "Project facts",
    description: "Short facts shown below the header, e.g. Role → “Author & Developer”.",
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "value", title: "Value", type: "string" }),
        ],
        preview: { select: { title: "label", subtitle: "value" } },
      }),
    ],
  }),
  defineField({
    name: "content",
    title: "Case study",
    description:
      "Sections shown below the cover image. Add only the blocks this project needs and drag to reorder. Leave empty for a simple gallery page.",
    type: "array",
    of: [textBlock, statsBlock, problemsBlock, stepsBlock, imagesBlock, tableBlock],
  }),
];
