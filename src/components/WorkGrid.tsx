"use client";

import { useState, type ReactNode } from "react";
import type { ProjectCardData } from "@/sanity/lib/queries";
import { ProjectCard } from "./ProjectCard";

// Filter tabs (All / Real Project / Exploration) and the project card grid.
// Filtering happens instantly in the browser.

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Real Project", value: "real-project" },
  { label: "Exploration", value: "exploration" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

type WorkGridProps = {
  projects: ProjectCardData[];
  /** Optional element on the right of the tabs, e.g. "View All work". */
  action?: ReactNode;
};

export function WorkGrid({ projects, action }: WorkGridProps) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const visible =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-pill lg:gap-x-10" aria-label="Filter projects">
          {FILTERS.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                onClick={() => setFilter(item.value)}
                aria-pressed={filter === item.value}
                className={`rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none ${
                  filter === item.value ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        {action}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-14">
          {visible.map((project) => (
            <li key={project._id} className="reveal">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-14 text-center text-muted" role="status">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
