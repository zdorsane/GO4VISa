import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { destinationSlugs } from "@/lib/destinations";
import { locales } from "@/lib/i18n";

// Bump when content changes (a fixed date keeps the sitemap prerenderable).
const LAST_UPDATED = "2026-10-16";

/** One entry per page and language, each listing its other-language version. */
function entry(path: string, priority: number): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`]));
  return locales.map((l) => ({
    url: `${site.url}/${l}${path}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("", 1),
    ...destinationSlugs.flatMap((slug) => entry(`/destinations/${slug}`, 0.8)),
  ];
}
