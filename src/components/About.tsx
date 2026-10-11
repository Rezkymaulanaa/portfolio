import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/queries";
import { LetsTalkButton } from "./contact/ContactProvider";
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
      className="scroll-mt-8 py-20 lg:py-[clamp(4rem,10svh,8rem)]"
    >
      <div className="mx-auto max-w-content px-gutter">
        <SectionHeading id="about-heading" watermark="About" title={settings.aboutHeading ?? "About Me"} />

        {/* On desktop the photo height follows the screen height, so the whole
            section fits in one screen. */}
        <div className="reveal mt-10 grid items-center gap-8 lg:mt-[clamp(1.5rem,5svh,4rem)] lg:grid-cols-[5fr_7fr] lg:gap-16">
          {settings.aboutImage && (
            <div className="rounded-frame bg-surface p-3 lg:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-page lg:aspect-auto lg:h-[clamp(20rem,52svh,34rem)]">
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
            <div className="space-y-5 text-base leading-relaxed lg:text-[clamp(1.125rem,2.8svh,1.5rem)] lg:leading-normal">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <LetsTalkButton variant="dark" className="mt-8 text-pill lg:mt-12" />
          </div>
        </div>
      </div>
    </section>
  );
}
