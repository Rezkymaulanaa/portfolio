import { ImageResponse } from "next/og";
import { loadOgFonts, OG_COLORS, OG_SIZE, truncate } from "@/lib/og";
import { sanityFetch } from "@/sanity/lib/client";
import { croppedImageUrl } from "@/sanity/lib/image";
import { CATEGORY_LABELS, PROJECT_QUERY, SETTINGS_QUERY, type ProjectDetail, type SiteSettings } from "@/sanity/lib/queries";

// Share image of a project page: category, title and short description on
// the left, the cover image on the right. Made automatically from the
// project's content in the Studio.

export const alt = "Project from the portfolio of Alif Rezky Maulana";
export const size = OG_SIZE;
export const contentType = "image/png";

const COVER = { width: 560, height: 420 };

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, settings, fonts] = await Promise.all([
    sanityFetch<ProjectDetail | null>(PROJECT_QUERY, { slug }),
    sanityFetch<SiteSettings>(SETTINGS_QUERY),
    loadOgFonts(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          padding: "0 64px",
          background: OG_COLORS.page,
          color: OG_COLORS.ink,
          fontFamily: "Poppins",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: COVER.height + 60,
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {project?.category && (
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  padding: "8px 20px",
                  borderRadius: 999,
                  fontSize: 20,
                  fontWeight: 500,
                  ...(project.category === "real-project"
                    ? { background: OG_COLORS.ink, color: OG_COLORS.page }
                    : { background: OG_COLORS.accent, color: OG_COLORS.ink }),
                }}
              >
                {CATEGORY_LABELS[project.category]}
              </div>
            )}
            <div style={{ marginTop: 28, fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>
              {project?.title ?? "Project"}
            </div>
            {project?.shortDescription && (
              <div style={{ marginTop: 18, fontSize: 23, fontWeight: 500, lineHeight: 1.45, color: OG_COLORS.muted }}>
                {truncate(project.shortDescription, 140)}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20 }}>
            <div style={{ fontWeight: 800, letterSpacing: 4 }}>{settings.fullName.toUpperCase()}</div>
            <div style={{ width: 28, height: 3, borderRadius: 3, background: OG_COLORS.accent }} />
            <div style={{ fontWeight: 500, color: OG_COLORS.muted }}>Portfolio</div>
          </div>
        </div>

        {project?.coverImage && (
          <div
            style={{
              display: "flex",
              width: COVER.width,
              height: COVER.height,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> is how ImageResponse draws images */}
            <img
              src={croppedImageUrl(project.coverImage, COVER.width * 2, COVER.height * 2)}
              alt=""
              width={COVER.width}
              height={COVER.height}
            />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
