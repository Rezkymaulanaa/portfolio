import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /robots.txt: search engines may visit every page except the Studio,
// and find the list of all pages in the sitemap.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
