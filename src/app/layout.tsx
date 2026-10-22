import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { RevealObserver } from "@/components/RevealObserver";
import { openGraphBase } from "@/lib/og";
import { revealScript } from "@/lib/reveal";
import { SITE_URL } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Title and description for Google and link previews. Edit them in the
// Studio: Site settings → SEO. Other pages add "— <name>" to their own title.
// The share image comes from opengraph-image.tsx.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(SETTINGS_QUERY);
  const title = settings.siteTitle ?? `${settings.fullName} — Portfolio`;
  const description = settings.siteDescription ?? settings.tagline;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${settings.fullName}` },
    description,
    alternates: { canonical: "/" },
    openGraph: { ...openGraphBase(settings.fullName), title, description, url: "/" },
    twitter: { card: "summary_large_image" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script adds data-reveal to <html>
    // before React starts, so the attribute differs from the server HTML.
    <html lang="en" className={`${poppins.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions add attributes to <body>
          (e.g. inmaintabuse). It only covers <body>'s own attributes, so real
          errors in the page content are still reported. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
