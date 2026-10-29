import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Directory, DirectorySkeleton } from "@/components/scholarships/Directory";
import { hasLocale, languageAlternates } from "@/lib/i18n";
import { getPlatformDict } from "@/lib/platform-i18n";
import { getPublicScholarships, toListItem } from "@/lib/server/public";

export async function generateMetadata({ params }: PageProps<"/[lang]/scholarships">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getPlatformDict(lang).directory;
  return {
    title: t.title,
    description: t.lead,
    alternates: { canonical: `/${lang}/scholarships`, languages: languageAlternates("/scholarships") },
    openGraph: { title: `${t.title} · Go4Visa`, description: t.lead, url: `/${lang}/scholarships` },
  };
}

export default async function ScholarshipsPage({ params }: PageProps<"/[lang]/scholarships">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getPlatformDict(lang).directory;
  const items = await getPublicScholarships();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.title,
    itemListElement: items
      .filter((s) => s.deadline_status !== "closed")
      .map((s, i) => ({ "@type": "ListItem", position: i + 1, url: `/${lang}/scholarships/${s.slug}`, name: s.title })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader id="scholarships-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section aria-labelledby="scholarships-title" className="relative z-10 -mt-14 pb-20 md:-mt-16">
        <div className="container-brand">
          {/* the filters read the URL, which is only known per request */}
          <Suspense fallback={<DirectorySkeleton />}>
            <Directory items={items.map(toListItem)} lang={lang} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
