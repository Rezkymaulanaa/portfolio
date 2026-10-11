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

  return (
    <section className="relative flex min-h-[38rem] items-end overflow-hidden bg-line pb-12 sm:min-h-[44rem] lg:h-[min(74vw,66.5rem)] lg:pb-32">
      <Image
        src={urlFor(settings.heroImage)}
        alt={settings.heroImage.alt ?? ""}
        fill
        preload
        sizes="100vw"
        className="object-cover object-[72%_center] lg:object-center"
      />
      {/* Light fade on small screens so the text stays readable over the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-page/85 via-page/40 to-transparent lg:hidden"
      />

      <div className="relative mx-auto w-full max-w-[77.5rem] px-4 sm:px-6 lg:px-1">
        <h1 className="text-hero leading-[0.86] font-extrabold tracking-[0.15em] text-ink uppercase">
          {nameLines.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-8 lg:mt-[8.5rem] lg:flex-row lg:items-end lg:justify-between">
          <div>
            {settings.headline && (
              <p className="text-xl font-bold sm:text-3xl lg:text-[2.5rem] lg:leading-tight">
                {settings.headline}
              </p>
            )}
            {settings.tagline && (
              <p className="mt-2 max-w-[31rem] text-base leading-snug sm:text-lg lg:text-2xl lg:leading-tight">
                {settings.tagline}
              </p>
            )}
            <PillLink href="#work" variant="accent" className="mt-6 text-pill">
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
