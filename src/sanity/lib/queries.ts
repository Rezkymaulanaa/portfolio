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

// Display names of the project categories (values are stored in Sanity).
export const CATEGORY_LABELS = {
  "real-project": "Real Project",
  exploration: "Exploration",
} as const;

export type ProjectCardData = {
  _id: string;
  title: string;
  slug: string;
  category: keyof typeof CATEGORY_LABELS;
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

export type SkillGroup = {
  _id: string;
  title: string;
  items: string[];
};

export const SKILL_GROUPS_QUERY = defineQuery(
  `*[_type == "skillGroup"] | order(order asc){ _id, title, items }`,
);

export const ALL_PROJECTS_QUERY = defineQuery(
  `*[_type == "project"] | order(order asc){ ${PROJECT_CARD_FIELDS} }`,
);

export const PROJECT_SLUGS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)].slug.current`,
);

// Image with its width/height, so the page does not jump while it loads.
export type SizedImage = SanityImage & {
  _key?: string;
  dimensions?: { width: number; height: number };
};

export type ProjectDetail = {
  _id: string;
  title: string;
  slug: string;
  tags?: string[];
  shortDescription?: string;
  timeline?: string;
  livePreviewUrl?: string;
  service?: string;
  tools?: Tool[];
  coverImage: SizedImage;
  gallery?: SizedImage[];
};

const SIZED_IMAGE = `..., "dimensions": asset->metadata.dimensions{ width, height }`;

export const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, tags, shortDescription, timeline, livePreviewUrl,
  "service": service->title,
  tools[]->{ _id, name, icon },
  coverImage{ ${SIZED_IMAGE} },
  gallery[]{ ${SIZED_IMAGE} }
}`);

export const MORE_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && slug.current != $slug] | order(featured desc, order asc)[0...2]{ ${PROJECT_CARD_FIELDS} }`,
);
