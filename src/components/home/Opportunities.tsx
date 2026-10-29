import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";
import { NewsCard } from "@/components/news/NewsCard";
import { countryName } from "@/lib/countries";
import { Flag } from "@/components/scholarships/Flag";
import { getPlatformDict } from "@/lib/platform-i18n";
import { LEVELS } from "@/lib/scholarships";
import type { Locale } from "@/lib/i18n";
import type { NewsArticle } from "@/lib/news";
import { toListItem, type PublicScholarship } from "@/lib/server/public";

function Row({ title, href, cta, items, lang }: { title: string; href: string; cta: string; items: PublicScholarship[]; lang: Locale }) {
  if (!items.length) return null;
  return (
    <div className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-xl font-semibold text-midnight md:text-2xl">{title}</h3>
        <Link href={href} className="shrink-0 text-sm font-semibold text-ocean hover:underline">
          {cta} →
        </Link>
      </div>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <li key={s.slug}>
            <ScholarshipCard s={toListItem(s)} lang={lang} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Home page discovery block, from the database: search, browse by level and country,
 * featured, closing soon, fully funded and latest opportunities. Empty rows are skipped.
 */
export function Opportunities({ items, lang }: { items: PublicScholarship[]; lang: Locale }) {
  const t = getPlatformDict(lang);
  const base = `/${lang}/scholarships`;
  const open = items.filter((s) => s.deadline_status !== "closed");
  const byDeadline = (a: PublicScholarship, b: PublicScholarship) =>
    (a.deadline_at ? Date.parse(a.deadline_at) : Infinity) - (b.deadline_at ? Date.parse(b.deadline_at) : Infinity);

  const featured = open.filter((s) => s.featured).sort(byDeadline).slice(0, 3);
  const shown = new Set(featured.map((s) => s.slug));
  const closing = open.filter((s) => (s.deadline_status === "closing" || s.deadline_status === "today") && !shown.has(s.slug)).sort(byDeadline).slice(0, 3);
  closing.forEach((s) => shown.add(s.slug));
  const funded = open.filter((s) => s.funding_type === "full" && !shown.has(s.slug)).sort(byDeadline).slice(0, 3);
  funded.forEach((s) => shown.add(s.slug));
  const latest = open
    .filter((s) => !shown.has(s.slug))
    .sort((a, b) => Date.parse(b.published_at ?? b.created_at) - Date.parse(a.published_at ?? a.created_at))
    .slice(0, 3);

  const count = <T extends string>(keys: T[]) =>
    keys.map((k) => [k, open.filter((s) => (s.levels as string[]).includes(k) || s.country_code === k).length] as const).filter(([, n]) => n > 0);
  const levels = count([...LEVELS]);
  const countries = count([...new Set(open.map((s) => s.country_code))]).sort((a, b) => b[1] - a[1]);

  return (
    <section id="opportunities" aria-labelledby="opportunities-title" className="scroll-mt-20 bg-cloud py-16 md:py-24">
      <div className="container-brand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-caps text-ocean">{t.directory.eyebrow}</p>
          <h2 id="opportunities-title" className="mt-3 text-h2 font-semibold text-midnight md:text-[2.25rem]">
            {t.home.searchTitle}
          </h2>
          <form action={base} role="search" className="mt-7 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_24px_60px_-35px_rgba(11,45,91,0.55)] ring-1 ring-line sm:flex-row sm:rounded-full">
            <label htmlFor="home-search" className="sr-only">
              {t.directory.searchLabel}
            </label>
            <div className="relative flex-1">
              <Icon name="search" className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate" />
              <input id="home-search" name="q" type="search" placeholder={t.directory.search} className="w-full rounded-full bg-transparent py-3 pe-4 ps-12 text-base text-ink focus:outline-none" />
            </div>
            <button className="rounded-full bg-midnight px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy">{t.home.searchCta}</button>
          </form>
        </div>

        {open.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <nav aria-label={t.home.byLevel}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate">{t.home.byLevel}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {levels.map(([l, n]) => (
                    <li key={l}>
                      <Link href={`${base}?level=${l}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-midnight ring-1 ring-line transition-all hover:-translate-y-0.5 hover:ring-ocean/40">
                        <Icon name="cap" className="h-4 w-4 text-ocean" />
                        {t.level[l as (typeof LEVELS)[number]]}
                        <span className="rounded-full bg-cloud px-1.5 text-xs text-slate">{n}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label={t.home.byCountry}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate">{t.home.byCountry}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {countries.slice(0, 10).map(([c, n]) => (
                    <li key={c}>
                      <Link href={`${base}?country=${c}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-midnight ring-1 ring-line transition-all hover:-translate-y-0.5 hover:ring-ocean/40">
                        <Flag code={c} />
                        {countryName(c, lang)}
                        <span className="rounded-full bg-cloud px-1.5 text-xs text-slate">{n}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <Row title={t.home.featured} href={base} cta={t.home.seeAll} items={featured} lang={lang} />
            <Row title={t.home.closing} href={`${base}?status=closing`} cta={t.home.seeAll} items={closing} lang={lang} />
            <Row title={t.home.funded} href={`${base}?funding=full`} cta={t.home.seeAll} items={funded} lang={lang} />
            <Row title={t.home.latest} href={`${base}?sort=latest`} cta={t.home.seeAll} items={latest} lang={lang} />
          </>
        ) : (
          <div className="mx-auto mt-10 max-w-xl rounded-brand-lg bg-white px-6 py-12 text-center ring-1 ring-line">
            <Icon name="cap" className="mx-auto h-8 w-8 text-ocean" />
            <p className="mt-3 font-semibold text-midnight">{t.directory.noneYet}</p>
            <p className="mt-1 text-sm text-slate">{t.directory.noneYetHint}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Latest published news on the home page (hidden until the first article is published). */
export function LatestNews({ items, lang }: { items: NewsArticle[]; lang: Locale }) {
  const t = getPlatformDict(lang);
  if (!items.length) return null;
  return (
    <section aria-labelledby="latest-news-title" className="py-16 md:py-20">
      <div className="container-brand">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label-caps text-ocean">{t.news.eyebrow}</p>
            <h2 id="latest-news-title" className="mt-2 text-h2 font-semibold text-midnight">
              {t.home.news}
            </h2>
          </div>
          <Link href={`/${lang}/news`} className="shrink-0 text-sm font-semibold text-ocean hover:underline">
            {t.home.allNews} →
          </Link>
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((a) => (
            <li key={a.id}>
              <NewsCard a={a} lang={lang} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
