import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images come from the Sanity CDN, which resizes them for us.
    loader: "custom",
    loaderFile: "./src/sanity/lib/image-loader.ts",
  },
  // Security headers for every page (Vercel already adds HTTPS-only).
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Other websites may not show this site (or the Studio) in a frame,
          // which blocks "clickjacking" tricks. Both lines do the same; the
          // first is for older browsers.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // Browsers must not guess file types (e.g. run an upload as a script).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Other sites only see the domain a visitor came from, not the full page address.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site never needs the camera, microphone or location.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
