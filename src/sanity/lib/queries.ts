import { defineQuery } from "next-sanity";

// ---------- Types ----------

export type SanityImage = {
  asset: { _ref: string };
  alt?: string;
  hotspot?: object;
  crop?: object;
};

export type Tool = {
  _id: string;
  name: string;
  icon: SanityImage;
};

export type SiteSettings = {
  fullName: string;
  headline?: string;
  tagline?: string;
  heroImage: SanityImage;
  availabilityLabel?: string;
  isAvailable?: boolean;
  aboutHeading?: string;
  aboutText?: string;
  aboutImage?: SanityImage;
  contactEmail: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  ctaHeading?: string;
  ctaText?: string;
  footerName?: string;
  footerAvatar?: SanityImage;
  usualTools?: Tool[];
  siteTitle?: string;
  siteDescription?: string;
  ogImage?: SanityImage;
};

export type ProjectCardData = {
  _id: string;
  title: string;
  slug: string;
  category: "real-project" | "exploration";
  tags?: string[];
  coverImage: SanityImage;
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
};

// ---------- Queries ----------

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  ...,
  usualTools[]->{ _id, name, icon }
}`);

const PROJECT_CARD_FIELDS = `_id, title, "slug": slug.current, category, tags, coverImage`;

export const FEATURED_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && featured == true] | order(order asc){ ${PROJECT_CARD_FIELDS} }`,
);

export const SERVICES_QUERY = defineQuery(
  `*[_type == "service"] | order(order asc){ _id, title, "slug": slug.current, description }`,
);
