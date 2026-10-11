import type { StructureResolver } from "sanity/structure";

// Custom Studio sidebar: "Site settings" opens the single settings document
// directly, followed by the normal lists for all other document types.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("skillGroup").title("Skill groups"),
      S.documentTypeListItem("tool").title("Tools"),
    ]);
