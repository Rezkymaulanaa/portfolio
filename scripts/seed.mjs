// Seed script: fills Sanity with the content from the design mockups.
// Run with: npm run seed
// Safe to run again: documents use fixed IDs and are replaced, not duplicated.
// Texts marked [PLACEHOLDER] are listed in TODO.md.

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

const designDir = path.resolve("design");

// Uploads a local image file and returns a Sanity image field value.
async function uploadImage(relativePath, alt) {
  const filePath = path.join(designDir, relativePath);
  const asset = await client.assets.upload("image", readFileSync(filePath), {
    filename: path.basename(filePath),
  });
  console.log(`  uploaded ${relativePath}`);
  const image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  return alt ? { ...image, alt } : image;
}

function ref(id, key) {
  const value = { _type: "reference", _ref: id };
  return key ? { ...value, _key: key } : value;
}

// ---------- Tools (order from the design) ----------

const tools = [
  ["drawio", "Draw.io", "tools/drawio.svg"],
  ["figma", "Figma", "tools/figma.svg"],
  ["mysql", "MySQL", "tools/mysql.svg"],
  ["canva", "Canva", "tools/canva.svg"],
  ["lightroom", "Adobe Lightroom", "tools/lightroom.svg"],
  ["excel", "Microsoft Excel", "tools/excel.svg"],
  ["word", "Microsoft Word", "tools/word.svg"],
  ["powerpoint", "Microsoft PowerPoint", "tools/powerpoint.svg"],
  ["power-bi", "Power BI", "tools/power-bi.svg"],
  ["tableau", "Tableau", "tools/tableau.png"],
  ["google-sheets", "Google Sheets", "tools/google-sheets.svg"],
  ["google-drive", "Google Drive", "tools/google-drive.svg"],
  ["gemini", "Gemini", "tools/gemini.svg"],
  ["chatgpt", "ChatGPT", "tools/chatgpt.svg"],
  ["claude", "Claude", "tools/claude.svg"],
];

// ---------- Services ----------

const services = [
  {
    _id: "service-ui-ux-design",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "Designing clear and scalable interfaces for dashboard, mobile apps, and websites.",
  },
  {
    _id: "service-graphic-design",
    title: "Graphic Design",
    slug: "graphic-design",
    description: "[PLACEHOLDER] Short description of your graphic design service.",
  },
  {
    _id: "service-web-design-dev",
    title: "Web Design & Dev",
    slug: "web-design-dev",
    description: "[PLACEHOLDER] Short description of your web design & development service.",
  },
];

// ---------- Skill groups ----------

const skillGroups = [
  {
    _id: "skill-business-process",
    title: "Business Process Management",
    items: ["Business Process Mapping", "User Requirements Analysis", "Workflow Optimization"],
  },
  {
    _id: "skill-design-methodology",
    title: "Design & Methodology",
    items: ["Design Thinking", "Empathize, Define, Ideate", "Prototyping, Wireframing, and Testing"],
  },
  {
    _id: "skill-programming-tools",
    title: "Programming & Tools",
    items: [
      "I have a basic understanding of JavaScript, Python, PHP, HTML, CSS, and SQL gained through learning and college projects.",
      "Figma, Canva, Adobe Lightroom (for Design)",
      "Flowchart Tools",
      "Ms. Office & Google Workspace",
    ],
  },
];

// ---------- Projects (the 4 cards from the design) ----------

