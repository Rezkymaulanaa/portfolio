import type { MetadataRoute } from "next";
import { LOCALES, localizePath } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { SITEMAP_PROJECTS_QUERY, type SitemapProject } from "@/sanity/lib/queries";

// /sitemap.xml: list of all pages for search engines, in both languages
// (each entry also names its other-language version). Projects come from
// Sanity, so a new project is added automatically (within about a minute).

type Page = { path: string; lastModified?: string; changeFrequency: "monthly" | "yearly"; priority: number };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sanityFetch<SitemapProject[]>(SITEMAP_PROJECTS_QUERY);
  const lastProjectUpdate = projects.map((project) => project._updatedAt).sort().at(-1);

  const pages: Page[] = [
    { path: "/", lastModified: lastProjectUpdate, changeFrequency: "monthly", priority: 1 },
    { path: "/work", lastModified: lastProjectUpdate, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((project) => ({
      path: `/work/${project.slug}`,
      lastModified: project._updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];

  return pages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: absolute(localizePath(locale, page.path)),
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((other) => [other, absolute(localizePath(other, page.path))])),
      },
    })),
  );
}

// "https://site" for the home page, "https://site/work" for the others.
function absolute(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
