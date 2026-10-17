import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { ArrowLeftIcon } from "@/components/icons";
import { pillClasses } from "@/components/Pill";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkGrid } from "@/components/WorkGrid";
import { sanityFetch } from "@/sanity/lib/client";
import { ALL_PROJECTS_QUERY, type ProjectCardData } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Work",
  description: "All projects by Alif Rezky Maulana.",
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
