import type { Metadata } from "next";
import Image from "next/image";
import { BackLink } from "@/components/BackLink";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { DetailImage } from "@/components/DetailImage";
import { notFound } from "next/navigation";
import { DashedDivider } from "@/components/DashedDivider";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { PillLink, pillClasses } from "@/components/Pill";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Tag } from "@/components/Tag";
import { openGraphBase } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";
import { client, sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  MORE_PROJECTS_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  type ProjectCardData,
  type ProjectDetail,
} from "@/sanity/lib/queries";

// Build a page for every project at deploy time. New projects published
// later are created on their first visit.
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(PROJECT_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await sanityFetch<ProjectDetail | null>(PROJECT_QUERY, { slug });
  if (!project) return {};
  const url = `/work/${slug}`;
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      ...openGraphBase(SITE_NAME),
      type: "article",
      title: `${project.title} — ${SITE_NAME}`,
      description: project.shortDescription,
      url,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const [project, moreProjects] = await Promise.all([
    sanityFetch<ProjectDetail | null>(PROJECT_QUERY, { slug }),
    sanityFetch<ProjectCardData[]>(MORE_PROJECTS_QUERY, { slug }),
  ]);

  if (!project) notFound();

  return (
    <>
      <article className="relative overflow-x-clip">
        <DetailStroke />

        <div className="relative mx-auto max-w-work px-gutter pt-10 lg:pt-16">
          <div className="reveal">
            <BackLink fallbackHref="/work" className={pillClasses("outline", "text-pill")}>
              <ArrowLeftIcon /> Back
            </BackLink>
          </div>

          <header className="mt-10 flex flex-col gap-10 lg:mt-[4.5rem] lg:flex-row lg:justify-between">
            <div className="max-w-[42rem]">
              {project.tags && project.tags.length > 0 && (
                <ul data-from="down" className="reveal flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Tag large>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              )}
              <h1 className="reveal mt-5 text-section font-semibold lg:mt-8">{project.title}</h1>
              {project.shortDescription && (
                <p className="reveal mt-3 max-w-[34rem] text-lead text-muted lg:mt-5">
                  {project.shortDescription}
                </p>
              )}
              {project.livePreviewUrl && (
                <div className="reveal mt-8 lg:mt-10">
                  <PillLink href={project.livePreviewUrl} variant="dark" external className="text-pill">
                    Live Preview <ArrowUpRightIcon />
                  </PillLink>
                </div>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:flex lg:flex-col lg:items-end lg:gap-8 lg:text-right">
              {project.service && <MetaItem label="Service">{project.service}</MetaItem>}
              {project.timeline && <MetaItem label="Timeline">{project.timeline}</MetaItem>}
              {project.tools && project.tools.length > 0 && (
                <MetaItem label="Tools" className="col-span-full">
                  <ul className="mt-1 flex flex-wrap gap-3 sm:gap-4 lg:justify-end">
                    {project.tools.map((tool) => (
                      <li
                        key={tool._id}
                        className="flex size-14 shrink-0 items-center justify-center rounded-md border border-line bg-surface p-2 shadow-pill lg:size-[5.125rem] lg:p-3"
                      >
                        <Image
                          src={urlFor(tool.icon)}
                          alt={tool.name}
                          title={tool.name}
                          width={58}
                          height={58}
                          className="size-full object-contain"
                        />
                      </li>
                    ))}
                  </ul>
                </MetaItem>
              )}
            </dl>
          </header>

          {project.facts && project.facts.length > 0 && (
            <dl className="mt-12 grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:mt-16 lg:auto-cols-fr lg:grid-flow-col lg:py-8">
              {project.facts.map((fact) => (
                <div key={fact._key} className="reveal">
                  <dt className="text-label font-semibold uppercase tracking-[0.2em] text-muted">{fact.label}</dt>
                  <dd className="mt-1 text-h4 font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-12 lg:mt-16">
            <DetailImage
              image={project.coverImage}
              mockup={project.coverStyle}
              extraImages={project.coverImages}
              displayWidth={1104}
              preload
            />
          </div>

          {project.content && project.content.length > 0 && <CaseStudy blocks={project.content} />}

          {project.gallery && project.gallery.length > 0 && (
            <div className={`space-y-6 ${project.content?.length ? "mt-20 lg:mt-28" : "mt-6"}`}>
              {project.gallery.map((image) => (
                <DetailImage
                  key={image._key ?? image.asset._ref}
                  image={image}
                  mockup={image.mockup}
                  extraImages={image.mockupImages}
                  displayWidth={1104}
                />
              ))}
            </div>
          )}
        </div>
      </article>

      {moreProjects.length > 0 && (
        <>
          <div className="mt-20 lg:mt-24">
            <DashedDivider />
          </div>
          <section
            aria-labelledby="more-work-heading"
            className="mx-auto max-w-work px-gutter pt-16 pb-4 lg:pt-24"
          >
            <SectionHeading id="more-work-heading" title="More Work" align="center" />
            <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16">
              {moreProjects.map((item) => (
                <li key={item._id} className="reveal">
                  <ProjectCard project={item} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}

function MetaItem({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-from="right" className={`reveal ${className}`}>
      <dt className="text-small text-muted">{label}</dt>
      <dd className="text-h3">{children}</dd>
    </div>
  );
}

// Faint decorative brush line. It is moved down so its loop sits behind the
// cover image (which hides it) instead of crossing the header text.
function DetailStroke() {
  return (
    <svg
      viewBox="0 0 1440 1400"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-1/2 hidden w-[90rem] max-w-none -translate-x-1/2 overflow-visible text-ink/15 lg:block"
    >
      <path
        transform="translate(0 420)"
        d="M-1000 324L-20 520C180 560 400 610 560 628C700 644 700 570 640 545C560 512 470 520 505 590C540 660 640 690 760 760C960 880 1200 1180 1460 1290L2400 1688"
        stroke="currentColor"
        strokeWidth="17"
        strokeLinecap="round"
      />
    </svg>
  );
}
