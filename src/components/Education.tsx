import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/queries";
import { SplitText } from "./SplitText";

// "Education" section: a dark rounded panel (same black as Capabilities)
// with the university name on the left and the degree + GPA on the right,
// followed by a row of 4 photos from the Studio.

export function Education({ photos = [] }: { photos?: SiteSettings["photoGrid"] }) {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="scroll-mt-8"
    >
      <div className="mx-auto max-w-content px-gutter">
        <div data-from="scale" className="reveal rounded-frame bg-ink p-6 text-page sm:p-10 lg:px-16 lg:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2
              id="education-heading"
              className="text-label font-semibold uppercase tracking-[0.25em] text-accent"
            >
              /Education
            </h2>
            <p className="text-label font-medium uppercase tracking-[0.2em] text-page/70">
              Graduated · 2026
            </p>
          </div>

          <div className="mt-10 grid items-end gap-10 lg:mt-20 lg:grid-cols-[6fr_4fr_auto] lg:gap-12">
            <SplitText as="p" text="Universitas Hasanuddin" lines className="text-section font-semibold uppercase" />

            <div data-from="right" className="reveal border-t border-page/30 pt-6">
              <p className="text-label uppercase tracking-[0.2em] text-page/70">Bachelor&apos;s Degree</p>
              <p className="mt-2 text-h3 font-semibold">Information Systems</p>
            </div>

            <div data-from="scale" className="reveal w-full rounded-card bg-accent p-6 text-ink sm:w-auto sm:min-w-56 lg:p-7">
              <p className="text-label font-semibold uppercase tracking-[0.2em]">GPA</p>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-6xl font-semibold leading-none lg:text-7xl">3.76</span>
                <span className="text-lead font-medium">/4.00</span>
              </p>
            </div>
          </div>
        </div>

        {photos.length > 0 && (
          <ul className="photo-grid mt-8 grid grid-cols-2 gap-1.5 lg:mt-12 lg:grid-cols-4">
            {photos.map((photo) => (
              <li key={photo._key} data-from="clip" className="photo-tile reveal reveal-zoom relative isolate aspect-[2/3] overflow-hidden rounded-card bg-ghost">
                <Image
                  src={urlFor(photo)}
                  alt={photo.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
