import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkGrid } from "@/components/WorkGrid";
import { sanityFetch } from "@/sanity/lib/client";
import { ALL_PROJECTS_QUERY, type ProjectCardData } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Work",
  description: "All projects by Alif Rezky Maulana.",
};

export default async function WorkPage() {
  const projects = await sanityFetch<ProjectCardData[]>(ALL_PROJECTS_QUERY);

  return (
    <section className="mx-auto max-w-[76rem] px-4 pt-32 pb-20 sm:px-6 lg:pt-48 lg:pb-16">
      <SectionHeading as="h1" watermark="Portfolio" title="All Work" align="center" />
      <div className="mt-8 lg:mt-12">
        <WorkGrid projects={projects} />
      </div>
    </section>
  );
}
