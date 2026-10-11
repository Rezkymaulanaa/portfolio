import { CtaFooter } from "@/components/CtaFooter";
import { ArrowLeftIcon } from "@/components/icons";
import { Navbar } from "@/components/Navbar";
import { SkipLink } from "@/components/SkipLink";
import { PillLink } from "@/components/Pill";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

// 404 page, shown for any address that does not exist.

export default async function NotFound() {
  const settings = await sanityFetch<SiteSettings>(SETTINGS_QUERY);

  return (
    <>
      <SkipLink />
      <Navbar
        availabilityLabel={settings.availabilityLabel}
        isAvailable={settings.isAvailable}
        contactEmail={settings.contactEmail}
      />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-content px-4 pt-36 text-center sm:px-6 lg:pt-56">
          <SectionHeading as="h1" watermark="404" title="Page not found" align="center" />
          <p className="mx-auto mt-6 max-w-xl text-lg lg:text-2xl">
            The page you are looking for does not exist or has been moved.
          </p>
          <PillLink href="/" variant="accent" className="mt-10 text-pill">
            <ArrowLeftIcon /> Back to home
          </PillLink>
        </section>
      </main>
      <CtaFooter settings={settings} />
    </>
  );
}
