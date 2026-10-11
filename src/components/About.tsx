import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/queries";
import { ArrowUpRightIcon } from "./icons";
import { PillLink } from "./Pill";
import { SectionHeading } from "./SectionHeading";

// "About Me" section (not in the original design; built in the same style).
// Photo on the left, text from the Studio on the right.

export function About({ settings }: { settings: SiteSettings }) {
  // Paragraphs are separated by an empty line in the Studio.
  const paragraphs = (settings.aboutText ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-8 py-20 lg:pt-40 lg:pb-16"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading id="about-heading" watermark="About" title={settings.aboutHeading ?? "About Me"} />

        <div className="reveal mt-10 grid items-center gap-8 lg:mt-20 lg:grid-cols-[5fr_7fr] lg:gap-16">
          {settings.aboutImage && (
            <div className="rounded-frame bg-surface p-3 lg:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-page">
                <Image
                  src={urlFor(settings.aboutImage)}
                  alt={settings.aboutImage.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover object-[72%_center] grayscale"
                />
              </div>
            </div>
          )}

          <div>
            <div className="space-y-5 text-base leading-relaxed lg:text-2xl lg:leading-normal">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <PillLink
              href={`mailto:${settings.contactEmail}`}
              variant="dark"
              className="mt-8 text-pill lg:mt-12"
            >
              Let&apos;s Talk <ArrowUpRightIcon />
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
