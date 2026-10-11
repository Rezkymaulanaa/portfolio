import { createClient, type QueryParams } from "next-sanity";
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
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
}
