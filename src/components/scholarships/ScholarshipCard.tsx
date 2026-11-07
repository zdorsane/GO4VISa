"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { countryName } from "@/lib/countries";
import { useReducedMotion } from "@/lib/motion";
import { getPlatformDict, formatDate } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";
import type { PublicScholarship } from "@/lib/server/public";
import { Cover } from "./Cover";
import { DeadlineBadge, useDaysLeft, useLiveStatus } from "./DeadlineBadge";
import { Flag } from "./Flag";
import { toggleSaved, useSaved } from "./saved";

export type CardData = Pick<
  PublicScholarship,
  | "slug"
  | "title"
  | "institution"
  | "logo_url"
  | "cover_url"
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
  | "deadline_label"
  | "deadline_status"
  | "application_url"
  | "source_url"
  | "featured"
>;

/** Days shown on the countdown bar: a deadline further away than this reads as a nearly empty bar. */
const COUNTDOWN_WINDOW = 90;

export function SaveButton({ slug, lang, className = "" }: { slug: string; lang: Locale; className?: string }) {
  const saved = useSaved().includes(slug);
  const t = getPlatformDict(lang).card;
  return (
    <motion.button
      type="button"
      onClick={() => toggleSaved(slug)}
      whileTap={{ scale: 0.8 }}
      aria-pressed={saved}
      aria-label={saved ? t.unsave : t.save}
      title={saved ? t.unsave : t.save}
      className={`relative z-20 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors duration-300 ${
        saved ? "bg-gold text-midnight shadow-[0_6px_18px_-6px_rgba(245,179,1,0.9)]" : "bg-white/80 text-midnight hover:bg-white"
      } ${className}`}
    >
      <motion.svg
        key={String(saved)}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M6 3.75h12a.75.75 0 0 1 .75.75v16.2a.4.4 0 0 1-.63.33L12 16.9l-6.12 4.13a.4.4 0 0 1-.63-.33V4.5A.75.75 0 0 1 6 3.75Z" strokeLinejoin="round" />
      </motion.svg>
    </motion.button>
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

/**
 * Card shell that tilts toward the pointer and lights up where it points.
 * Mouse only; touch screens and reduced-motion visitors get a still card.
 */
function TiltCard({ children, className, strength = 7 }: { children: ReactNode; className: string; strength?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [strength, -strength]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-strength, strength]), spring);
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, rgba(245,179,1,0.16), transparent 60%)`;

  const move = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      onPointerMove={move}
      onPointerLeave={leave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={className}
    >
      {!reduce && <motion.span aria-hidden style={{ background: glow }} className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
      {children}
    </motion.article>
  );
}

/** Light sweep that crosses the photo on hover. */
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -start-full z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[400%] rtl:group-hover:-translate-x-[400%] motion-reduce:hidden"
    />
  );
}

/** Deadline date, days left and a bar that fills up as the deadline approaches. */
function Countdown({ s, lang, status, light = false }: { s: CardData; lang: Locale; status: ReturnType<typeof useLiveStatus>; light?: boolean }) {
  const t = getPlatformDict(lang).card;
  const days = useDaysLeft(s.deadline_at);
  const left = status === "closed" ? null : days;
  const urgent = status === "closing" || status === "today";
  const fill = left === null ? 0 : Math.max(6, Math.min(100, 100 - (left / COUNTDOWN_WINDOW) * 100));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5">
        <div className="min-w-[7.5rem] flex-1">
          <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-slate"}`}>{t.deadline}</p>
          <p title={s.deadline_label ?? undefined} className={`mt-0.5 truncate text-sm font-bold ${light ? "text-white" : "text-midnight"}`}>
            {s.deadline_label
              ? s.deadline_label
              : s.deadline_at
              ? formatDate(s.deadline_at, lang, false, s.deadline_tz ?? undefined)
              : s.verification !== "verified"
                ? t.dateTbc
                : t.noDeadline}
          </p>
        </div>
        {left !== null && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
              urgent ? "bg-orange-500 text-white" : light ? "bg-white/15 text-white backdrop-blur" : "bg-cloud text-midnight"
            }`}
          >
            {t.daysLeft(left)}
          </span>
        )}
      </div>
      {left !== null && (
        <span aria-hidden className={`mt-2.5 block h-1.5 overflow-hidden rounded-full ${light ? "bg-white/20" : "bg-cloud"}`}>
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: `${fill}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={`block h-full rounded-full ${urgent ? "bg-linear-to-r from-orange-400 to-red-500" : "bg-linear-to-r from-sky to-gold"}`}
          />
        </span>
      )}
    </div>
  );
}

