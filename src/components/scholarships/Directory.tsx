"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { countryName } from "@/lib/countries";
import { getPlatformDict } from "@/lib/platform-i18n";
import { deadlineStatus, LEVELS, type DeadlineStatus } from "@/lib/scholarships";
import type { Locale } from "@/lib/i18n";
import type { ListItem } from "@/lib/server/public";
import { Flag } from "./Flag";
import { ScholarshipCard } from "./ScholarshipCard";
import { useSaved } from "./saved";

const KEYS = ["q", "country", "level", "field", "funding", "status", "month", "university", "algeria", "sort", "saved"] as const;
type Key = (typeof KEYS)[number];
type Filters = Record<Key, string>;

const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const monthKey = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Algiers", year: "numeric", month: "2-digit" }).format(new Date(iso));

export function Directory({ items, lang }: { items: ListItem[]; lang: Locale }) {
  const t = getPlatformDict(lang);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const saved = useSaved();
  const [showClosed, setShowClosed] = useState(false);
  const [f, setF] = useState<Filters>(() => Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? ""])) as Filters);

  const update = (k: Key, v: string) => {
    const next = { ...f, [k]: v };
    setF(next);
    const qs = new URLSearchParams();
    for (const key of KEYS) if (next[key]) qs.set(key, next[key]);
    router.replace(`${pathname}${qs.size ? `?${qs}` : ""}`, { scroll: false });
  };
  const clear = () => {
    setF(Object.fromEntries(KEYS.map((k) => [k, ""])) as Filters);
    router.replace(pathname, { scroll: false });
  };

  // live status from the visitor's clock (the cached list may be up to an hour old)
  const now = useMemo(() => new Date(), []);
  const live = useMemo(() => items.map((s) => ({ ...s, deadline_status: deadlineStatus(s, now) as DeadlineStatus })), [items, now]);

  const options = useMemo(() => {
    const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))];
    return {
      countries: uniq(live.map((s) => s.country_code)).sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), lang)),
      fields: uniq(live.flatMap((s) => s.fields)).sort((a, b) => a.localeCompare(b)),
      universities: uniq(live.map((s) => s.institution)).sort((a, b) => a.localeCompare(b)),
      months: uniq(live.filter((s) => s.deadline_at).map((s) => monthKey(s.deadline_at!))).sort(),
      levels: LEVELS.filter((l) => live.some((s) => s.levels.includes(l))),
    };
  }, [live, lang]);

  const suggestions = useMemo(
    () => [...new Set(live.flatMap((s) => [s.title, s.institution, countryName(s.country_code, lang)]))].slice(0, 40),
    [live, lang],
  );

  const filtered = useMemo(() => {
    const q = norm(f.q.trim());
    const out = live.filter((s) => {
      if (q) {
        const hay = norm([s.title, s.institution, s.city ?? "", countryName(s.country_code, lang), s.summary ?? "", ...s.fields, ...s.tags].join(" "));
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      if (f.country && s.country_code !== f.country) return false;
      if (f.level && !s.levels.includes(f.level as (typeof LEVELS)[number])) return false;
      if (f.field && !s.fields.includes(f.field)) return false;
      if (f.funding && s.funding_type !== f.funding) return false;
      if (f.status && s.deadline_status !== f.status && !(f.status === "closing" && s.deadline_status === "today")) return false;
      if (f.month && (!s.deadline_at || monthKey(s.deadline_at) !== f.month)) return false;
      if (f.university && s.institution !== f.university) return false;
      if (f.algeria && s.algeria_eligible !== "yes") return false;
      if (f.saved && !saved.includes(s.slug)) return false;
      return true;
    });
    const time = (v: string | null, fallback: number) => (v ? new Date(v).getTime() : fallback);
    const sorters: Record<string, (a: ListItem, b: ListItem) => number> = {
      latest: (a, b) => time(b.published_at, 0) - time(a.published_at, 0),
      updated: (a, b) => time(b.updated_at, 0) - time(a.updated_at, 0),
      funded: (a, b) => Number(b.funding_type === "full") - Number(a.funding_type === "full") || time(a.deadline_at, Infinity) - time(b.deadline_at, Infinity),
      deadline: (a, b) => time(a.deadline_at, Infinity) - time(b.deadline_at, Infinity),
    };
    return out.sort(sorters[f.sort] ?? sorters.deadline);
  }, [live, f, saved, lang]);

  const active = filtered.filter((s) => s.deadline_status !== "closed" || f.status === "closed");
  const closed = f.status === "closed" ? [] : filtered.filter((s) => s.deadline_status === "closed");
  const anyFilter = KEYS.some((k) => k !== "sort" && f[k]);
  const monthLabel = (m: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-DZ" : lang, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${m}-15T00:00:00Z`));

  const select = (k: Key, label: string, opts: [string, string][], emptyLabel = t.directory.any) => (
    <label className="block min-w-0">
      <span className="text-xs font-semibold text-midnight">{label}</span>
      <select
        value={f[k]}
        onChange={(e) => update(k, e.target.value)}
        className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
      >
        <option value="">{emptyLabel}</option>
        {opts.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );

  if (!items.length) {
    return (
      <div className="rounded-brand-lg bg-white px-6 py-16 text-center ring-1 ring-line">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cloud text-ocean">
          <Icon name="cap" className="h-7 w-7" />
        </span>
        <p className="mt-4 text-lg font-semibold text-midnight">{t.directory.noneYet}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate">{t.directory.noneYetHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-brand-lg bg-white p-4 shadow-[0_20px_50px_-35px_rgba(11,45,91,0.5)] ring-1 ring-line sm:p-5">
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate" />
          <input
            type="search"
            value={f.q}
            onChange={(e) => update("q", e.target.value)}
            placeholder={t.directory.search}
            aria-label={t.directory.searchLabel}
            list="scholarship-suggestions"
            className="block w-full rounded-full border border-line bg-cloud py-3.5 pe-4 ps-12 text-base text-ink focus:border-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean/20"
          />
          <datalist id="scholarship-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <details className="group mt-4" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-midnight">
            <span className="flex items-center gap-2">
              <Icon name="list" className="h-4 w-4 text-ocean" />
              {t.directory.filters}
            </span>
            <Icon name="chevron" className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {select("country", t.directory.country, options.countries.map((c) => [c, countryName(c, lang)]))}
            {select("level", t.directory.level, options.levels.map((l) => [l, t.level[l]]))}
            {select("field", t.directory.field, options.fields.map((x) => [x, x]))}
            {select("funding", t.directory.funding, (["full", "partial", "stipend", "unpaid"] as const).map((x) => [x, t.funding[x]]))}
            {select("status", t.directory.status, (["open", "closing", "upcoming", "rolling", "closed"] as const).map((x) => [x, t.status[x]]))}
            {select("month", t.directory.month, options.months.map((m) => [m, monthLabel(m)]))}
            {select("university", t.directory.university, options.universities.map((u) => [u, u]))}
            {select("sort", t.directory.sort, Object.entries(t.directory.sorts).filter(([k]) => k !== "deadline") as [string, string][], t.directory.sorts.deadline)}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <label className="flex items-center gap-2 text-midnight">
              <input type="checkbox" checked={!!f.algeria} onChange={(e) => update("algeria", e.target.checked ? "1" : "")} className="h-4 w-4 accent-midnight" />
              <Flag code="dz" className="h-3.5 w-5" />
              {t.directory.algeria}
            </label>
            <label className="flex items-center gap-2 text-midnight">
              <input type="checkbox" checked={!!f.funding && f.funding === "full"} onChange={(e) => update("funding", e.target.checked ? "full" : "")} className="h-4 w-4 accent-midnight" />
              {t.funding.full}
            </label>
            <label className="flex items-center gap-2 text-midnight">
              <input type="checkbox" checked={!!f.saved} onChange={(e) => update("saved", e.target.checked ? "1" : "")} className="h-4 w-4 accent-midnight" />
              {t.directory.savedOnly} ({saved.filter((s) => items.some((i) => i.slug === s)).length})
            </label>
            {anyFilter && (
              <button type="button" onClick={clear} className="ms-auto font-semibold text-ocean hover:underline">
                {t.directory.clear}
              </button>
            )}
          </div>
        </details>
      </div>

      <p aria-live="polite" className="text-sm font-medium text-slate">
        {t.directory.results(active.length)}
      </p>

      {active.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {active.map((s) => (
            <li key={s.slug}>
              <ScholarshipCard s={s} lang={lang} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-brand-lg bg-white px-6 py-14 text-center ring-1 ring-line">
          <p className="font-semibold text-midnight">{t.directory.empty}</p>
          <p className="mt-1 text-sm text-slate">{t.directory.emptyHint}</p>
          {anyFilter && (
            <button type="button" onClick={clear} className="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold text-midnight ring-1 ring-midnight/20 hover:bg-midnight hover:text-white">
              {t.directory.clear}
            </button>
          )}
        </div>
      )}

      {closed.length > 0 && (
        <section className="border-t border-line pt-6">
          <button type="button" onClick={() => setShowClosed((v) => !v)} aria-expanded={showClosed} className="flex items-center gap-2 text-sm font-semibold text-midnight">
            <Icon name="chevron" className={`h-4 w-4 transition-transform ${showClosed ? "rotate-180" : ""}`} />
            {t.directory.showClosed} ({closed.length})
          </button>
          {showClosed && (
            <>
              <p className="mt-2 text-sm text-slate">{t.directory.closedLead}</p>
              <ul className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {closed.map((s) => (
                  <li key={s.slug}>
                    <ScholarshipCard s={s} lang={lang} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
}

/** Placeholder while the filters read the URL. */
export function DirectorySkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-40 animate-pulse rounded-brand-lg bg-white ring-1 ring-line" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-brand-lg bg-white ring-1 ring-line" />
        ))}
      </div>
    </div>
  );
}
