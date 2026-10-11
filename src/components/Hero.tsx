import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/queries";
import { ArrowUpRightIcon, InstagramIcon, LinkedInIcon } from "./icons";
import { PillLink } from "./Pill";

// Home page hero: full-width photo, very large name, headline, tagline,
// "Browse Projects" button and social links.

export function Hero({ settings }: { settings: SiteSettings }) {
  // One word of the name per line: "ALIF / REZKY / MAULANA".
  const nameLines = settings.fullName.split(" ");

  // The hero is at least one full screen tall (never taller than the design,
  // 1065px), so name, buttons and social links are visible without scrolling.
  return (
    <section className="relative flex min-h-[max(36rem,100svh)] items-end overflow-hidden bg-line pt-24 pb-10 lg:min-h-[clamp(36rem,100svh,66.5rem)] lg:pt-36 lg:pb-[clamp(2rem,8svh,8rem)]">
      <Image
        src={urlFor(settings.heroImage)}
        alt={settings.heroImage.alt ?? ""}
        fill
        preload
        sizes="100vw"
        className="object-cover object-[72%_center] lg:object-top"
      />
      {/* Light fade on small screens so the text stays readable over the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-page/85 via-page/40 to-transparent lg:hidden"
      />

      <div className="relative mx-auto w-full max-w-hero px-gutter">
        <h1 className="text-hero leading-[0.86] font-extrabold tracking-[0.15em] text-ink uppercase">
          {nameLines.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-6 lg:mt-[clamp(2rem,9svh,8.5rem)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            {settings.headline && (
              <p className="text-xl font-bold sm:text-3xl lg:text-[clamp(1.5rem,4.4svh,2.5rem)] lg:leading-tight">
                {settings.headline}
              </p>
            )}
            {settings.tagline && (
              <p className="mt-2 max-w-[31rem] text-base leading-snug sm:text-lg lg:text-[clamp(1.125rem,3.2svh,1.5rem)] lg:leading-tight">
                {settings.tagline}
              </p>
            )}
            <PillLink href="#work" variant="accent" className="mt-5 text-pill lg:mt-[clamp(1rem,3svh,1.5rem)]">
              Browse Projects <ArrowUpRightIcon />
            </PillLink>
          </div>

          <ul className="flex flex-wrap gap-3 text-pill lg:flex-col lg:items-end lg:gap-4">
            {settings.linkedinUrl && (
              <li>
                <PillLink href={settings.linkedinUrl} variant="light" external className="border-transparent">
                  <LinkedInIcon /> LinkedIn
                </PillLink>
              </li>
            )}
            {settings.instagramUrl && (
              <li>
                <PillLink href={settings.instagramUrl} variant="light" external className="border-transparent">
                  <InstagramIcon /> Instagram
                </PillLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
