import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

// Builds an image URL from a Sanity image field (keeps crop and hotspot).
// The width is added later by the image loader (image-loader.ts).
// Example: <Image src={urlFor(project.coverImage)} ... />
export function urlFor(source: SanityImageSource) {
  return builder.image(source).url();
}
