"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { countryName } from "@/lib/countries";
import { getPlatformDict, formatDate } from "@/lib/platform-i18n";
import { daysLeft } from "@/lib/scholarships";
import type { Locale } from "@/lib/i18n";
import type { PublicScholarship } from "@/lib/server/public";
import { DeadlineBadge, useLiveStatus } from "./DeadlineBadge";
import { Flag } from "./Flag";
import { toggleSaved, useSaved } from "./saved";

export type CardData = Pick<
  PublicScholarship,
  | "slug"
  | "title"
  | "institution"
  | "logo_url"
  | "country_code"
  | "city"
  | "levels"
  | "funding_type"
  | "summary"
  | "opens_at"
  | "deadline_at"
  | "deadline_tz"
  | "deadline_status"
  | "application_url"
  | "source_url"
  | "featured"
>;

const FUNDING_STYLE = {
  full: "bg-gold/15 text-amber-800 ring-gold/40",
  partial: "bg-sky-500/10 text-sky-800 ring-sky-500/25",
  stipend: "bg-teal/10 text-teal-800 ring-teal/25",
  unpaid: "bg-zinc-500/10 text-zinc-700 ring-zinc-500/20",
  unknown: "bg-zinc-500/10 text-zinc-600 ring-zinc-500/20",
} as const;

export function SaveButton({ slug, lang, className = "" }: { slug: string; lang: Locale; className?: string }) {
  const saved = useSaved().includes(slug);
  const t = getPlatformDict(lang).card;
  return (
    <button
      type="button"
      onClick={() => toggleSaved(slug)}
      aria-pressed={saved}
      aria-label={saved ? t.unsave : t.save}
      title={saved ? t.unsave : t.save}
      className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 transition-colors ${
        saved ? "bg-gold text-midnight ring-gold" : "bg-white/80 text-midnight ring-line hover:ring-midnight/40"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M6 3.75h12a.75.75 0 0 1 .75.75v16.2a.4.4 0 0 1-.63.33L12 16.9l-6.12 4.13a.4.4 0 0 1-.63-.33V4.5A.75.75 0 0 1 6 3.75Z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Opportunity card: logo or flag, status, level, funding, short description and two actions. */
export function ScholarshipCard({ s, lang }: { s: CardData; lang: Locale }) {
  const t = getPlatformDict(lang);
  const status = useLiveStatus(s.opens_at, s.deadline_at, s.deadline_status);
  const left = status === "closing" || status === "today" ? daysLeft(s.deadline_at) : null;
  const href = `/${lang}/scholarships/${s.slug}`;
  const applyHref = s.application_url ?? s.source_url;

  return (
    <article
      className={`group relative flex h-full flex-col rounded-brand-lg bg-white p-5 ring-1 ring-line transition-all duration-300 [transform:perspective(900px)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,45,91,0.45)] hover:ring-ocean/30 hover:[transform:perspective(900px)_rotateX(2deg)] motion-reduce:transform-none ${
        status === "closed" ? "opacity-75" : ""
      }`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className="keep-light flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cloud text-2xl ring-1 ring-line">
          {s.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- institution logos come from many hosts
            <img src={s.logo_url} alt="" loading="lazy" className="h-full w-full object-contain p-1.5" />
          ) : (
            <Flag code={s.country_code} className="h-6 w-8" />
          )}
        </span>
        <div className="flex items-center gap-2">
          <DeadlineBadge lang={lang} opens_at={s.opens_at} deadline_at={s.deadline_at} initial={s.deadline_status} />
          <SaveButton slug={s.slug} lang={lang} />
        </div>
      </div>

      <h3 dir="auto" className="mt-4 text-[1.05rem] font-semibold leading-snug text-midnight">
        <Link href={href} className="after:absolute after:inset-0 after:rounded-brand-lg focus-visible:outline-none">
          {s.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-slate">
        {s.institution} · {countryName(s.country_code, lang)}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${FUNDING_STYLE[s.funding_type]}`}>{t.funding[s.funding_type]}</span>
        {s.levels.slice(0, 3).map((l) => (
          <span key={l} className="rounded-full bg-cloud px-2.5 py-0.5 text-xs font-medium text-midnight ring-1 ring-inset ring-line">
            {t.level[l]}
          </span>
        ))}
      </div>

      {s.summary && <p dir="auto" className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">{s.summary}</p>}

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 text-xs text-slate">
          <Icon name="pulse" className="h-3.5 w-3.5 text-ocean" />
          {s.deadline_at ? (
            <>
              {t.card.deadline}{lang === "fr" ? " :" : ":"} <strong className="font-semibold text-midnight">{formatDate(s.deadline_at, lang, false, s.deadline_tz ?? undefined)}</strong>
              {left !== null && <span className="font-semibold text-orange-700">· {t.card.daysLeft(left)}</span>}
            </>
          ) : (
            t.card.noDeadline
          )}
        </p>
        <div className="relative z-10 mt-4 flex gap-2">
          <Link href={href} className="flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-midnight ring-1 ring-midnight/20 transition-colors hover:bg-midnight hover:text-white">
            {t.card.details}
          </Link>
          {applyHref && status !== "closed" && (
            <a
              href={applyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-midnight transition-colors hover:bg-amber"
            >
              {t.card.apply}
              <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
