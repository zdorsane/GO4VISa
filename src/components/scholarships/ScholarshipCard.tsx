"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { countryName } from "@/lib/countries";
import { getPlatformDict, formatDate } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";
import type { PublicScholarship } from "@/lib/server/public";
import { DeadlineBadge, useDaysLeft, useLiveStatus } from "./DeadlineBadge";
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
  | "algeria_eligible"
  | "verification"
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
  full: "bg-gold text-midnight",
  partial: "bg-sky-100 text-sky-900",
  stipend: "bg-teal/15 text-teal-900",
  unpaid: "bg-zinc-100 text-zinc-700",
  unknown: "bg-zinc-100 text-zinc-600",
} as const;

/** Days shown on the countdown bar: a deadline further away than this reads as a nearly empty bar. */
const COUNTDOWN_WINDOW = 90;

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
      className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-300 active:scale-90 ${
        saved ? "bg-gold text-midnight shadow-[0_6px_18px_-6px_rgba(245,179,1,0.8)]" : "bg-white/85 text-midnight ring-1 ring-white/60 hover:bg-white"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M6 3.75h12a.75.75 0 0 1 .75.75v16.2a.4.4 0 0 1-.63.33L12 16.9l-6.12 4.13a.4.4 0 0 1-.63-.33V4.5A.75.75 0 0 1 6 3.75Z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Warnings that must stay visible: not open to Algerians, details not yet confirmed. */
export function Caveats({ s, lang, className = "" }: { s: Pick<CardData, "algeria_eligible" | "verification">; lang: Locale; className?: string }) {
  const t = getPlatformDict(lang).card;
  if (s.algeria_eligible !== "no" && s.verification === "verified") return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {s.algeria_eligible === "no" && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
          <Icon name="close" className="h-3.5 w-3.5" />
          {t.notAlgeria}
        </span>
      )}
      {s.verification !== "verified" && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
          <Icon name="pulse" className="h-3.5 w-3.5" />
          {t.unverified}
        </span>
      )}
    </div>
  );
}

/** Flag backdrop under a brand gradient, with a dotted flight path: the "destination" half of the ticket. */
function TicketBand({ s, lang, tall = false }: { s: CardData; lang: Locale; tall?: boolean }) {
  const place = [s.city, countryName(s.country_code, lang)].filter(Boolean).join(", ");
  return (
    <div className={`relative isolate overflow-hidden bg-midnight ${tall ? "h-40 md:h-full md:min-h-64" : "h-32"}`}>
      <span aria-hidden className="absolute inset-0 -z-10 scale-110 opacity-55 blur-[1px] transition-transform duration-700 group-hover:scale-125">
        <Flag code={s.country_code} className="!h-full !w-full !rounded-none !shadow-none !ring-0" />
      </span>
      <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-br from-midnight/95 via-midnight/70 to-navy/40" />
      <svg aria-hidden viewBox="0 0 200 60" className="absolute inset-x-6 top-1/2 h-12 w-[calc(100%-3rem)] -translate-y-1/2 opacity-40" preserveAspectRatio="none">
        <path d="M2 50 Q100 -10 198 40" fill="none" stroke="#f5b301" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" />
      </svg>
      {/* the small card's medallion overlaps the band's bottom-start corner */}
      <p className={`absolute bottom-3 flex items-center gap-2 text-sm font-semibold text-white ${tall ? "start-4 end-4" : "start-[5.5rem] end-4"}`}>
        <Flag code={s.country_code} className="h-3.5 w-5" />
        <span className="truncate">{place}</span>
      </p>
    </div>
  );
}

function Medallion({ s, className = "" }: { s: CardData; className?: string }) {
  return (
    <span className={`keep-light flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_10px_25px_-10px_rgba(11,45,91,0.55)] ring-4 ring-white ${className}`}>
      {s.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- institution logos come from many hosts
        <img src={s.logo_url} alt="" loading="lazy" className="h-full w-full object-contain p-1.5" />
      ) : (
        <Icon name="cap" className="h-1/2 w-1/2 text-midnight" />
      )}
    </span>
  );
}

