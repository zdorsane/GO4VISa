import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { NewsLabels } from "@/components/news/NewsCard";
import { site } from "@/lib/content";
import { countryName } from "@/lib/countries";
import { hasLocale, languageAlternates, locales } from "@/lib/i18n";
import { excerpt, renderArticle } from "@/lib/news";
import { formatDate, getPlatformDict } from "@/lib/platform-i18n";
import { getPublicArticle, getPublicNews } from "@/lib/server/public";

// Articles published after the build render on their first visit (blocking is fine here).
export const instant = false;

export async function generateStaticParams() {
  const slugs = (await getPublicNews()).map((a) => a.slug);
  return locales.flatMap((lang) => (slugs.length ? slugs : ["_"]).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/news/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const a = await getPublicArticle(slug);
  if (!a) return {};
  const description = a.seo_description ?? a.summary ?? excerpt(a.body, 160);
  return {
    title: a.seo_title ?? a.title,
    description,
    alternates: { canonical: `/${lang}/news/${a.slug}`, languages: languageAlternates(`/news/${a.slug}`) },
    openGraph: {
      type: "article",
      title: `${a.seo_title ?? a.title} · Go4Visa`,
      description,
      url: `/${lang}/news/${a.slug}`,
      publishedTime: a.published_at ?? undefined,
      modifiedTime: a.updated_at,
      ...(a.cover_url ? { images: [{ url: a.cover_url }] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/news/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const a = await getPublicArticle(slug);
  if (!a) notFound();
  const t = getPlatformDict(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.summary ?? excerpt(a.body, 160),
    datePublished: a.published_at,
    dateModified: a.updated_at,
    inLanguage: a.content_lang,
    ...(a.cover_url ? { image: [a.cover_url] } : {}),
    author: { "@type": a.author ? "Person" : "Organization", name: a.author ?? "Go4Visa" },
    publisher: { "@type": "Organization", name: "Go4Visa", url: site.url },
    mainEntityOfPage: `${site.url}/${lang}/news/${a.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="pb-20" lang={a.content_lang} dir={a.content_lang === "ar" ? "rtl" : undefined}>
        <header className="pattern-flight relative isolate overflow-hidden pb-24 pt-[calc(var(--g4v-header-h)+2rem)]">
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-navy/80 via-midnight/50 to-midnight/95" />
          <div className="container-brand max-w-3xl">
            <Link href={`/${lang}/news`} className="inline-flex items-center gap-2 text-sm text-mist hover:text-white">
              <Icon name="arrow" className="h-4 w-4 rotate-180 rtl:rotate-0" />
              {t.news.back}
            </Link>
            <div className="mt-6">
              <NewsLabels a={a} lang={lang} />
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-[2.6rem]">{a.title}</h1>
            <p className="mt-4 text-sm text-mist">
              {t.newsCategory[a.category]} · {formatDate(a.published_at, lang)}
              {a.author && ` · ${t.news.by} ${a.author}`}
              {a.country_code && ` · ${countryName(a.country_code, lang)}`}
              {a.university && ` · ${a.university}`}
            </p>
          </div>
        </header>
        <div className="container-brand relative z-10 -mt-14 max-w-3xl">
          <div className="overflow-hidden rounded-brand-lg bg-white ring-1 ring-line">
            {a.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element -- covers are stored in Vercel Blob or other hosts
              <img src={a.cover_url} alt="" className="aspect-[16/9] w-full object-cover" />
            )}
            <div className="p-6 md:p-10">
              {a.summary && <p className="text-lg font-medium leading-relaxed text-midnight">{a.summary}</p>}
              <div className="article-body mt-6" dangerouslySetInnerHTML={{ __html: renderArticle(a.body) }} />
              {(a.source_url || a.scholarship_slug) && (
                <div className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
                  {a.source_url && (
                    <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-cloud p-4 text-sm hover:ring-1 hover:ring-ocean/40">
                      <span className="block text-xs text-slate">{t.news.source}</span>
                      <span className="mt-1 block break-all font-semibold text-ocean">{new URL(a.source_url).hostname}</span>
                    </a>
                  )}
                  {a.scholarship_slug && (
                    <Link href={`/${lang}/scholarships/${a.scholarship_slug}`} className="rounded-xl bg-cloud p-4 text-sm hover:ring-1 hover:ring-ocean/40">
                      <span className="block text-xs text-slate">{t.news.related}</span>
                      <span className="mt-1 block font-semibold text-midnight">{a.scholarship_title}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
