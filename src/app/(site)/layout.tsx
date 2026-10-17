import { NavigationTracker } from "@/components/BackLink";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { CtaFooter } from "@/components/CtaFooter";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkipLink } from "@/components/SkipLink";
import { sanityFetch } from "@/sanity/lib/client";
import { SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

// Layout for all website pages (not the Studio): navbar on top,
// shared CTA + footer at the bottom, and the "Let's Talk" message panel.

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await sanityFetch<SiteSettings>(SETTINGS_QUERY);

  return (
    <ContactProvider
      ownerName={settings.footerName ?? settings.fullName}
      contactEmail={settings.contactEmail}
    >
      <NavigationTracker />
      <SkipLink />
      <Navbar
        availabilityLabel={settings.availabilityLabel}
        isAvailable={settings.isAvailable}
      />
      {/* Stops the page from scrolling sideways on phones (see globals.css). */}
      <div className="flex flex-1 flex-col" style={{ overflowX: "clip" }}>
        <main id="main" className="flex-1">{children}</main>
        <CtaFooter settings={settings} />
      </div>
      <ScrollToTop />
    </ContactProvider>
  );
}
