import { CtaFooter } from "@/components/CtaFooter";
import { Navbar } from "@/components/Navbar";
import { sanityFetch } from "@/sanity/lib/client";
import { SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

// Layout for all website pages (not the Studio): navbar on top,
// shared CTA + footer at the bottom.

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await sanityFetch<SiteSettings>(SETTINGS_QUERY);

  return (
    <>
      <Navbar
        availabilityLabel={settings.availabilityLabel}
        isAvailable={settings.isAvailable}
        contactEmail={settings.contactEmail}
      />
      <main className="flex-1">{children}</main>
      <CtaFooter settings={settings} />
    </>
  );
}
