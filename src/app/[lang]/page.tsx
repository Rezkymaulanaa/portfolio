import { About } from "@/components/About";
import { Capabilities } from "@/components/Capabilities";
import { DashedDivider } from "@/components/DashedDivider";
import { Education } from "@/components/Education";
import { Hero } from "@/components/Hero";
import { ArrowUpRightIcon } from "@/components/icons";
import { PillLink } from "@/components/Pill";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceList } from "@/components/ServiceList";
import { WorkGrid } from "@/components/WorkGrid";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";
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

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const [settings, projects, services, skillGroups] = await Promise.all([
    sanityFetch<SiteSettings>(SETTINGS_QUERY),
    sanityFetch<ProjectCardData[]>(FEATURED_PROJECTS_QUERY),
    sanityFetch<Service[]>(SERVICES_QUERY),
    sanityFetch<SkillGroup[]>(SKILL_GROUPS_QUERY),
  ]);

  return (
    <>
      <Hero settings={settings} lang={lang} />

      <section
        id="work"
        aria-labelledby="work-heading"
        className="mx-auto max-w-work scroll-mt-8 px-gutter pt-20 pb-20 lg:pt-28 lg:pb-40"
      >
        <SectionHeading id="work-heading" watermark={t.work.watermark} title={t.work.selectedWork} align="center" />
        <div className="mt-8 lg:mt-12">
          <WorkGrid
            projects={projects}
            action={
              <PillLink href="/work" variant="outline" className="text-pill">
                {t.work.viewAll} <ArrowUpRightIcon />
              </PillLink>
            }
          />
        </div>
      </section>

      <DashedDivider />

      <section
        id="service"
        aria-labelledby="service-heading"
        className="mx-auto max-w-content scroll-mt-8 px-gutter py-20 lg:pt-40 lg:pb-48"
      >
        <SectionHeading id="service-heading" watermark={t.service.watermark} title={t.service.title} />
        <div className="mt-10 lg:mt-20">
          <ServiceList services={services} />
        </div>
      </section>

      <Capabilities skillGroups={skillGroups} tools={settings.usualTools ?? []} lang={lang} />

      <About settings={settings} lang={lang} />

      <Education photos={settings.photoGrid} lang={lang} />
    </>
  );
}
