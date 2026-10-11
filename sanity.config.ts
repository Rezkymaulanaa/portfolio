"use client";

// Sanity Studio configuration. The Studio runs at /studio.

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

// Actions allowed on the single "Site settings" document (no duplicate/delete).
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: "/studio",
  title: "Alif Portfolio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide "Site settings" from the global "Create new" menu.
    templates: (templates) =>
      templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  document: {
    actions: (input, context) =>
      context.schemaType === "siteSettings"
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
  plugins: [structureTool({ structure })],
});
