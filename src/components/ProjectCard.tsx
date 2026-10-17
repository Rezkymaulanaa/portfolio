import Link from "next/link";
import { CATEGORY_LABELS, type ProjectCardData } from "@/sanity/lib/queries";
import { ProjectCover } from "./ProjectCover";

// Project card: cover image (plain or in a device mockup) with the category
// label on the top-left, then title, short description and tags
// ("UI/UX Design / Web App"). The whole card is a link.

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      <div className="relative">
        <ProjectCover image={project.coverImage} style={project.coverStyle} extraImages={project.coverImages} />
        <CategoryLabel category={project.category} />
      </div>

      <h3 className="mt-4 text-h4 font-medium lg:mt-5">{project.title}</h3>

      {project.shortDescription && (
        <p className="mt-1.5 text-small text-ink/70">
          {project.shortDescription}
        </p>
      )}

      {project.tags && project.tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-x-3 text-small text-muted">
          {project.tags.map((tag) => (
            <li key={tag} className="before:mr-3 before:text-line before:content-['/'] first:before:hidden">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}

// Category badge on the top-left of the thumbnail. Neutral colors on purpose:
// pink is reserved for buttons. Real Project = dark, Exploration = light.
function CategoryLabel({ category }: { category: ProjectCardData["category"] }) {
  const label = CATEGORY_LABELS[category];
  if (!label) return null;

  return (
    <span
      className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-label font-medium backdrop-blur-sm lg:top-4 lg:left-4 lg:px-3.5 lg:py-1.5 ${
        category === "real-project"
          ? "border border-white/15 bg-ink/80 text-page"
          : "bg-surface/90 text-ink shadow-pill"
      }`}
    >
      {label}
    </span>
  );
}
