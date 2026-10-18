import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { SITEMAP_PROJECTS_QUERY, type SitemapProject } from "@/sanity/lib/queries";

// /sitemap.xml: list of all pages for search engines. Projects come from
// Sanity, so a new project is added automatically (within about a minute).

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sanityFetch<SitemapProject[]>(SITEMAP_PROJECTS_QUERY);
  const lastProjectUpdate = projects.map((project) => project._updatedAt).sort().at(-1);

  return [
    { url: SITE_URL, lastModified: lastProjectUpdate, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: lastProjectUpdate, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified: project._updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