function Actions({ s, lang, href, status, light = false }: { s: CardData; lang: Locale; href: string; status: ReturnType<typeof useLiveStatus>; light?: boolean }) {
  const t = getPlatformDict(lang).card;
  const applyHref = s.application_url ?? s.source_url;
  return (
    <div className="relative z-20 flex flex-wrap gap-2">
      <Link
        href={href}
        className={`group/btn flex min-w-[7.5rem] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-center text-[0.8rem] font-semibold sm:px-4 sm:text-sm transition-all ${
          light ? "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white hover:text-midnight" : "text-midnight ring-1 ring-midnight/15 hover:bg-midnight hover:text-white"
        }`}
      >
        {t.details}
        <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5" />
      </Link>
      {applyHref && status !== "closed" && (
        <a
          href={applyHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-[7.5rem] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-midnight shadow-[0_10px_24px_-12px_rgba(245,179,1,0.9)] transition-all hover:-translate-y-0.5 hover:bg-amber hover:shadow-[0_16px_30px_-12px_rgba(245,179,1,1)]"
        >
          {s.application_url ? t.apply : t.official}
          <Icon name="external" className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function Place({ s, lang }: { s: CardData; lang: Locale }) {
  const place = [s.city, countryName(s.country_code, lang)].filter(Boolean).join(", ");
  return (
    <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-black/30 py-1 pe-3 ps-1.5 text-xs font-semibold text-white backdrop-blur-md">
      <Flag code={s.country_code} className="h-3.5 w-5" />
      <span className="truncate">{place}</span>
    </span>
  );
}

const shell =
  "group relative isolate flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-white ring-1 ring-line shadow-[0_18px_40px_-30px_rgba(11,45,91,0.45)] transition-shadow duration-500 hover:shadow-[0_40px_70px_-35px_rgba(11,45,91,0.6),0_0_0_1px_rgba(245,179,1,0.5)]";

/** Photo-first opportunity card: cover, status and place on the photo, then details and the countdown. */
export function ScholarshipCard({ s, lang }: { s: CardData; lang: Locale }) {
  const t = getPlatformDict(lang);
  const status = useLiveStatus(s.opens_at, s.deadline_at, s.deadline_status, s.deadline_label);
  const href = `/${lang}/scholarships/${s.slug}`;

  return (
    <TiltCard className={`${shell} ${status === "closed" ? "opacity-75 grayscale-[40%]" : ""}`}>
      <div className="relative h-52 overflow-hidden">
        <Cover
          src={s.cover_url}
          country={s.country_code}
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-[1600ms] ease-out group-hover:scale-110"
        />
        <span aria-hidden className="absolute inset-0 bg-linear-to-t from-midnight/85 via-midnight/10 to-midnight/30" />
        <Shine />
        <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-2">
          <DeadlineBadge lang={lang} opens_at={s.opens_at} deadline_at={s.deadline_at} deadline_label={s.deadline_label} initial={s.deadline_status} unconfirmed={s.verification !== "verified"} className="!bg-white/95 shadow-sm" />
          <SaveButton slug={s.slug} lang={lang} />
        </div>
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-end justify-between gap-2">
          <Place s={s} lang={lang} />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <h3 dir="auto" className="text-lg font-bold leading-snug text-midnight transition-colors duration-300 group-hover:text-ocean">
          <Link href={href} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
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
          <p dir="auto" className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate">
            {s.summary}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="border-t border-dashed border-line pt-4">
            <Countdown s={s} lang={lang} status={status} />
          </div>
          <div className="mt-4">
            <Actions s={s} lang={lang} href={href} status={status} />
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

/** Magazine-style featured card: full-bleed photo with the text laid over it. */
export function SpotlightCard({ s, lang, priority = false }: { s: CardData; lang: Locale; priority?: boolean }) {
  const t = getPlatformDict(lang);
  const status = useLiveStatus(s.opens_at, s.deadline_at, s.deadline_status, s.deadline_label);
  const href = `/${lang}/scholarships/${s.slug}`;

  return (
    <TiltCard strength={4} className={`${shell} min-h-[30rem] bg-midnight !ring-0 md:min-h-[32rem]`}>
      <Cover
        src={s.cover_url}
        country={s.country_code}
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority={priority}
        className="transition-transform duration-[2200ms] ease-out group-hover:scale-110"
      />
      <span aria-hidden className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/55 to-midnight/5" />
      <Shine />

      <div className="relative z-20 flex items-start justify-between gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <DeadlineBadge lang={lang} opens_at={s.opens_at} deadline_at={s.deadline_at} deadline_label={s.deadline_label} initial={s.deadline_status} unconfirmed={s.verification !== "verified"} className="!bg-white/95 shadow-sm" />
          <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-midnight shadow-lg">
            <Icon name="star" className="h-3.5 w-3.5" />
            {t.directory.spotlight}
          </span>
        </div>
        <SaveButton slug={s.slug} lang={lang} />
      </div>

      <div className="relative z-20 mt-auto p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Place s={s} lang={lang} />
        </div>
        <h3 dir="auto" className="mt-3 text-2xl font-bold leading-tight text-white md:text-3xl">
          <Link href={href} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {s.title}
          </Link>
        </h3>
        <p dir="auto" className="mt-1.5 text-sm text-white/75">
          {s.institution}
        </p>
        {s.summary && (
          <p dir="auto" className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/85">
            {s.summary}
          </p>
        )}
        <div className="mt-5 max-w-md space-y-4">
          <Countdown s={s} lang={lang} status={status} light />
          <Actions s={s} lang={lang} href={href} status={status} light />
        </div>
      </div>
    </TiltCard>
  );
}
