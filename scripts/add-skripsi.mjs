// Adds the thesis (skripsi) project with its case study to Sanity.
// Run with: npm run add-skripsi
// Running it again REPLACES the project, so edits made in the Studio are lost.
// After the first run, edit this project in the Studio instead.

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import path from "node:path";

const { NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN } =
  process.env;

if (!NEXT_PUBLIC_SANITY_PROJECT_ID || !NEXT_PUBLIC_SANITY_DATASET || !SANITY_API_WRITE_TOKEN) {
  console.error("Missing Sanity values in .env.local (see .env.example).");
  process.exit(1);
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET,
  token: SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-03-01",
  useCdn: false,
});

async function uploadImage(relativePath, alt) {
  const filePath = path.resolve("design", relativePath);
  const asset = await client.assets.upload("image", readFileSync(filePath), {
    filename: path.basename(filePath),
  });
  console.log(`  uploaded ${relativePath}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

const ref = (id, key) => ({ _type: "reference", _ref: id, ...(key ? { _key: key } : {}) });

// Array items in Sanity need a unique _key.
const keyed = (prefix, items) => items.map((item, i) => ({ _key: `${prefix}${i + 1}`, ...item }));

const newTools = [
  ["nextjs", "Next.js", "tools/nextjs.svg"],
  ["supabase", "Supabase", "tools/supabase.svg"],
];

async function run() {
  const tx = client.transaction();

  console.log("Uploading tool icons...");
  for (const [id, name, file] of newTools) {
    tx.createOrReplace({ _id: `tool-${id}`, _type: "tool", name, icon: await uploadImage(file) });
  }

  console.log("Uploading cover image...");
  const coverImage = await uploadImage(
    "cover-proyek.png",
    "[PLACEHOLDER] Preview of the newborn JKN registration system",
  );

  tx.createOrReplace({
    _id: "project-skripsi-jkn-newborn",
    _type: "project",
    title: "Newborn JKN Registration System",
    slug: { _type: "slug", current: "newborn-jkn-registration-system" },
    category: "real-project",
    tags: ["Web App", "Undergraduate Thesis"],
    service: ref("service-web-design-dev"),
    shortDescription:
      "A web-based information system that brings birth administration across health facilities, the civil registry, and BPJS Kesehatan into one platform.",
    timeline: "Feb – Jun 2026",
    tools: ["nextjs", "supabase", "figma", "drawio"].map((id) => ref(`tool-${id}`, id)),
    coverImage,
    facts: keyed("fact", [
      { label: "Role", value: "Author & Developer" },
      { label: "Case study", value: "BPJS Kesehatan Kota Makassar" },
      { label: "Platform", value: "Website" },
      { label: "Method", value: "Waterfall" },
    ]),
    content: keyed("block", [
      {
        _type: "caseText",
        heading: "Overview",
        body: [
          "My undergraduate thesis. I designed and built a web-based information system for the birth administration process used to issue JKN membership for newborns, with BPJS Kesehatan Kota Makassar as the case study.",
          "Thesis title: Rancang Bangun Sistem Informasi Layanan Administrasi Kelahiran untuk Penerbitan Kepesertaan JKN Bayi Baru Lahir Berbasis Web (Studi Kasus: BPJS Kesehatan Kota Makassar).",
        ].join("\n\n"),
      },
      {
        _type: "caseStats",
        items: keyed("stat", [
          { value: "100%", label: "Test success rate" },
          { value: "50+", label: "Black box test scenarios" },
          { value: "3", label: "Institutions in one platform" },
        ]),
      },
      {
        _type: "caseText",
        heading: "Background",
        points: [
          "Under Presidential Regulation (Perpres) No. 82 of 2018, registering a newborn for JKN involves three institutions: the health facility (Faskes), the civil registry (Dukcapil), and BPJS Kesehatan.",
          "The administration between these institutions was still done manually and separately.",
          "This can cause delays, recording errors, and incomplete documents, which makes the service less efficient.",
        ],
      },
      {
        _type: "caseProblems",
        heading: "Problem & Solution",
        items: keyed("pair", [
          {
            problem:
              "Faskes, Dukcapil, and BPJS Kesehatan handle newborn registration manually and separately, which risks delays, recording errors, and incomplete documents.",
            solution:
              "A web-based information system that integrates the administration process of the three institutions in one platform.",
          },
        ]),
      },
      {
        _type: "caseSteps",
        heading: "Process",
        intro: "The system was built with the Waterfall method, one stage after another.",
        steps: keyed("step", [
          {
            title: "Interview",
            description: "Interview with the Head of the Membership Section at BPJS Kesehatan Kota Makassar.",
          },
          { title: "System requirements analysis" },
          { title: "System design" },
          { title: "Implementation", description: "Built with Next.js and Supabase." },
          { title: "Testing", description: "Black box testing with more than 50 test scenarios." },
        ]),
      },
      {
        _type: "caseText",
        heading: "Result",
        body: "The system was successfully designed and built, and it supports the birth administration process in an integrated way. All 50+ black box test scenarios passed (100% success rate).",
      },
    ]),
    featured: false,
    order: 5,
  });

  console.log("Saving documents...");
  await tx.commit();
  console.log("Done! Open /work/newborn-jkn-registration-system to see it.");
}

run().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
