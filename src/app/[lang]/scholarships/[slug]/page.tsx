import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScholarshipDetail } from "@/components/scholarships/ScholarshipDetail";
import { site } from "@/lib/content";
import { countryName } from "@/lib/countries";
import { hasLocale, languageAlternates, locales } from "@/lib/i18n";
import { getPlatformDict } from "@/lib/platform-i18n";
import { getPublicScholarship, getPublicScholarships, type PublicScholarship } from "@/lib/server/public";

// Opportunities published after the build render on their first visit (blocking is fine here).
export const instant = false;

/** Prerender the published opportunities; new ones render on first visit. */
export async function generateStaticParams() {
  const slugs = (await getPublicScholarships()).map((s) => s.slug);
  // Cache Components needs at least one entry: a placeholder that resolves to the 404 page
  return locales.flatMap((lang) => (slugs.length ? slugs : ["_"]).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/scholarships/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const data = await getPublicScholarship(slug);
  if (!data) return {};
  const s = data.scholarship;
  const t = getPlatformDict(lang);
  const description = s.summary ?? `${s.institution} · ${countryName(s.country_code, lang)} · ${t.funding[s.funding_type]}`;
  return {
    title: s.title,
    description,
    alternates: { canonical: `/${lang}/scholarships/${s.slug}`, languages: languageAlternates(`/scholarships/${s.slug}`) },
    openGraph: { type: "article", title: `${s.title} · Go4Visa`, description, url: `/${lang}/scholarships/${s.slug}` },
  };
}

/** Same level or category, still open, closest deadline first. */
function relatedTo(s: PublicScholarship, all: PublicScholarship[]) {
  return all
    .filter((x) => x.slug !== s.slug && x.deadline_status !== "closed")
    .map((x) => ({
      x,
      score:
        x.levels.filter((l) => s.levels.includes(l)).length * 2 +
        x.categories.filter((c) => s.categories.includes(c)).length * 2 +
        Number(x.country_code === s.country_code),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ x }) => x);
}

export default async function ScholarshipPage({ params }: PageProps<"/[lang]/scholarships/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [data, all] = await Promise.all([getPublicScholarship(slug), getPublicScholarships()]);
  if (!data) notFound();
  const s = data.scholarship;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MonetaryGrant",
    name: s.title,
    description: s.summary ?? s.description ?? undefined,
    url: `${site.url}/${lang}/scholarships/${s.slug}`,
    funder: { "@type": "Organization", name: s.institution },
    ...(s.source_url ? { sameAs: s.source_url } : {}),
    ...(s.deadline_at ? { expires: s.deadline_at } : {}),
    ...(s.opens_at ? { startDate: s.opens_at } : {}),
    areaServed: countryName(s.country_code, "en"),
    dateModified: s.updated_at,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ScholarshipDetail s={s} sources={data.sources} related={relatedTo(s, all)} lang={lang} />
    </>
  );
}
