import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images come from the Sanity CDN, which resizes them for us.
    loader: "custom",
    loaderFile: "./src/sanity/lib/image-loader.ts",
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
