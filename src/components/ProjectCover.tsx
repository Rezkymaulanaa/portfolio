import Image from "next/image";
import type { ReactNode } from "react";
import { urlFor } from "@/sanity/lib/image";
import type { MockupImage, MockupStyle, SanityImage } from "@/sanity/lib/queries";
import { CarouselSlides } from "./CarouselSlides";

// Project image, plain or in a device mockup (cards and detail page).
// "image" shows the image as it is; the mockups put it inside a laptop, a
// phone, or a phone showing Instagram (a post, a profile grid, or a carousel),
// on a dark wall with a spotlight. Everything is drawn with CSS and sized in "cqw"
// (percent of the card width), so it scales with the card.
// Device colors are fixed on purpose: they are part of the drawing, not of
// the site theme.

type ProjectCoverProps = {
  image: SanityImage & { alt?: string };
  style?: MockupStyle;
  /** Width of the whole cover on desktop, in px (for the image size). */
  displayWidth?: number;
  /** Load the image right away (first image on the page). */
  preload?: boolean;
  /** Corner rounding of the cover. */
  rounded?: string;
  /** More images for the Instagram Profile grid and Carousel (after the main image). */
  extraImages?: MockupImage[];
};

export function ProjectCover({
  image,
  style = "image",
  displayWidth = 560,
  preload = false,
  rounded = "rounded-sm",
  extraImages = [],
}: ProjectCoverProps) {
  const alt = image.alt ?? "";
  // The screen of each device is at most about 75% of the cover width, but a
  // landscape image in a portrait screen is shown larger, so ask for more.
  const screenSizes = `(min-width: 1024px) ${Math.round(displayWidth * 0.75)}px, 75vw`;
  const screen = { image, alt, sizes: screenSizes, preload };

  if (style === "image" || !style) {
    return (
      <Frame rounded={rounded}>
        <Image
          src={urlFor(image)}
          alt={alt}
          fill
          preload={preload}
          sizes={`(min-width: 1024px) ${displayWidth}px, 100vw`}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Frame>
    );
  }

  return (
    <Frame mockup rounded={rounded}>
      <Spotlight floor={style === "laptop"} />
      {style === "laptop" && <Laptop {...screen} />}
      {style === "mobile" && (
        <Phone>
          <ScreenImage {...screen} />
        </Phone>
      )}
      {style === "instagram" && (
        <Phone>
          <InstagramPost>
            <div className="relative aspect-[4/5] w-full bg-neutral-200">
              <ScreenImage {...screen} />
            </div>
          </InstagramPost>
        </Phone>
      )}
      {style === "instagram-carousel" && (
        <Phone>
          <InstagramPost>
            <CarouselSlides
              slides={[image, ...extraImages].map((slide) => ({ src: urlFor(slide), alt: slide.alt ?? "" }))}
              sizes={screenSizes}
              preload={preload}
            />
          </InstagramPost>
        </Phone>
      )}
      {style === "instagram-profile" && (
        <Phone>
          <InstagramProfile
            images={[image, ...extraImages].slice(0, 9)}
            sizes={`(min-width: 1024px) ${Math.round(displayWidth * 0.12)}px, 15vw`}
          />
        </Phone>
      )}
    </Frame>
  );
}

function Frame({ children, mockup = false, rounded }: { children: ReactNode; mockup?: boolean; rounded: string }) {
  return (
    <div
      className={`@container relative aspect-[4/3] w-full overflow-hidden ${rounded} ${
        mockup ? "bg-neutral-950" : "bg-line"
      }`}
    >
      {children}
    </div>
  );
}

// Dark wall lit from above; the laptop also stands on a darker shelf.
function Spotlight({ floor }: { floor: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
        style={{
          background:
            "radial-gradient(42% 55% at 50% 30%, rgb(255 255 255 / 0.4), rgb(255 255 255 / 0.12) 45%, transparent 72%), linear-gradient(#222, #080808)",
        }}
      />
      {floor && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[24%] border-t border-white/10"
          style={{ background: "linear-gradient(rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.85))" }}
        />
      )}
    </>
  );
}

// Lifts a little when the card is hovered.
const lift =
  "transition-transform duration-700 ease-out group-hover:-translate-y-[1.5cqw] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0";

type ScreenProps = { image: SanityImage; alt: string; sizes: string; preload: boolean };