const projects = [
  {
    _id: "project-cyber-security-web-app",
    title: "Cyber Security - Web App",
    slug: "cyber-security-web-app",
    category: "real-project", // [PLACEHOLDER] category
    tags: ["Landing Page", "Web App"],
    service: "service-ui-ux-design", // [PLACEHOLDER] service
    shortDescription: "[PLACEHOLDER] Short description of this project.",
  },
  {
    _id: "project-nala-heritage-mobile-apps",
    title: "Nala Heritage Mobile Apps",
    slug: "nala-heritage-mobile-apps",
    category: "real-project", // [PLACEHOLDER] category
    tags: ["UI/UX Design", "Mobile App"],
    service: "service-ui-ux-design",
    shortDescription: "[PLACEHOLDER] Short description of this project.",
  },
  {
    _id: "project-cyber-security-web-app-2",
    title: "Cyber Security - Web App",
    slug: "cyber-security-web-app-2",
    category: "exploration", // [PLACEHOLDER] category
    tags: ["Landing Page", "Web App"],
    service: "service-ui-ux-design", // [PLACEHOLDER] service
    shortDescription: "[PLACEHOLDER] Short description of this project.",
  },
  {
    _id: "project-nala-mobile-app",
    title: "Nala Mobile App",
    slug: "nala-mobile-app",
    category: "exploration", // [PLACEHOLDER] category
    tags: ["UI/UX Design", "Mobile Apps"],
    service: "service-ui-ux-design",
    shortDescription:
      "a modern mobile app design, clean, elegant, and high-end apps experience.",
    timeline: "4 Weeks",
    tools: ["canva", "figma"],
    livePreviewUrl: "https://example.com", // [PLACEHOLDER] real URL
  },
];

// ---------- Run ----------

async function seed() {
  const tx = client.transaction();

  console.log("Uploading tool icons...");
  for (const [id, name, file] of tools) {
    tx.createOrReplace({ _id: `tool-${id}`, _type: "tool", name, icon: await uploadImage(file) });
  }

  for (const [index, service] of services.entries()) {
    tx.createOrReplace({
      _id: service._id,
      _type: "service",
      title: service.title,
      slug: { _type: "slug", current: service.slug },
      description: service.description,
      order: (index + 1) * 10,
    });
  }

  for (const [index, group] of skillGroups.entries()) {
    tx.createOrReplace({ ...group, _type: "skillGroup", order: (index + 1) * 10 });
  }

  console.log("Uploading project images...");
  for (const [index, project] of projects.entries()) {
    const { tools: toolIds = [], service, slug, ...fields } = project;
    tx.createOrReplace({
      ...fields,
      _type: "project",
      slug: { _type: "slug", current: slug },
      service: ref(service),
      tools: toolIds.map((id) => ref(`tool-${id}`, id)),
      coverImage: await uploadImage(
        "cover-proyek.png",
        `[PLACEHOLDER] Preview of the ${project.title} project`,
      ),
      featured: true,
      order: (index + 1) * 10,
    });
  }

  console.log("Uploading hero photo...");
  const heroImage = await uploadImage(
    "foto-hero.png",
    "Black and white portrait of Alif Rezky Maulana in a suit",
  );

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    fullName: "Alif Rezky Maulana",
    headline: "Bachelor of Information System",
    tagline: "Designing digital products that are clear, usable, and conversion focused.",
    heroImage,
    availabilityLabel: "Available for New Project",
    isAvailable: true,
    aboutHeading: "About Me",
    aboutText:
      "[PLACEHOLDER] Write a short introduction about yourself here.\n\n[PLACEHOLDER] Add a second paragraph about your background, education, or what you enjoy working on.",
    aboutImage: { ...heroImage, alt: "[PLACEHOLDER] Photo of Alif Rezky Maulana" },
    contactEmail: "your-email@example.com", // [PLACEHOLDER]
    linkedinUrl: "https://www.linkedin.com/", // [PLACEHOLDER]
    instagramUrl: "https://www.instagram.com/", // [PLACEHOLDER]
    ctaHeading: "Have a project in mind?",
    ctaText:
      "Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life in a way that resonates with everyone",
    footerName: "Alif Rezky",
    usualTools: tools.map(([id]) => ref(`tool-${id}`, id)),
    siteTitle: "Alif Rezky Maulana — Portfolio",
    siteDescription:
      "Designing digital products that are clear, usable, and conversion focused.",
  });

  console.log("Saving documents...");
  await tx.commit();
  console.log("Done! Open /studio to see the content.");
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
