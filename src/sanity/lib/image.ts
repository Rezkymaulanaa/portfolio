import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

// Builds an image URL from a Sanity image field (keeps crop and hotspot).
// The width is added later by the image loader (image-loader.ts).
// Example: <Image src={urlFor(project.coverImage)} ... />
export function urlFor(source: SanityImageSource) {
  return builder.image(source).url();
}

// Image cut to an exact size, as JPEG (for the generated share images,
// which cannot read every image format). "top" keeps the top of the image.
export function croppedImageUrl(
  source: SanityImageSource,
  width: number,
  height: number,
  crop: "center" | "top" = "center",
) {
  return builder.image(source).width(width).height(height).fit("crop").crop(crop).bg("ffffff").format("jpg").quality(85).url();
}
