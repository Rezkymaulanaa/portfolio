import { NavigationTracker } from "@/components/BackLink";
import { CtaFooter } from "@/components/CtaFooter";
import { Navbar } from "@/components/Navbar";
import { SkipLink } from "@/components/SkipLink";
import { sanityFetch } from "@/sanity/lib/client";
import { SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

// Layout for all website pages (not the Studio): navbar on top,
// shared CTA + footer at the bottom.

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await sanityFetch<SiteSettings>(SETTINGS_QUERY);

  return (
    <>
      <NavigationTracker />
      <SkipLink />
      <Navbar
        availabilityLabel={settings.availabilityLabel}
        isAvailable={settings.isAvailable}
        contactEmail={settings.contactEmail}
      />
      <main id="main" className="flex-1">{children}</main>
      <CtaFooter settings={settings} />
    </>
  );
}
