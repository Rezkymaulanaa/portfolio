// Adds the Desa Tanakaraeng village website project (KKN) with its case study to Sanity.
// Run with: npm run add-desa-tanakaraeng
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

async function uploadImage(relativePath, alt, extra = {}) {
  const filePath = path.resolve("design", relativePath);
  const asset = await client.assets.upload("image", readFileSync(filePath), {
    filename: path.basename(filePath),
  });
  console.log(`  uploaded ${relativePath}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt, ...extra };
}

const ref = (id, key) => ({ _type: "reference", _ref: id, ...(key ? { _key: key } : {}) });

// Array items in Sanity need a unique _key.
const keyed = (prefix, items) => items.map((item, i) => ({ _key: `${prefix}${i + 1}`, ...item }));

const newTools = [
  ["react", "React", "tools/react.svg"],
  ["vite", "Vite", "tools/vite.svg"],
  ["firebase", "Firebase", "tools/firebase.svg"],
  ["vercel", "Vercel", "tools/vercel.svg"],
];

async function run() {
  console.log("Uploading tool icons...");
  for (const [id, name, file] of newTools) {
    await client.createOrReplace({ _id: `tool-${id}`, _type: "tool", name, icon: await uploadImage(file) });
  }

  console.log("Uploading images...");
  const coverImage = await uploadImage(
    "desa-tanakaraeng/home.png",
    "Home page of the Desa Tanakaraeng website with a rice field hero image",
  );
  const screenshots = [
    await uploadImage(
      "desa-tanakaraeng/infografis.png",
      "Infographic page showing population data of Desa Tanakaraeng",
      { caption: "Infographics: population and stunting data", mockup: "laptop" },
    ),
    await uploadImage(
      "desa-tanakaraeng/umkm.png",
      "UMKM page listing local small businesses with photos and prices",
      { caption: "UMKM directory with category filter", mockup: "laptop" },
    ),
    await uploadImage(
      "desa-tanakaraeng/berita.png",
      "Village news page with article cards",
      { caption: "Village news, managed from the admin dashboard", mockup: "laptop" },
    ),
  ];

  await client.createOrReplace({
    _id: "project-desa-tanakaraeng-website",
    _type: "project",
    title: "Desa Tanakaraeng Village Website",
    slug: { _type: "slug", current: "desa-tanakaraeng-village-website" },
    category: "real-project",
    tags: ["Web App", "Community Service"],
    service: ref("service-web-design-dev"),
    shortDescription:
      "The first official website of Desa Tanakaraeng, Gowa: village profile, population infographics, local businesses, news and an online complaint form, managed by village staff through an admin dashboard.",
    timeline: "Jul – Aug 2025",
    tools: newTools.map(([id]) => ref(`tool-${id}`, id)),
    coverImage,
    coverStyle: "laptop",
    facts: keyed("fact", [
      { label: "Role", value: "Solo Developer" },
      { label: "Client", value: "Desa Tanakaraeng Government, Gowa" },
      { label: "Program", value: "KKN-T Universitas Hasanuddin Batch 114" },
      { label: "Tech stack", value: "React, Vite, Firebase" },
    ]),
    content: keyed("block", [
      {
        _type: "caseText",
        heading: "Overview",
        body: [
          "During my community service program (KKN-T Batch 114, Universitas Hasanuddin) in Desa Tanakaraeng, Manuju District, Gowa Regency, I designed and built the village's first official website.",
          "The website brings the village profile, government structure, population data, local potential, UMKM (small businesses) and village news together in one place, and gives residents an online channel to send complaints. Village staff manage all content themselves through an admin dashboard.",
        ].join("\n\n"),
      },
      {
        _type: "caseStats",
        items: keyed("stat", [
          { value: "4 weeks", label: "From first line of code to launch" },
          { value: "7", label: "Main features in one platform" },
          { value: "2,700", label: "Residents the site serves" },
          { value: "Rp315K", label: "Total project budget" },
        ]),
      },
      {
        _type: "caseText",
        heading: "Background",
        points: [
          "Desa Tanakaraeng has 2,700 residents in 872 households, most working in farming, livestock and small businesses.",
          "The village had no official digital media. Information was shared through notice boards, village meetings and word of mouth, so residents living far from the village center and outsiders had limited access.",
          "Local products and businesses were only known inside the village, and activity records were kept manually.",
          "Residents who wanted to raise an issue had to come to the village office in person.",
        ],
      },
      {
        _type: "caseProblems",
        heading: "Problem & Solution",
        items: keyed("pair", [
          {
            problem:
              "Village information (profile, government structure, population data, news) only reached people through notice boards and word of mouth.",
            solution:
              "A public website with pages for the village profile, government structure, population infographics and news, accessible from any device.",
          },
          {
            problem: "Local products and small businesses were only known within the village.",
            solution:
              "An UMKM directory and a Local Potential page that promote village businesses and potential to a wider audience.",
          },
          {
            problem: "Residents had to visit the village office in person to file a complaint.",
            solution:
              "An online complaint form available on every page, sent straight to the village's email.",
          },
          {
            problem: "Without a developer in the village, a website could quickly become outdated.",
            solution:
              "An admin dashboard so staff can update content themselves, plus hands-on training and a printed user guide.",
          },
        ]),
      },
      {
        _type: "caseSteps",
        heading: "Process",
        steps: keyed("step", [
          {
            title: "Observation & problem identification",
            description:
              "Field observation and interviews with the village head and staff to map the information and service problems.",
          },
          {
            title: "Website design",
            description:
              "Defined the page structure from the village monograph data and staff input: Profile, Government Structure, Population Data, Local Potential, UMKM, News and Online Complaints. Kept the design simple and easy to use.",
          },
          {
            title: "Development",
            description:
              "Built the public pages first (navbar, home, profile, infographics, potential, UMKM, news), then the admin login, dashboard and database connection. Filled every page with real data from village staff and connected the complaint form to the village email.",
          },
          {
            title: "Testing & hosting",
            description:
              "Made the site responsive for tablet and mobile, fixed bugs, tested every feature and deployed it to a public domain.",
          },
          {
            title: "Training",
            description:
              "Trained the appointed staff member to use the admin dashboard: posting news, updating data and handling complaints.",
          },
          {
            title: "Handover",
            description:
              "Handed the website over to the village government on 6 August 2025, together with a user guide book.",
          },
        ]),
      },
      {
        _type: "caseImages",
        heading: "Screens",
        images: keyed("img", screenshots),
      },
      {
        _type: "caseText",
        heading: "Result",
        body: "The website launched on time and is publicly accessible. The village head confirmed in an official letter that it is used by the community, works well and helps the village move toward digital transformation. The launch was also covered by Unhas TV.",
        points: [
          "An official website with village profile, government structure, population infographics, local potential, UMKM directory, news and online complaints.",
          "A trained staff member who manages the content independently through the admin dashboard.",
          "A printed user guide (Buku Panduan Penggunaan Website Desa Tanakaraeng), so the website can keep running when village staff change.",
        ],
      },
    ]),
    livePreviewUrl: "https://desatanakaraeng.vercel.app/",
    featured: false,
    order: 6,
  });

  console.log("Done! Open /work/desa-tanakaraeng-village-website to see it.");
}

run().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
