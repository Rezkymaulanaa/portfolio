"use client";

import { useEffect, useState } from "react";

// Sticky side menu of the case study. Highlights the section in view.

export type CaseNavItem = { id: string; label: string };

export function CaseNav({ items }: { items: CaseNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // A section counts as "in view" when it crosses the upper part of the screen.
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="sticky top-10">
      <p className="text-label font-semibold uppercase tracking-[0.2em] text-muted">Contents</p>
      <ol className="mt-5 border-l border-line">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px flex gap-3 border-l-2 py-2 pl-4 text-small transition-colors duration-200 motion-reduce:transition-none ${
                  isActive
                    ? "border-ink font-semibold text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
