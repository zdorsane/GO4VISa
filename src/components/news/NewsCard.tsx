import Link from "next/link";
import { excerpt, type NewsArticle } from "@/lib/news";
import { formatDate, getPlatformDict } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";

const LABEL_STYLE: Record<string, string> = {
  new: "bg-ocean text-white",
  important: "bg-red-600 text-white",
  "applications-open": "bg-emerald-600 text-white",
  "deadline-alert": "bg-orange-500 text-white",
  announcement: "bg-midnight text-white",
  "results-released": "bg-violet-600 text-white",
};

/** Labels as resolved by the cached read (src/lib/server/public.ts). */
export function NewsLabels({ a, lang }: { a: NewsArticle; lang: Locale }) {
  const t = getPlatformDict(lang);
  return (
    <div className="flex flex-wrap gap-1.5">
      {a.labels.map((l) => (
        <span key={l} className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${LABEL_STYLE[l]}`}>
          {t.newsLabel[l]}
        </span>
      ))}
    </div>
  );
}

export function NewsCard({ a, lang }: { a: NewsArticle; lang: Locale }) {
  const t = getPlatformDict(lang);
  const href = `/${lang}/news/${a.slug}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-brand-lg bg-white ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,45,91,0.45)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-midnight">
        {a.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- covers are stored in Vercel Blob or other hosts
          <img src={a.cover_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="pattern-flight h-full w-full" />
        )}
        <div className="absolute start-3 top-3">
          <NewsLabels a={a} lang={lang} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-slate">
          {t.newsCategory[a.category]} · {formatDate(a.published_at, lang)}
        </p>
        <h3 className="mt-2 text-[1.05rem] font-semibold leading-snug text-midnight">
          <Link href={href} className="after:absolute after:inset-0">
            {a.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate">{a.summary ?? excerpt(a.body)}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-ocean">{t.news.read} →</span>
      </div>
    </article>
  );
}
