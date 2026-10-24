import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { SiteSettings } from "@/sanity/lib/queries";
import { DownloadIcon } from "./icons";
import { pillClasses } from "./Pill";
import { SectionHeading } from "./SectionHeading";

// "About Me" section (not in the original design; built in the same style).
// Photo on the left, text from the Studio on the right.

export function About({ settings, lang }: { settings: SiteSettings; lang: Locale }) {
  const t = getDictionary(lang).about;
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
        <SectionHeading id="about-heading" watermark={t.watermark} title={settings.aboutHeading ?? t.title} />

        {/* On desktop the photo height follows the screen height, so the whole
            section fits in one screen. */}
        <div className="mt-10 grid items-center gap-8 lg:mt-[clamp(1.5rem,5svh,4rem)] lg:grid-cols-[5fr_7fr] lg:gap-16">
          {settings.aboutImage && (
            <div data-from="clip" className="reveal reveal-zoom">
              {/* Portrait 2:3. On desktop the height follows the screen and the
                  width follows from the shape. */}
              <div className="relative aspect-[2/3] w-full max-w-[24rem] overflow-hidden rounded-card bg-line lg:h-[clamp(22rem,64svh,42rem)] lg:w-auto lg:max-w-full">
                <Image
                  src={urlFor(settings.aboutImage)}
                  alt={settings.aboutImage.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 440px, 24rem"
                  className="object-cover object-[72%_center] grayscale"
                />
              </div>
            </div>
          )}

          <div>
            <div className="max-w-[40rem] space-y-5 text-lead">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} data-from="right" className="reveal">
                  {paragraph}
                </p>
              ))}
            </div>
            {/* "?dl=" makes the Sanity CDN send the file as a download
                (the download attribute alone is ignored for other domains). */}
            {settings.cvUrl && (
              <div className="reveal mt-8 lg:mt-12">
                <a href={`${settings.cvUrl}?dl=`} download className={pillClasses("dark", "text-pill")}>
                  {t.downloadCv} <DownloadIcon />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
