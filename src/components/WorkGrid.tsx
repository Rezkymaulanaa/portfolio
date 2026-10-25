"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { useDictionary } from "@/i18n/I18nProvider";
import type { ProjectCardData } from "@/sanity/lib/queries";
import { ProjectCard } from "./ProjectCard";

// Filter tabs (All / Real Project / Exploration) and the project card grid.
// Filtering happens instantly in the browser. The picked tab is kept in the
// address (?filter=exploration), so Back from a project shows the same cards
// again (and returns to the same spot), and a filtered link can be shared.

const FILTERS = ["all", "real-project", "exploration"] as const;
const PARAM = "filter";

type FilterValue = (typeof FILTERS)[number];

function isFilter(value: string | null): value is FilterValue {
  return FILTERS.includes(value as FilterValue);
}

// Puts the filter in the address without a new step in the history
// ("All" removes it again).
function saveFilter(filter: FilterValue) {
  const params = new URLSearchParams(window.location.search);
  if (filter === "all") params.delete(PARAM);
  else params.set(PARAM, filter);
  const search = params.toString();
  window.history.replaceState(
    window.history.state,
    "",
    window.location.pathname + (search ? `?${search}` : "") + window.location.hash,
  );
}

type WorkGridProps = {
  projects: ProjectCardData[];
  /** Optional element on the right of the tabs, e.g. "View All work". */
  action?: ReactNode;
};

export function WorkGrid({ projects, action }: WorkGridProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const t = useDictionary();

  // Read the filter from the address before the page is drawn, so after
  // Back the filtered cards are in place when the scroll position is restored
  // (SmoothScroll). Not with useSearchParams: that would leave the cards out
  // of the prebuilt HTML.
  useLayoutEffect(() => {
    const saved = new URLSearchParams(window.location.search).get(PARAM);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the address once, before the first paint
    if (isFilter(saved)) setFilter(saved);
  }, []);

  function pick(item: FilterValue) {
    setFilter(item);
    saveFilter(item);
  }

  const visible =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul data-from="left" className="reveal flex flex-wrap gap-x-6 gap-y-2 text-pill lg:gap-x-10" aria-label={t.work.filterLabel}>
          {FILTERS.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => pick(item)}
                aria-pressed={filter === item}
                className={`rounded-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none ${
                  filter === item ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item === "all" ? t.work.all : t.category[item]}
              </button>
            </li>
          ))}
        </ul>
        {action && (
          <div data-from="right" className="reveal">
            {action}
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:gap-y-16">
          {visible.map((project) => (
            <li key={project._id} data-from="scale" className="reveal">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-14 text-center text-muted" role="status">
          {t.work.empty}
        </p>
      )}
    </div>
  );
}
