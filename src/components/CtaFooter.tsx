import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/queries";
import { BrushStroke } from "./BrushStroke";
import { InstagramIcon, LinkedInIcon, UserCircleIcon } from "./icons";
import { LetsTalkButton } from "./contact/ContactProvider";
import { PillLink, pillClasses } from "./Pill";

// "Have a project in mind?" call to action + footer. Shared by every page.

export function CtaFooter({ settings }: { settings: SiteSettings }) {
  return (
    <div className="relative overflow-hidden bg-page">
      {/* Sized in rem so it scales with the content. The line fades out at the
          top instead of being cut off at the edge of this block. */}
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
        <BrushStroke className="absolute bottom-0 left-1/2 h-auto w-[60rem] max-w-none -translate-x-1/2 lg:w-[85rem]" />
      </div>

      <section
        aria-labelledby="cta-heading"
        className="reveal relative mx-auto max-w-content px-gutter pt-28 text-center lg:pt-72"
      >
        <h2 id="cta-heading" className="text-cta font-bold uppercase">
          {settings.ctaHeading}
        </h2>
        {settings.ctaText && (
          <p className="mx-auto mt-3 max-w-[54rem] text-base sm:text-lg lg:text-xl">
            {settings.ctaText}
          </p>
        )}
        <LetsTalkButton variant="accent" className="mt-10 text-pill lg:mt-24" />
      </section>

      <footer className="relative mx-auto flex max-w-[65.75rem] flex-wrap items-center justify-center gap-4 px-gutter pt-16 pb-24 text-pill sm:justify-between lg:pt-24 lg:pb-72">
        <p className={pillClasses("dark", "pl-[0.4em] hover:bg-ink")}>
          {settings.footerAvatar ? (
            <Image
              src={urlFor(settings.footerAvatar)}
              alt=""
              width={40}
              height={40}
              className="size-[1.6em] rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="size-[1.6em]" />
          )}
          {settings.footerName}
        </p>
        {settings.instagramUrl && (
          <PillLink href={settings.instagramUrl} variant="light" external>
            <InstagramIcon /> Instagram
          </PillLink>
        )}
        {settings.linkedinUrl && (
          <PillLink href={settings.linkedinUrl} variant="light" external>
            <LinkedInIcon /> LinkedIn
          </PillLink>
        )}
      </footer>
    </div>
  );
}
