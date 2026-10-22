import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";

// Shared pieces for the social share images (opengraph-image.tsx files) and
// the Open Graph metadata. Share images are 1200×630, the size LinkedIn,
// WhatsApp, Facebook and X expect.

export const OG_SIZE = { width: 1200, height: 630 };

// Same colors as the design tokens in globals.css.
export const OG_COLORS = {
  page: "#f5f5f5",
  ink: "#1a1a1a",
  accent: "#f7bcff",
  muted: "#6e6e6e",
  line: "#bfbfbf",
  available: "#00d26a",
};

const FONT_FILES = {
  500: "Poppins-Medium.ttf",
  700: "Poppins-Bold.ttf",
  800: "Poppins-ExtraBold.ttf",
} as const;

// Poppins, the website font, from src/assets/fonts.
export async function loadOgFonts() {
  return Promise.all(
    Object.entries(FONT_FILES).map(async ([weight, file]) => ({
      name: "Poppins",
      data: await readFile(join(process.cwd(), "src/assets/fonts", file)),
      weight: Number(weight) as 500 | 700 | 800,
      style: "normal" as const,
    })),
  );
}

// Open Graph fields every page shares. A page that sets its own openGraph
// replaces the whole object, so pages spread this in.
export function openGraphBase(siteName: string): NonNullable<Metadata["openGraph"]> {
  return { type: "website", siteName, locale: "en_US" };
}

// Shortens text to whole words, with "…" at the end.
export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}
