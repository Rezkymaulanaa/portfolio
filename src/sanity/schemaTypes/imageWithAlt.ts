import { defineField } from "sanity";

// Reusable image field that always asks for alt text.
// Alt text describes the image for screen readers and search engines.
export function imageWithAlt(options: {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
  group?: string;
}) {
  return defineField({
    name: options.name,
    title: options.title,
    description: options.description,
    group: options.group,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        description:
          "Short description of the image, e.g. “Home page of the Nala mobile app”.",
        type: "string",
        validation: (rule) => rule.required().error("Alt text is required."),
      }),
    ],
    validation: options.required
      ? (rule) => rule.required().error("This image is required.")
      : undefined,
  });
}
