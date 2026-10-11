import { About } from "@/components/About";
import { Capabilities } from "@/components/Capabilities";
import { DashedDivider } from "@/components/DashedDivider";
import { Hero } from "@/components/Hero";
import { ArrowUpRightIcon } from "@/components/icons";
import { PillLink } from "@/components/Pill";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceList } from "@/components/ServiceList";
import { WorkGrid } from "@/components/WorkGrid";
import { sanityFetch } from "@/sanity/lib/client";
import {
  FEATURED_PROJECTS_QUERY,
  SERVICES_QUERY,
  SETTINGS_QUERY,
  SKILL_GROUPS_QUERY,
  type ProjectCardData,
  type Service,
  type SiteSettings,
  type SkillGroup,
} from "@/sanity/lib/queries";

export default async function HomePage() {
  const [settings, projects, services, skillGroups] = await Promise.all([
    sanityFetch<SiteSettings>(SETTINGS_QUERY),
    sanityFetch<ProjectCardData[]>(FEATURED_PROJECTS_QUERY),
    sanityFetch<Service[]>(SERVICES_QUERY),
    sanityFetch<SkillGroup[]>(SKILL_GROUPS_QUERY),
  ]);

  return (
    <>
      <Hero settings={settings} />

      <section
        id="work"
        aria-labelledby="work-heading"
        className="mx-auto max-w-[76rem] scroll-mt-8 px-4 pt-20 pb-20 sm:px-6 lg:pt-28 lg:pb-40"
      >
        <SectionHeading id="work-heading" watermark="Portfolio" title="Selected Work" align="center" />
        <div className="mt-8 lg:mt-12">
          <WorkGrid
            projects={projects}
            action={
              <PillLink href="/work" variant="outline" className="text-pill">
                View All work <ArrowUpRightIcon />
              </PillLink>
            }
          />
        </div>
      </section>

      <DashedDivider />

      <section
        id="service"
        aria-labelledby="service-heading"
        className="mx-auto max-w-content scroll-mt-8 px-4 py-20 sm:px-6 lg:pt-40 lg:pb-48"
      >
        <SectionHeading id="service-heading" watermark="Service" title="Service" />
        <div className="mt-10 lg:mt-20">
          <ServiceList services={services} />
        </div>
      </section>

      <Capabilities skillGroups={skillGroups} tools={settings.usualTools ?? []} />

      <About settings={settings} />
    </>
  );
}
