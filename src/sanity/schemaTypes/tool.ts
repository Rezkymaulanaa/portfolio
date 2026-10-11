import { defineField, defineType } from "sanity";

export const tool = defineType({
  name: "tool",
  title: "Tool",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Tool name, also used as the icon's alt text, e.g. “Figma”.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Square logo (SVG or PNG).",
      type: "image",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", media: "icon" },
  },
});
