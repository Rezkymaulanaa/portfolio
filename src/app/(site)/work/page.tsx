import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { ArrowLeftIcon } from "@/components/icons";
import { pillClasses } from "@/components/Pill";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkGrid } from "@/components/WorkGrid";
import { openGraphBase } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { ALL_PROJECTS_QUERY, type ProjectCardData } from "@/sanity/lib/queries";

const description =
  "All projects by Alif Rezky Maulana: UI/UX design, web development and graphic design, from real client projects to personal explorations.";

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    ...openGraphBase(SITE_NAME),
    title: `Work — ${SITE_NAME}`,
    description,
    url: "/work",
    // Setting openGraph here drops the inherited share image, so point to it again.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} — Portfolio` }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

// All projects. No navbar here: a Back button returns to the previous page
// (or to the home page when this page was opened directly).
export default async function WorkPage() {
  const projects = await sanityFetch<ProjectCardData[]>(ALL_PROJECTS_QUERY);

  return (
    <section className="mx-auto max-w-work px-gutter pt-10 lg:pt-16">
      <div className="reveal">
        <BackLink fallbackHref="/" className={pillClasses("outline", "text-pill")}>
          <ArrowLeftIcon /> Back
        </BackLink>
      </div>

      <div className="mt-8 lg:mt-10">
        <SectionHeading as="h1" watermark="Portfolio" title="All Work" align="center" />
      </div>
      <div className="mt-8 lg:mt-12">
        <WorkGrid projects={projects} />
      </div>
    </section>
  );
}