/** Deadline date, days left and a bar that fills up as the deadline approaches. */
function Countdown({ s, lang, status }: { s: CardData; lang: Locale; status: ReturnType<typeof useLiveStatus> }) {
  const t = getPlatformDict(lang).card;
  const days = useDaysLeft(s.deadline_at);
  const left = status === "closed" ? null : days;
  const urgent = status === "closing" || status === "today";
  const fill = left === null ? 0 : Math.max(6, Math.min(100, 100 - (left / COUNTDOWN_WINDOW) * 100));
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate">{t.deadline}</p>
          <p className="mt-0.5 truncate text-sm font-bold text-midnight">
            {s.deadline_at
              ? formatDate(s.deadline_at, lang, false, s.deadline_tz ?? undefined)
              : s.verification !== "verified"
                ? t.dateTbc
                : t.noDeadline}
          </p>
        </div>
        {left !== null && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${urgent ? "bg-orange-100 text-orange-800" : "bg-cloud text-midnight"}`}>
            {t.daysLeft(left)}
          </span>
        )}
      </div>
      {left !== null && (
        <span aria-hidden className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-cloud">
          <span
            className={`block h-full rounded-full ${urgent ? "bg-linear-to-r from-orange-400 to-red-500" : "bg-linear-to-r from-sky to-ocean"}`}
            style={{ width: `${fill}%` }}
          />
        </span>
      )}
    </div>
  );
}

function Actions({ s, lang, href, status }: { s: CardData; lang: Locale; href: string; status: ReturnType<typeof useLiveStatus> }) {
  const t = getPlatformDict(lang).card;
  const applyHref = s.application_url ?? s.source_url;
  return (
    <div className="relative z-10 flex gap-2">
      <Link
        href={href}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-midnight ring-1 ring-midnight/15 transition-all hover:bg-midnight hover:text-white"
      >
        {t.details}
      </Link>
      {applyHref && status !== "closed" && (
        <a
          href={applyHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-midnight shadow-[0_10px_24px_-12px_rgba(245,179,1,0.9)] transition-all hover:bg-amber hover:shadow-[0_14px_30px_-12px_rgba(245,179,1,1)]"
        >
          {s.application_url ? t.apply : t.official}
          <Icon name="external" className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

/** Perforated tear line between the two halves of the ticket. */
function Perforation() {
  return (
    <div aria-hidden className="relative my-4 h-0 border-t-2 border-dashed border-line">
      <span className="absolute -start-7 -top-3 h-6 w-6 rounded-full bg-cloud" />
      <span className="absolute -end-7 -top-3 h-6 w-6 rounded-full bg-cloud" />
    </div>
  );
}

const shell =
  "group relative flex h-full overflow-hidden rounded-brand-lg bg-white ring-1 ring-line shadow-[0_18px_40px_-30px_rgba(11,45,91,0.45)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(11,45,91,0.55),0_0_0_1px_rgba(245,179,1,0.55)] motion-reduce:transform-none";

/** Opportunity card styled as a boarding pass: destination band, details, then the deadline stub. */
export function ScholarshipCard({ s, lang }: { s: CardData; lang: Locale }) {
  const t = getPlatformDict(lang);
  const status = useLiveStatus(s.opens_at, s.deadline_at, s.deadline_status);
  const href = `/${lang}/scholarships/${s.slug}`;

  return (
    <article className={`${shell} flex-col ${status === "closed" ? "opacity-75 grayscale-[35%]" : ""}`}>
      <TicketBand s={s} lang={lang} />
      <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-2">
        <DeadlineBadge lang={lang} opens_at={s.opens_at} deadline_at={s.deadline_at} initial={s.deadline_status} unconfirmed={s.verification !== "verified"} className="!bg-white/95 shadow-sm" />
        <SaveButton slug={s.slug} lang={lang} />
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5">
        <div className="-mt-7 flex items-end justify-between gap-3">
          <Medallion s={s} className="h-14 w-14" />
          <span className={`mb-1 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide ${FUNDING_STYLE[s.funding_type]}`}>
            {t.funding[s.funding_type]}
          </span>
        </div>

        <h3 dir="auto" className="mt-3 text-lg font-bold leading-snug text-midnight transition-colors group-hover:text-ocean">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {s.title}
          </Link>
        </h3>
        <p dir="auto" className="mt-1 line-clamp-1 text-sm text-slate">
          {s.institution}
        </p>

        <Caveats s={s} lang={lang} className="mt-3" />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {s.levels.slice(0, 3).map((l) => (
            <span key={l} className="inline-flex items-center gap-1 rounded-full bg-cloud px-2.5 py-1 text-xs font-medium text-midnight">
              <Icon name="cap" className="h-3.5 w-3.5 text-ocean" />
              {t.level[l]}
            </span>
          ))}
        </div>

        {s.summary && (
          <p dir="auto" className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">
            {s.summary}
          </p>
        )}

        <div className="mt-auto">
          <Perforation />
          <Countdown s={s} lang={lang} status={status} />
          <div className="mt-4">
            <Actions s={s} lang={lang} href={href} status={status} />
          </div>
        </div>
      </div>
    </article>
  );
}

/** Large horizontal ticket for the featured row. */
export function SpotlightCard({ s, lang }: { s: CardData; lang: Locale }) {
  const t = getPlatformDict(lang);
  const status = useLiveStatus(s.opens_at, s.deadline_at, s.deadline_status);
  const href = `/${lang}/scholarships/${s.slug}`;

  return (
    <article className={`${shell} flex-col md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`}>
      <div className="relative">
        <TicketBand s={s} lang={lang} tall />
        <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-2">
          <DeadlineBadge lang={lang} opens_at={s.opens_at} deadline_at={s.deadline_at} initial={s.deadline_status} unconfirmed={s.verification !== "verified"} className="!bg-white/95 shadow-sm" />
          <SaveButton slug={s.slug} lang={lang} />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Medallion s={s} className="me-1 h-12 w-12" />
          <span className={`rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide ${FUNDING_STYLE[s.funding_type]}`}>
            {t.funding[s.funding_type]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-midnight px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-gold">
            <Icon name="star" className="h-3.5 w-3.5" />
            {t.directory.spotlight}
          </span>
        </div>
        <h3 dir="auto" className="mt-4 text-xl font-bold leading-snug text-midnight transition-colors group-hover:text-ocean md:text-2xl">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {s.title}
          </Link>
        </h3>
        <p dir="auto" className="mt-1 text-sm text-slate">
          {s.institution}
        </p>
        <Caveats s={s} lang={lang} className="mt-3" />
        {s.summary && (
          <p dir="auto" className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-slate">
            {s.summary}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {s.levels.slice(0, 3).map((l) => (
            <span key={l} className="inline-flex items-center gap-1 rounded-full bg-cloud px-2.5 py-1 text-xs font-medium text-midnight">
              <Icon name="cap" className="h-3.5 w-3.5 text-ocean" />
              {t.level[l]}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-5">
          <Countdown s={s} lang={lang} status={status} />
          <div className="mt-4">
            <Actions s={s} lang={lang} href={href} status={status} />
          </div>
        </div>
      </div>
    </article>
  );
}
