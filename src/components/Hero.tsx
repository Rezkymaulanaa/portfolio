import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { SiteSettings } from "@/sanity/lib/queries";
import { ArrowUpRightIcon } from "./icons";
import { PillLink } from "./Pill";
import { SplitText } from "./SplitText";

// Home page hero: full-width photo (or looping video), very large name,
// headline, tagline and "Browse Projects" button.

export function Hero({ settings, lang }: { settings: SiteSettings; lang: Locale }) {
  const t = getDictionary(lang);
  const hasVideo = Boolean(settings.heroVideoWebm || settings.heroVideoMp4);
  // Shape of the hero photo (the video should have the same shape).
  const { width = 1440, height = 1024 } = settings.heroImage.dimensions ?? {};
  // One word of the name per line: "ALIF / REZKY / MAULANA".
  // The hero fills one full screen, so name and button are visible without
  // scrolling. Exception: on large portrait screens (tablets held upright) it
  // is as tall as the photo at full width (--hero-fit); a full-screen hero
  // there would blow the photo up so much that the person stands behind the name.
  return (
    <section
      className="relative flex min-h-[max(36rem,100svh)] items-end overflow-hidden bg-line pt-24 pb-10 lg:portrait:min-h-[max(36rem,var(--hero-fit))] lg:pt-36 lg:pb-[clamp(2rem,8svh,8rem)]"
      style={
        {
          "--hero-ratio": `${width} / ${height}`,
          "--hero-fit": `${(100 * height) / width}vw`,
        } as React.CSSProperties
      }
    >
      <div className="reveal reveal-zoom absolute inset-0 overflow-hidden">
        {/* Desktop: a blurred, enlarged copy of the photo fills the space that
            the full-size media below does not cover on wide screens. */}
        <Image
          src={urlFor(settings.heroImage)}
          alt=""
          fill
          sizes="320px"
          className="hidden scale-110 object-cover blur-2xl lg:block"
        />
        {/* Phones: covers the whole hero (cropped at the sides).
            Desktop: the whole photo/video at full hero height, stuck to the
            right, never cropped at the bottom. On screens wider than the media
            its left edge fades into the blurred copy; on narrower screens it
            runs off the left edge (only plain wall is cut off there). */}
        <div
          className="absolute inset-0 lg:inset-auto lg:top-0 lg:right-0 lg:aspect-(--hero-ratio) lg:h-full lg:[mask-image:linear-gradient(to_right,transparent,black_18%)]">
          <Image
            src={urlFor(settings.heroImage)}
            alt={settings.heroImage.alt ?? ""}
            fill
            preload
            sizes="100vw"
            className="object-cover object-[72%_center] lg:object-top"
          />
          {/* Optional video over the photo. The photo stays underneath: it shows
              while the video loads, and instead of the video for visitors who
              prefer reduced motion. Decorative, so hidden from screen readers. */}
          {hasVideo && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover object-[72%_center] motion-reduce:hidden lg:object-top"
            >
              {settings.heroVideoWebm && <source src={settings.heroVideoWebm} type="video/webm" />}
              {settings.heroVideoMp4 && <source src={settings.heroVideoMp4} type="video/mp4" />}
            </video>
          )}
        </div>
      </div>
      {/* Light fade on small screens so the text stays readable over the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-page/85 via-page/40 to-transparent lg:hidden"
      />

      <div className="relative mx-auto w-full max-w-hero px-gutter">
        <SplitText
          as="h1"
          text={settings.fullName}
          lines
          className="block text-hero leading-[0.86] font-extrabold tracking-[0.15em] text-ink uppercase"
        />

        <div className="mt-8 flex flex-col gap-6 lg:mt-[clamp(2rem,9svh,8.5rem)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            {settings.headline && (
              <p className="reveal text-h2 font-bold">
                {settings.headline}
              </p>
            )}
            {settings.tagline && (
              <p className="reveal mt-2 max-w-[28rem] text-lead">
                {settings.tagline}
              </p>
            )}
            <div data-from="scale" className="reveal mt-5 lg:mt-[clamp(1rem,3svh,1.5rem)]">
              <PillLink href="#work" variant="accent" className="text-pill">
                {t.hero.browseProjects} <ArrowUpRightIcon />
              </PillLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
