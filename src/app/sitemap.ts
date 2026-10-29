import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { destinationSlugs } from "@/lib/destinations";
import { locales } from "@/lib/i18n";
import { getPublicScholarships } from "@/lib/server/public";

// Bump when static content changes (a fixed date keeps the sitemap prerenderable).
const LAST_UPDATED = "2026-10-29";

/** One entry per page and language, each listing its other-language version. */
function entry(path: string, priority: number, lastModified = LAST_UPDATED, changeFrequency: "daily" | "weekly" | "monthly" = "monthly"): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`]));
  return locales.map((l) => ({
    url: `${site.url}/${l}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const scholarships = await getPublicScholarships();
  return [
    ...entry("", 1, LAST_UPDATED, "daily"),
    ...entry("/scholarships", 0.95, LAST_UPDATED, "daily"),
    ...scholarships.filter((s) => s.deadline_status !== "closed").flatMap((s) => entry(`/scholarships/${s.slug}`, 0.85, s.updated_at, "weekly")),
    ...entry("/how-it-works", 0.9),
    ...entry("/faq", 0.8),
    ...entry("/apply", 0.9),
    ...destinationSlugs.flatMap((slug) => entry(`/destinations/${slug}`, 0.8)),
  ];
}
