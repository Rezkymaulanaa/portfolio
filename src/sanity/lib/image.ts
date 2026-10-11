import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

// Builds an image URL from a Sanity image field.
// Example: urlFor(project.coverImage).width(800).url()
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

// Tool icons may be SVG files. next/image cannot optimize SVG, so we ask
// Sanity for a PNG version instead (2x size for sharp screens). "max" keeps
// the whole logo visible; show it with object-contain in a square box.
export function iconUrl(source: SanityImageSource, size: number) {
  return builder
    .image(source)
    .width(size * 2)
    .height(size * 2)
    .fit("max")
    .format("png")
    .url();
}
