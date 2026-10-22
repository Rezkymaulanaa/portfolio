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
  heroImage: SanityImage & { dimensions?: { width: number; height: number } };
  /** Direct URLs of the optional hero video files. */
  heroVideoWebm?: string;
  heroVideoMp4?: string;
  availabilityLabel?: string;
  isAvailable?: boolean;
  aboutHeading?: string;
  aboutText?: string;
  aboutImage?: SanityImage;
  photoGrid?: (SanityImage & { _key: string })[];
  /** Direct URL of the uploaded CV file (from cvFile). */
  cvUrl?: string;
  contactEmail: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
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
  shortDescription?: string;
  coverImage: SanityImage;
  coverStyle?: MockupStyle;
  coverImages?: MockupImage[];
};

// Device mockup an image is shown in (see components/ProjectCover.tsx).
export type MockupStyle =
  | "image"
  | "laptop"
  | "mobile"
  | "instagram"
  | "instagram-profile"
  | "instagram-carousel";

// Extra images of the Instagram Profile and Carousel mockups.
export type MockupImage = SanityImage & { _key: string };

export type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
};

// ---------- Queries ----------

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  ...,
  heroImage{ ..., "dimensions": asset->metadata.dimensions{ width, height } },
  "cvUrl": cvFile.asset->url,
  "heroVideoWebm": heroVideoWebm.asset->url,
  "heroVideoMp4": heroVideoMp4.asset->url,
  usualTools[]->{ _id, name, icon }
}`);

// Text fields come with their Indonesian twin ("...Id", see localize.ts).
const PROJECT_CARD_FIELDS = `_id, title, titleId, "slug": slug.current, category, tags, tagsId, shortDescription, shortDescriptionId, coverImage, coverStyle, coverImages`;

export const FEATURED_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && featured == true] | order(order asc){ ${PROJECT_CARD_FIELDS} }`,
);

export const SERVICES_QUERY = defineQuery(
  `*[_type == "service"] | order(order asc){ _id, title, titleId, "slug": slug.current, description, descriptionId }`,
);

export type SkillGroup = {
  _id: string;
  title: string;
  items: string[];
};

export const SKILL_GROUPS_QUERY = defineQuery(
  `*[_type == "skillGroup"] | order(order asc){ _id, title, titleId, items, itemsId }`,
);

export const ALL_PROJECTS_QUERY = defineQuery(
  `*[_type == "project"] | order(order asc){ ${PROJECT_CARD_FIELDS} }`,
);

export const PROJECT_SLUGS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)].slug.current`,
);

// For the sitemap: every project page with the time it was last changed.
export type SitemapProject = { slug: string; _updatedAt: string };

export const SITEMAP_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)] | order(order asc){ "slug": slug.current, _updatedAt }`,
);

// Image with its width/height, so the page does not jump while it loads.
export type SizedImage = SanityImage & {
  _key?: string;
  mockup?: MockupStyle;
  mockupImages?: MockupImage[];
  dimensions?: { width: number; height: number };
};

export type ProjectDetail = {
  _id: string;
  title: string;
  slug: string;
  category?: ProjectCardData["category"];
  tags?: string[];
  shortDescription?: string;
  timeline?: string;
  livePreviewUrl?: string;
  service?: string;
  tools?: Tool[];
  coverImage: SizedImage;
  coverStyle?: MockupStyle;
  coverImages?: MockupImage[];
  gallery?: SizedImage[];
  facts?: { _key: string; label: string; value: string }[];
  content?: CaseBlock[];
};

// Case study blocks (see schemaTypes/caseStudy.ts).
type BlockBase = { _key: string; heading?: string; intro?: string };

export type CaseBlock =
  | (BlockBase & { _type: "caseText"; body?: string; points?: string[] })
  | (BlockBase & { _type: "caseStats"; items?: { _key: string; value: string; label: string }[] })
  | (BlockBase & {
      _type: "caseProblems";
      items?: { _key: string; problem: string; solution: string }[];
    })
  | (BlockBase & {
      _type: "caseSteps";
      steps?: { _key: string; title: string; description?: string }[];
    })
  | (BlockBase & { _type: "caseImages"; images?: (SizedImage & { caption?: string })[] })
  | (BlockBase & {
      _type: "caseTable";
      columns?: string[];
      rows?: { _key: string; cells?: string[] }[];
    });

const SIZED_IMAGE = `..., "dimensions": asset->metadata.dimensions{ width, height }`;

export const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  _id, title, titleId, "slug": slug.current, category, tags, tagsId, shortDescription, shortDescriptionId,
  timeline, timelineId, livePreviewUrl,
  "service": service->title, "serviceId": service->titleId,
  tools[]->{ _id, name, icon },
  coverImage{ ${SIZED_IMAGE} },
  coverStyle,
  coverImages,
  gallery[]{ ${SIZED_IMAGE} },
  facts,
  content[]{
    ...,
    _type == "caseImages" => { images[]{ ${SIZED_IMAGE} } }
  }
}`);

export const MORE_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && slug.current != $slug] | order(featured desc, order asc)[0...2]{ ${PROJECT_CARD_FIELDS} }`,
);
