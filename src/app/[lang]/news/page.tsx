import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { NewsCard } from "@/components/news/NewsCard";
import { Newsletter } from "@/components/Newsletter";
import { hasLocale, languageAlternates } from "@/lib/i18n";
import { getPlatformDict } from "@/lib/platform-i18n";
import { getPublicNews } from "@/lib/server/public";

export async function generateMetadata({ params }: PageProps<"/[lang]/news">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getPlatformDict(lang).news;
  return {
    title: t.title,
    description: t.lead,
    alternates: { canonical: `/${lang}/news`, languages: languageAlternates("/news") },
    openGraph: { title: `${t.title} · Go4Visa`, description: t.lead, url: `/${lang}/news` },
  };
}

export default async function NewsPage({ params }: PageProps<"/[lang]/news">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getPlatformDict(lang).news;
  const items = await getPublicNews();
  return (
    <>
      <PageHeader id="news-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section aria-labelledby="news-title" className="relative z-10 -mt-14 pb-16">
        <div className="container-brand">
          {items.length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <li key={a.id}>
                  <NewsCard a={a} lang={lang} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-brand-lg bg-white px-6 py-16 text-center font-medium text-midnight ring-1 ring-line">{t.empty}</p>
          )}
        </div>
      </section>
      <Newsletter lang={lang} />
    </>
  );
}
