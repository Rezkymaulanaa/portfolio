import { defineArrayMember, defineField } from "sanity";

// Device mockups an image can be shown in (drawn by components/ProjectCover.tsx).
export const MOCKUP_OPTIONS = [
  { title: "Image only", value: "image" },
  { title: "Laptop", value: "laptop" },
  { title: "Mobile", value: "mobile" },
  { title: "Instagram Feed", value: "instagram" },
  { title: "Instagram Profile (3×3 grid)", value: "instagram-profile" },
  { title: "Instagram Carousel", value: "instagram-carousel" },
];

// Mockups that show more than one image.
export const MULTI_IMAGE_MOCKUPS = ["instagram-profile", "instagram-carousel"];

export const MOCKUP_SIZE_HINT =
  "For a mockup, upload a plain screenshot: Laptop → 16:10 (e.g. 1440×900), Mobile → 9:19.5 (e.g. 390×844), Instagram Feed / Carousel → 4:5 (e.g. 1080×1350), Instagram Profile → 3:4 (e.g. 1080×1440).";

// Radio field to pick the mockup of an image.
export function mockupField(options: { name: string; title: string; description: string }) {
  return defineField({
    ...options,
    type: "string",
    options: { list: MOCKUP_OPTIONS, layout: "radio" },
    initialValue: "image",
  });
}

// Extra images for the Instagram Profile and Carousel mockups. The main image
// is always number 1; these follow in order. Hidden for the other mockups.
export function mockupImagesField(options: {
  name: string;
  /** Returns the chosen mockup, to show this field only when it is needed. */
  getMockup: (context: { parent?: unknown; document?: unknown }) => unknown;
}) {
  return defineField({
    name: options.name,
    title: "Extra images",
    description:
      "Instagram Profile: the main image is post 1 (top-left), then these fill the grid left to right, top to bottom (up to 8 more = 9 posts). Instagram Carousel: the main image is slide 1, then these slides in order (up to 19 more). Drag to reorder.",
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
    options: { layout: "grid" },
    hidden: (context) => !MULTI_IMAGE_MOCKUPS.includes(String(options.getMockup(context))),
    validation: (rule) => rule.max(19),
  });
}
