"use client";

import { useDictionary } from "@/i18n/I18nProvider";
import type { ProjectCardData } from "@/sanity/lib/queries";

// Category badge on the top-left of a project thumbnail. Neutral colors on
// purpose: pink is reserved for buttons. Real Project = dark, Exploration = light.

export function CategoryLabel({ category }: { category: ProjectCardData["category"] }) {
  const label = useDictionary().category[category];
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
