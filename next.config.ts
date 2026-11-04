import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // photos uploaded from the back-office live in Vercel Blob
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // The old destination pages were replaced by the scholarship directory: keep shared links working.
  async redirects() {
    return [{ source: "/:lang(en|fr|ar)/destinations/:slug*", destination: "/:lang/scholarships", permanent: true }];
  },
  experimental: {
    // 404 for unmatched URLs, since the root layout lives under app/[lang]
    globalNotFound: true,
    // Optional: limit build workers on low-memory machines, e.g. NEXT_BUILD_CPUS=1 npm run build
    ...(process.env.NEXT_BUILD_CPUS ? { cpus: Number(process.env.NEXT_BUILD_CPUS) } : {}),
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
