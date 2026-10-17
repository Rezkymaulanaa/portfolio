import { ContactProvider } from "@/components/contact/ContactProvider";
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
    <ContactProvider
      ownerName={settings.footerName ?? settings.fullName}
      contactEmail={settings.contactEmail}
    >
      <SkipLink />
      <Navbar
        availabilityLabel={settings.availabilityLabel}
        isAvailable={settings.isAvailable}
      />
      {/* Stops the page from scrolling sideways on phones (see globals.css). */}
      <div className="flex flex-1 flex-col" style={{ overflowX: "clip" }}>
        <main id="main" className="flex-1">
          <section className="mx-auto max-w-content px-gutter pt-36 text-center lg:pt-56">
            <SectionHeading as="h1" watermark="404" title="Page not found" align="center" />
            <p className="reveal mx-auto mt-6 max-w-xl text-lead">
              The page you are looking for does not exist or has been moved.
            </p>
            <div className="reveal mt-10">
              <PillLink href="/" variant="accent" className="text-pill">
                <ArrowLeftIcon /> Back to home
              </PillLink>
            </div>
          </section>
        </main>
        <CtaFooter settings={settings} />
      </div>
    </ContactProvider>
  );
}
