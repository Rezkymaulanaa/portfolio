import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { SiteSettings } from "@/sanity/lib/queries";
import { HeroMotion } from "./HeroMotion";
import { ArrowDownIcon } from "./icons";
import { SectionLink } from "./SectionLink";

// Home page hero: large name, portrait photo (or looping video) with the
// headline on its left and the tagline on its right, and "browse projects".
// Animations: HeroMotion.tsx (GSAP).
//
// Two layouts:
// - "stage" (landscape screens from 640px wide, see globals.css): a fixed
//   composition like the 1440×1024 design. Everything is placed inside a box
//   as wide as the content of the sections below (same left and right edges
//   as "Selected Work") and as tall as the screen, in units of that box
//   (cqw = 1% of its width, cqh = 1% of its height), so the composition
//   looks the same on every landscape screen.
// - Phones and portrait tablets: name on top, photo on the right with the
//   headline beside it, tagline below the photo.

// Design measurements (1440×1024, content from x 85 to 1355 = 1270 wide):
// photo 420×631 at x 648, bottom at y 851; 34px between photo and texts.
// The photo is centered in the screen height (slightly above the middle);
// the name starts a little below the photo's top edge.
const PHOTO_CROP = "object-right"; // the right part of the wide photo: the person and the blurred shadow, with some wall beside it

export function Hero({ settings, lang }: { settings: SiteSettings; lang: Locale }) {
  const t = getDictionary(lang);
  const hasVideo = Boolean(settings.heroVideoWebm || settings.heroVideoMp4);
  // "ALIF REZKY / MAULANA": the last word on its own line.
  const words = settings.fullName.split(" ").filter(Boolean);
  const nameLines = words.length > 1 ? [words.slice(0, -1).join(" "), words.at(-1)!] : words;

  return (
    <HeroMotion className="relative overflow-clip px-gutter pt-24 pb-8 stage:h-[max(100svh,22rem)] stage:p-0">
      <div className="stage:absolute stage:inset-y-0 stage:left-1/2 stage:w-[calc(min(100%,81.25rem)-2*clamp(1rem,5vw,4rem))] stage:-translate-x-1/2 stage:[container-type:size] stage:[--photo-h:min(61.6cqh,49.7cqw)]">
        <h1
          data-hero-name
          className="text-[clamp(3rem,16vw,6rem)] leading-[0.82] font-extrabold tracking-[-0.035em] text-ink uppercase stage:absolute stage:top-[calc(51.5cqh-0.4*var(--photo-h))] stage:left-0 stage:text-[max(2.5rem,min(5.67cqw,7cqh))]"
        >
          <span className="sr-only">{settings.fullName}</span>
          <span aria-hidden="true" data-hero-intro>
            {nameLines.map((line) => (
              // Each line is a mask: the letters slide up from behind its edge.
              <span key={line} className="-my-[0.12em] block overflow-hidden py-[0.12em] whitespace-nowrap">
                {[...line].map((char, index) =>
                  char === " " ? (
                    " "
                  ) : (
                    <span key={index} data-hero-char className="inline-block">
                      {char}
                    </span>
                  ),
                )}
              </span>
            ))}
          </span>
        </h1>

        <div
          data-hero-frame
          className="relative mt-6 ml-auto w-[clamp(45%,(100svh-21rem-26.5vw)*0.667,62%)] md:w-[clamp(40%,(100svh-32rem)*0.667,62%)] stage:absolute stage:bottom-[calc((100cqh-var(--photo-h))/2-1.5cqh)] stage:left-[44.3cqw] stage:m-0 stage:aspect-[2/3] stage:h-(--photo-h) stage:w-auto"
        >
          <div className="relative aspect-[2/3] stage:h-full">
            <div data-hero-photo data-hero-intro className="absolute inset-0 overflow-hidden bg-line">
              <div data-hero-media className="absolute inset-0">
                <div data-hero-zoom className="absolute inset-0">
                  <Image
                    src={urlFor(settings.heroImage)}
                    alt={settings.heroImage.alt ?? ""}
                    fill
                    preload
                    sizes="(orientation: landscape) and (min-width: 40rem) 25vw, 62vw"
                    className={`object-cover ${PHOTO_CROP}`}
                  />
                  {/* Optional video over the photo. The photo stays underneath: it
                      shows while the video loads, and instead of the video for
                      visitors who prefer reduced motion. Decorative, so hidden
                      from screen readers. */}
                  {hasVideo && (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-hidden="true"
                      className={`absolute inset-0 size-full object-cover ${PHOTO_CROP} motion-reduce:hidden`}
                    >
                      {settings.heroVideoWebm && <source src={settings.heroVideoWebm} type="video/webm" />}
                      {settings.heroVideoMp4 && <source src={settings.heroVideoMp4} type="video/mp4" />}
                    </video>
                  )}
                </div>
              </div>
            </div>

            {settings.headline && (
              <p
                data-hero-drift="-0.2"
                className="absolute right-full bottom-[20.8%] mr-3 w-max max-w-[7em] text-right text-[clamp(0.95rem,4.2vw,1.75rem)] leading-[0.88] font-bold tracking-[-0.03em] lowercase stage:mr-[2.68cqw] stage:text-[max(1.25rem,2.52cqw)]"
              >
                <span data-hero-text data-hero-intro className="block">
                  {settings.headline}
                </span>
              </p>
            )}
          </div>

          {settings.tagline && (
            <p
              data-hero-drift="-0.06"
              className="mt-5 max-w-[11em] text-balance text-[clamp(0.95rem,3.9vw,1.35rem)] leading-[1.1] font-bold tracking-[-0.03em] stage:absolute stage:bottom-0 stage:left-full stage:mt-0 stage:ml-[2.68cqw] stage:w-max stage:max-w-[20cqw] stage:text-[max(1rem,1.89cqw)] stage:leading-[1.05]"
            >
              <span data-hero-text data-hero-intro className="block">
                {settings.tagline}
              </span>
            </p>
          )}
        </div>

        <div
          data-hero-fade
          className="mt-8 stage:absolute stage:bottom-[4.5cqh] stage:left-0 stage:mt-0"
        >
          <span data-hero-text data-hero-intro className="block">
            <SectionLink
              href="#work"
              className="group inline-flex flex-col items-center gap-1 text-[clamp(1rem,4.6vw,1.5rem)] lowercase stage:text-[max(1rem,1.89cqw)]"
            >
              <span className="underline-offset-4 group-hover:underline">{t.hero.browseProjects}</span>
              <span data-hero-arrow className="block">
                <ArrowDownIcon />
              </span>
            </SectionLink>
          </span>
        </div>
      </div>
    </HeroMotion>
  );
}
