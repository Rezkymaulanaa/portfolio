// Custom loader for next/image.
// Sanity's CDN already resizes and converts images, so we ask it for the
// right width instead of using Vercel's image optimization (saves free-plan quota).

type LoaderProps = { src: string; width: number; quality?: number };

export default function sanityImageLoader({ src, width, quality }: LoaderProps) {
  if (!src.startsWith("https://cdn.sanity.io/")) {
    return src;
  }
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
}
