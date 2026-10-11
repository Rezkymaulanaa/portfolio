// Temporary page for Phase 3: shows the shared components so they can be
// checked in the browser. It will be replaced by the real home page in Phase 4.

import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceList } from "@/components/ServiceList";
import { sanityFetch } from "@/sanity/lib/client";
import {
  FEATURED_PROJECTS_QUERY,
  SERVICES_QUERY,
  type ProjectCardData,
  type Service,
} from "@/sanity/lib/queries";

export default async function Home() {
  const [projects, services] = await Promise.all([
    sanityFetch<ProjectCardData[]>(FEATURED_PROJECTS_QUERY),
    sanityFetch<Service[]>(SERVICES_QUERY),
  ]);

  return (
    <>
      <div className="flex h-[600px] items-end bg-ink/40 px-4 pb-10 sm:px-6">
        <h1 className="mx-auto w-full max-w-content text-section font-bold text-page">
          Phase 3 — component preview
        </h1>
      </div>

      <section id="work" className="mx-auto max-w-content px-4 py-24 sm:px-6">
        <SectionHeading watermark="Portfolio" title="Selected Work" align="center" />
        <div className="mt-16 grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>

      <section id="service" className="mx-auto max-w-content px-4 py-24 sm:px-6">
        <SectionHeading watermark="Service" title="Service" />
        <div className="mt-16">
          <ServiceList services={services} />
        </div>
      </section>

      <section id="capabilities" className="bg-ink py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <SectionHeading watermark="Capabilities" title="Main Skills & Tools" tone="dark" />
        </div>
      </section>

      <section id="about" className="mx-auto max-w-content px-4 py-24 sm:px-6">
        <SectionHeading watermark="About" title="About Me" />
      </section>
    </>
  );
}
