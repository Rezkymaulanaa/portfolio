import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./imageWithAlt";

// Single document with all site-wide texts, links and images.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact & CTA" },
    { name: "capabilities", title: "Capabilities" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({
      name: "fullName",
      title: "Full name",
      description: "Shown very large in the hero, one word per line.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      description: "Bold line below the name, e.g. “Bachelor of Information System”.",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "Short sentence below the headline.",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    imageWithAlt({
      name: "heroImage",
      title: "Hero photo",
      description: "Large photo on the right side of the hero.",
      required: true,
      group: "hero",
    }),
    defineField({
      name: "availabilityLabel",
      title: "Availability label",
      description: "Text in the navbar pill, e.g. “Available for New Project”.",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "isAvailable",
      title: "Available for work",
      description: "Turn off to hide the availability pill in the navbar.",
      type: "boolean",
      initialValue: true,
      group: "hero",
    }),

    // About
    defineField({
      name: "aboutHeading",
      title: "About heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutText",
      title: "About text",
      description: "A few short paragraphs about you. Leave an empty line between paragraphs.",
      type: "text",
      rows: 8,
      group: "about",
    }),
    imageWithAlt({
      name: "aboutImage",
      title: "About photo",
      group: "about",
    }),

    // Contact & CTA
    defineField({
      name: "contactEmail",
      title: "Contact email",
      description: "Used by every “Let's Talk” button.",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA heading",
      description: "e.g. “Have a project in mind?”",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "ctaText",
      title: "CTA text",
      type: "text",
      rows: 3,
      group: "contact",
    }),
    defineField({
      name: "footerName",
      title: "Footer name",
      description: "Short name in the dark footer pill, e.g. “Alif Rezky”.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "footerAvatar",
      title: "Footer avatar",
      description: "Small round picture next to the footer name (optional).",
      type: "image",
      group: "contact",
    }),

    // Capabilities
    defineField({
      name: "usualTools",
      title: "Tools I usually use",
      description: "Icons shown in the Capabilities section. Drag to reorder.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tool" }] })],
      group: "capabilities",
      validation: (rule) => rule.unique(),
    }),

    // SEO
    defineField({
      name: "siteTitle",
      title: "Site title",
      description: "Shown in the browser tab and search results.",
      type: "string",
      group: "seo",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      description: "Shown in search results (about 150 characters).",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      description: "Image shown when the site is shared on social media (1200×630).",
      type: "image",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
