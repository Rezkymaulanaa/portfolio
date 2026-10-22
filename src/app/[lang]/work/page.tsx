import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { ArrowLeftIcon } from "@/components/icons";
import { pillClasses } from "@/components/Pill";
import { SectionHeading } from "@/components/SectionHeading";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { WorkGrid } from "@/components/WorkGrid";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternatesFor } from "@/lib/alternates";
import { openGraphBase } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { ALL_PROJECTS_QUERY, type ProjectCardData } from "@/sanity/lib/queries";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  const alternates = alternatesFor(lang, "/work");
  // The home share image of this language (the English one lives under /en).
  const image = `/${lang}/opengraph-image`;

  return {
    title: t.workTitle,
    description: t.workDescription,
    alternates,
    openGraph: {
      ...openGraphBase(SITE_NAME, lang),
      title: `${t.workTitle} — ${SITE_NAME}`,
      description: t.workDescription,
      url: alternates.canonical,
      // Setting openGraph here drops the inherited share image, so point to it again.
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} — ${t.portfolio}` }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

// All projects. No navbar here: a Back button returns to the previous page
// (or to the home page when this page was opened directly).
export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const projects = await sanityFetch<ProjectCardData[]>(ALL_PROJECTS_QUERY);

  return (
    <section className="mx-auto max-w-work px-gutter pt-10 lg:pt-16">
      <div className="reveal flex items-center justify-between gap-4">
        <BackLink fallbackHref="/" className={pillClasses("outline", "text-pill")}>
          <ArrowLeftIcon /> {t.common.back}
        </BackLink>
        <LanguageSwitch />
      </div>

      <div className="mt-8 lg:mt-10">
        <SectionHeading as="h1" watermark={t.work.watermark} title={t.work.allWork} align="center" />
      </div>
      <div className="mt-8 lg:mt-12">
        <WorkGrid projects={projects} />
      </div>
    </section>
  );
}
