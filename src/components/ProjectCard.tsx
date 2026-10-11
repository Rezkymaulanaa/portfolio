import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { CATEGORY_LABELS, type ProjectCardData } from "@/sanity/lib/queries";
import { Tag } from "./Tag";

// White card with cover image, category label, title and tags.
// The whole card is a link.

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative block rounded-card bg-surface p-3 pb-5 transition duration-300 hover:-translate-y-1 hover:shadow-float focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-4 lg:pb-7"
    >
      <CategoryLabel category={project.category} />
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

// Category badge on the top-left edge of the card. Neutral colors on purpose:
// pink is reserved for buttons and tags. Real Project = dark, Exploration = light.
function CategoryLabel({ category }: { category: ProjectCardData["category"] }) {
  const label = CATEGORY_LABELS[category];
  if (!label) return null;

  return (
    <span
      className={`absolute top-6 left-0 z-10 rounded-r-full px-4 py-1.5 text-sm backdrop-blur-sm lg:top-8 lg:px-5 lg:py-2 lg:text-lg ${
        category === "real-project" ? "bg-ink/85 text-page" : "bg-surface/90 text-ink shadow-pill"
      }`}
    >
      {label}
    </span>
  );
}