function Laptop(screen: ScreenProps) {
  return (
    <div className={`absolute bottom-[16.5cqw] left-1/2 w-[70cqw] -translate-x-1/2 ${lift}`}>
      {/* Screen with black bezel */}
      <div className="rounded-t-[1.6cqw] border border-neutral-600/60 bg-black p-[1.1cqw] pt-[1.6cqw] shadow-[0_2cqw_5cqw_rgb(0_0_0/0.6)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
          <ScreenImage {...screen} />
        </div>
      </div>
      {/* Keyboard base, a bit wider than the screen */}
      <div
        className="relative -mx-[6cqw] h-[1.8cqw] rounded-b-[1.2cqw] shadow-[0_1.5cqw_3cqw_rgb(0_0_0/0.7)]"
        style={{ background: "linear-gradient(#6b6b6b, #2b2b2b 60%, #161616)" }}
      >
        <span className="absolute top-0 left-1/2 h-[0.7cqw] w-[10cqw] -translate-x-1/2 rounded-b-[0.6cqw] bg-black/50" />
      </div>
    </div>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className={`absolute top-[6cqw] left-1/2 w-[30cqw] -translate-x-1/2 ${lift}`}>
      <div className="relative rounded-[4.6cqw] border border-neutral-500/70 bg-black p-[1.1cqw] shadow-[0_3cqw_6cqw_rgb(0_0_0/0.65)]">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[3.6cqw] bg-white">
          {children}
          {/* Dynamic Island */}
          <span className="absolute top-[1.4cqw] left-1/2 z-10 h-[2.4cqw] w-[8.5cqw] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

function ScreenImage({ image, alt, sizes, preload }: ScreenProps) {
  return <Image src={urlFor(image)} alt={alt} fill sizes={sizes} preload={preload} className="object-cover object-top" />;
}

// Instagram feed screen: profile row, the post (children: one image or the
// carousel, 4:5), action icons and placeholder caption lines.
function InstagramPost({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col pt-[5.5cqw] text-neutral-900">
      <div className="flex items-center gap-[1cqw] px-[1.6cqw] py-[1.2cqw]">
        <span className="size-[3.2cqw] rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[0.35cqw]">
          <span className="block size-full rounded-full border-[0.3cqw] border-white bg-neutral-300" />
        </span>
        <span className="h-[0.9cqw] w-[9cqw] rounded-full bg-neutral-300" />
        <span className="ml-auto text-[1.6cqw] leading-none tracking-widest text-neutral-500">•••</span>
      </div>
      {children}
      <div className="flex items-center gap-[1.1cqw] px-[1.6cqw] pt-[1.4cqw]">
        <IgIcon d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.4 3.5 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.5 0 5.6 3.4 4.3 6.8C19.5 16.4 12 21 12 21Z" />
        <IgIcon d="M20 12a8 8 0 1 1-3.3-6.5L21 4l-1.2 4.3A8 8 0 0 1 20 12Z" />
        <IgIcon d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />
        <span className="ml-auto">
          <IgIcon d="M6 3h12v18l-6-4-6 4V3Z" />
        </span>
      </div>
      <div className="space-y-[0.9cqw] px-[1.6cqw] pt-[1.4cqw]">
        <span className="block h-[0.9cqw] w-[11cqw] rounded-full bg-neutral-300" />
        <span className="block h-[0.9cqw] w-[20cqw] rounded-full bg-neutral-200" />
      </div>
    </div>
  );
}

// Instagram profile screen: header with avatar, counts, bio and buttons, then
// the 3×3 post grid (3:4 posts). Empty spots show as gray tiles.
function InstagramProfile({ images, sizes }: { images: (SanityImage & { alt?: string })[]; sizes: string }) {
  return (
    <div className="flex h-full flex-col pt-[5cqw] text-neutral-900">
      {/* Username and menu */}
      <div className="flex items-center px-[1.6cqw] pb-[1cqw]">
        <span className="h-[1.1cqw] w-[8cqw] rounded-full bg-neutral-800" />
        <span className="ml-auto text-[1.6cqw] leading-none tracking-widest text-neutral-500">•••</span>
      </div>
      {/* Avatar and counts */}
      <div className="flex items-center gap-[1.6cqw] px-[1.6cqw]">
        <span className="size-[6cqw] shrink-0 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[0.4cqw]">
          <span className="block size-full rounded-full border-[0.35cqw] border-white bg-neutral-300" />
        </span>
        <div className="grid flex-1 grid-cols-3 gap-[0.8cqw]">
          {[0, 1, 2].map((count) => (
            <span key={count} className="flex flex-col items-center gap-[0.5cqw]">
              <span className="h-[1cqw] w-[3cqw] rounded-full bg-neutral-800" />
              <span className="h-[0.7cqw] w-[4.5cqw] rounded-full bg-neutral-300" />
            </span>
          ))}
        </div>
      </div>
      {/* Name and bio */}
      <div className="space-y-[0.6cqw] px-[1.6cqw] pt-[1.2cqw]">
        <span className="block h-[0.9cqw] w-[9cqw] rounded-full bg-neutral-800" />
        <span className="block h-[0.7cqw] w-[18cqw] rounded-full bg-neutral-300" />
        <span className="block h-[0.7cqw] w-[13cqw] rounded-full bg-neutral-300" />
      </div>
      {/* Follow / Message buttons */}
      <div className="grid grid-cols-2 gap-[0.6cqw] px-[1.6cqw] pt-[1.2cqw]">
        <span className="h-[2.2cqw] rounded-[0.6cqw] bg-sky-500" />
        <span className="h-[2.2cqw] rounded-[0.6cqw] bg-neutral-200" />
      </div>
      {/* Grid tab */}
      <div className="mt-[1.2cqw] flex justify-center border-b border-neutral-200 pb-[0.8cqw]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-[1.8cqw]" aria-hidden="true">
          <path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
      </div>
      {/* 3×3 posts */}
      <ul className="grid grid-cols-3 gap-[0.2cqw] pt-[0.2cqw]">
        {Array.from({ length: 9 }, (_, index) => {
          const post = images[index];
          return (
            <li key={index} className="relative aspect-[3/4] bg-neutral-200">
              {post && (
                <Image src={urlFor(post)} alt={post.alt ?? ""} fill sizes={sizes} className="object-cover" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function IgIcon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
      className="size-[2.2cqw]"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
