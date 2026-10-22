import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NavigationTracker } from "@/components/BackLink";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { CtaFooter } from "@/components/CtaFooter";
import { InlineScript } from "@/components/InlineScript";
import { KeepLanguage } from "@/components/KeepLanguage";
import { Navbar } from "@/components/Navbar";
import { RevealObserver } from "@/components/RevealObserver";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkipLink } from "@/components/SkipLink";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import { alternatesFor } from "@/lib/alternates";
import { openGraphBase } from "@/lib/og";
import { revealScript } from "@/lib/reveal";
import { SITE_URL } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";
import "../globals.css";

// Root layout of the website, once per language (/ = English, /id = Indonesian):
// <html lang>, fonts, navbar on top, shared CTA + footer at the bottom and
// the "Let's Talk" message panel. The Studio has its own layout.

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Both languages are built ahead of time. (No dynamicParams = false here: it
// would also apply to the pages below, so new projects from the Studio and
// the 404 page would stop working. proxy.ts only ever sends "en" or "id".)
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// Title and description for Google and link previews. Edit them in the
// Studio: Site settings → SEO. Other pages add "— <name>" to their own title.
// The share image comes from opengraph-image.tsx.
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await sanityFetch<SiteSettings>(SETTINGS_QUERY, {}, lang);
  const title = settings.siteTitle ?? `${settings.fullName} — ${getDictionary(lang).meta.portfolio}`;
  const description = settings.siteDescription ?? settings.tagline;
  const alternates = alternatesFor(lang, "/");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${settings.fullName}` },
    description,
    alternates,
    openGraph: { ...openGraphBase(settings.fullName, lang), title, description, url: alternates.canonical },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  // Falls back to English instead of a 404: Next.js also renders this layout
  // around the 404 page, and a 404 thrown here would replace the whole page.
  const { lang: requested } = await params;
  const lang = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const settings = await sanityFetch<SiteSettings>(SETTINGS_QUERY, {}, lang);

  return (
    // suppressHydrationWarning: the inline script adds data-reveal to <html>
    // before React starts, so the attribute differs from the server HTML.
    <html lang={lang} className={`${poppins.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <InlineScript html={revealScript} />
      </head>
      {/* suppressHydrationWarning: browser extensions add attributes to <body>
          (e.g. inmaintabuse). It only covers <body>'s own attributes, so real
          errors in the page content are still reported. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <I18nProvider locale={lang}>
          <ContactProvider
            ownerName={settings.footerName ?? settings.fullName}
            contactEmail={settings.contactEmail}
          >
            <NavigationTracker />
            <KeepLanguage />
            <SkipLink />
            <Navbar availabilityLabel={settings.availabilityLabel} isAvailable={settings.isAvailable} />
            {/* Stops the page from scrolling sideways on phones (see globals.css). */}
            <div className="flex flex-1 flex-col" style={{ overflowX: "clip" }}>
              <main id="main" className="flex-1">
                {children}
              </main>
              <CtaFooter settings={settings} lang={lang} />
            </div>
            <ScrollToTop />
          </ContactProvider>
        </I18nProvider>
        <RevealObserver locale={lang} />
      </body>
    </html>
  );
}
