import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { ProjectCardData } from "@/sanity/lib/queries";
import { Tag } from "./Tag";

// White card with cover image, title and tags. The whole card is a link.

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block rounded-card bg-surface p-3 pb-5 transition duration-300 hover:-translate-y-1 hover:shadow-float focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-4 lg:pb-7"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-page">
        <Image
          src={urlFor(project.coverImage)}
          alt={project.coverImage.alt ?? ""}
          fill
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <h3 className="mt-3 text-lg lg:mt-4 lg:text-2xl">{project.title}</h3>
      {project.tags && project.tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2.5 lg:mt-3">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
