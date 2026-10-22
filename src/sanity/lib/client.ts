import { createClient, type QueryParams } from "next-sanity";
import type { Locale } from "@/i18n/config";
import { localize } from "./localize";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// How often (in seconds) the site re-fetches content from Sanity.
// After you publish in the Studio, the live site updates within this time.
const REVALIDATE_SECONDS = 60;

// Use this helper for every query on the website (server side only).
// With a locale, texts come in that language (English when no Indonesian
// text was filled in, see localize.ts).
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  locale?: Locale,
): Promise<T> {
  const data = await client.fetch<T>(query, params, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  return locale ? localize(data, locale) : data;
}
