import { ImageResponse } from "next/og";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { loadOgFonts, OG_COLORS, OG_SIZE } from "@/lib/og";
import { sanityFetch } from "@/sanity/lib/client";
import { croppedImageUrl } from "@/sanity/lib/image";
import { SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

// Share image of the website (shown when a link is shared on LinkedIn,
// WhatsApp, etc.). Looks like the hero: the hero photo with the name,
// headline and tagline on the left. Pages without their own share image
// (such as /work) use this one too.
// Upload your own image in the Studio (Site settings → SEO → Social share
// image) to use that instead.

export const alt = "Alif Rezky Maulana — Portfolio";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const [settings, fonts] = await Promise.all([sanityFetch<SiteSettings>(SETTINGS_QUERY, {}, locale), loadOgFonts()]);
  const { width, height } = OG_SIZE;

  if (settings.ogImage) {
    return new ImageResponse(
      // eslint-disable-next-line @next/next/no-img-element -- plain <img> is how ImageResponse draws images
      <img src={croppedImageUrl(settings.ogImage, width, height)} alt="" width={width} height={height} />,
      { ...OG_SIZE },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: OG_COLORS.line,
          color: OG_COLORS.ink,
          fontFamily: "Poppins",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> is how ImageResponse draws images */}
        <img
          src={croppedImageUrl(settings.heroImage, width, height, "top")}
          alt=""
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        {/* Light fade on the left so the text stays readable. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            display: "flex",
            background:
              "linear-gradient(to right, rgba(245,245,245,0.95) 0%, rgba(245,245,245,0.7) 42%, rgba(245,245,245,0) 66%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 72px",
          }}
        >
          {settings.isAvailable && settings.availabilityLabel ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 12,
                padding: "10px 22px",
                borderRadius: 999,
                background: OG_COLORS.page,
                border: "1px solid rgba(191,191,191,0.6)",
                boxShadow: "0 3px 4px rgba(0,0,0,0.16)",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: 999, background: OG_COLORS.available }} />
              {settings.availabilityLabel}
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            {settings.fullName
              .toUpperCase()
              .split(/\s+/)
              .map((word) => (
                <div key={word} style={{ fontSize: 84, fontWeight: 800, letterSpacing: 10, lineHeight: 0.98 }}>
                  {word}
                </div>
              ))}
            {settings.headline && (
              <div style={{ marginTop: 30, fontSize: 34, fontWeight: 700 }}>{settings.headline}</div>
            )}
            {settings.tagline && (
              <div style={{ marginTop: 6, maxWidth: 520, fontSize: 24, fontWeight: 500, lineHeight: 1.35 }}>
                {settings.tagline}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
