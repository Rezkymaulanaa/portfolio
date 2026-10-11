import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashedDivider } from "@/components/DashedDivider";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { PillLink, pillClasses } from "@/components/Pill";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Tag } from "@/components/Tag";
import { client, sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  MORE_PROJECTS_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  type ProjectCardData,
  type ProjectDetail,
  type SizedImage,
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
  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const [project, moreProjects] = await Promise.all([
    sanityFetch<ProjectDetail | null>(PROJECT_QUERY, { slug }),
    sanityFetch<ProjectCardData[]>(MORE_PROJECTS_QUERY, { slug }),
  ]);

  if (!project) notFound();

  const images = [project.coverImage, ...(project.gallery ?? [])];

  return (
    <>
      <article className="relative overflow-x-clip">
        <DetailStroke />

        <div className="relative mx-auto max-w-[76rem] px-4 pt-28 sm:px-6 lg:pt-44">
          <Link href="/work" className={pillClasses("outline", "text-pill")}>
            <ArrowLeftIcon /> Back
          </Link>

          <header className="mt-10 flex flex-col gap-10 lg:mt-[4.5rem] lg:flex-row lg:justify-between">
            <div className="max-w-[42rem]">
              {project.tags && project.tags.length > 0 && (
                <ul className="flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Tag large>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              )}
              <h1 className="mt-5 text-section font-semibold lg:mt-8">{project.title}</h1>
              {project.shortDescription && (
                <p className="mt-3 max-w-[34rem] text-lg leading-tight text-muted lg:mt-5 lg:text-2xl">
                  {project.shortDescription}
                </p>
              )}
              {project.livePreviewUrl && (
                <PillLink
                  href={project.livePreviewUrl}
                  variant="dark"
                  external
                  className="mt-8 text-pill lg:mt-10"
                >
                  Live Preview <ArrowUpRightIcon />
                </PillLink>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:flex lg:flex-col lg:items-end lg:gap-8 lg:text-right">
              {project.service && <MetaItem label="Service">{project.service}</MetaItem>}
              {project.timeline && <MetaItem label="Timeline">{project.timeline}</MetaItem>}
              {project.tools && project.tools.length > 0 && (
                <MetaItem label="Tools">
                  <ul className="mt-1 flex gap-4 lg:justify-end">
                    {project.tools.map((tool) => (
                      <li
                        key={tool._id}
                        className="flex size-14 items-center justify-center rounded-md border border-line bg-surface p-2 shadow-pill lg:size-[5.125rem] lg:p-3"
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

          <div className="mt-12 space-y-6 lg:mt-20">
            {images.map((image, index) => (
              <ProjectImage key={image._key ?? image.asset._ref} image={image} preload={index === 0} />
            ))}
          </div>
        </div>
      </article>

      {moreProjects.length > 0 && (
        <>
          <div className="mt-20 lg:mt-24">
            <DashedDivider />
          </div>
          <section
            aria-labelledby="more-work-heading"
            className="mx-auto max-w-[76rem] px-4 pt-16 pb-4 sm:px-6 lg:pt-24"
          >
            <SectionHeading id="more-work-heading" title="More Work" align="center" />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-16">
              {moreProjects.map((item) => (
                <li key={item._id}>
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

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-base text-muted lg:text-2xl">{label}</dt>
      <dd className="text-xl lg:text-[2.125rem] lg:leading-tight">{children}</dd>
    </div>
  );
}

// Main image and gallery images, each in a white rounded frame.
function ProjectImage({ image, preload }: { image: SizedImage; preload: boolean }) {
  const width = image.dimensions?.width ?? 1600;
  const height = image.dimensions?.height ?? 1200;

  return (
    <figure className="rounded-frame border border-line/40 bg-surface/70 p-3 shadow-pill sm:p-5 lg:p-8">
      <Image
        src={urlFor(image)}
        alt={image.alt ?? ""}
        width={width}
        height={height}
        preload={preload}
        sizes="(min-width: 1216px) 1104px, 100vw"
        className="h-auto w-full"
      />
    </figure>
  );
}

// Gray decorative brush line that crosses behind the header.
function DetailStroke() {
  return (
    <svg
      viewBox="0 0 1440 1400"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-1/2 hidden w-[90rem] -translate-x-1/2 mt-28 text-ink/40 lg:block"
    >
      <path
        d="M-20 520C180 560 400 610 560 628C700 644 700 570 640 545C560 512 470 520 505 590C540 660 640 690 760 760C960 880 1200 1180 1460 1290"
        stroke="currentColor"
        strokeWidth="17"
        strokeLinecap="round"
      />
    </svg>
  );
}
