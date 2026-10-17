import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { MockupImage, MockupStyle, SizedImage } from "@/sanity/lib/queries";
import { ProjectCover } from "./ProjectCover";

// Image on the project detail page (cover, gallery, case study images).
// "Image only": the full image in a white rounded frame, never cropped.
// A mockup: the image inside a device on a dark stage (same as the cards).

type DetailImageProps = {
  image: SizedImage;
  mockup?: MockupStyle;
  /** More images for the Instagram Profile grid and Carousel mockups. */
  extraImages?: MockupImage[];
  caption?: string;
  /** Width of the image on desktop, in px. */
  displayWidth: number;
  preload?: boolean;
};

export function DetailImage({
  image,
  mockup = "image",
  extraImages,
  caption,
  displayWidth,
  preload = false,
}: DetailImageProps) {
  const captionElement = caption && (
    <figcaption className="mt-4 text-small text-muted">{caption}</figcaption>
  );

  if (mockup !== "image") {
    return (
      <figure className="reveal">
        <ProjectCover
          image={image}
          style={mockup}
          extraImages={extraImages}
          displayWidth={displayWidth}
          preload={preload}
          rounded="rounded-frame"
        />
        {captionElement}
      </figure>
    );
  }

  return (
    <figure className="reveal rounded-frame border border-line/40 bg-surface/70 p-3 shadow-pill sm:p-5 lg:p-8">
      <Image
        src={urlFor(image)}
        alt={image.alt ?? ""}
        width={image.dimensions?.width ?? 1600}
        height={image.dimensions?.height ?? 1200}
        preload={preload}
        sizes={`(min-width: 1216px) ${displayWidth}px, 100vw`}
        className="h-auto w-full"
      />
      {captionElement}
    </figure>
  );
}
