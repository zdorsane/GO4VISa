"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useReducedMotion } from "@/lib/motion";
import { getPlatformDict } from "@/lib/platform-i18n";
import { deadlineStatus, type DeadlineStatus } from "@/lib/scholarships";
import type { Locale } from "@/lib/i18n";
import type { ListItem } from "@/lib/server/public";
import { ScholarshipCard } from "./ScholarshipCard";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Every opportunity in one list, closest deadline first; those without a fixed date come last. */
export function Directory({ items, lang }: { items: ListItem[]; lang: Locale }) {
  const t = getPlatformDict(lang);
  const [showClosed, setShowClosed] = useState(false);
  const reduce = useReducedMotion();

  // live status from the visitor's clock (the cached list may be up to an hour old)
  const now = useMemo(() => new Date(), []);
  const sorted = useMemo(() => {
    const time = (v: string | null) => (v ? new Date(v).getTime() : Infinity);
    return items
      .map((s) => ({ ...s, deadline_status: deadlineStatus(s, now) as DeadlineStatus }))
      .sort((a, b) => time(a.deadline_at) - time(b.deadline_at));
  }, [items, now]);

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

  const active = sorted.filter((s) => s.deadline_status !== "closed");
  const closed = sorted.filter((s) => s.deadline_status === "closed").reverse();

  return (
    <div className="space-y-10">
      <section aria-labelledby="all-title" className="rounded-[1.75rem] bg-white/95 p-4 shadow-[0_30px_70px_-40px_rgba(11,45,91,0.6)] ring-1 ring-line backdrop-blur sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="all-title" className="text-xl font-bold text-midnight md:text-2xl">
            {t.directory.all}
          </h2>
          <p className="rounded-full bg-cloud px-3 py-1 text-sm font-semibold text-midnight">{t.directory.results(active.length)}</p>
        </div>
        <p className="mt-1 text-sm text-slate">{t.directory.sorts.deadline}</p>

        <ul className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {active.map((s, i) => (
            <motion.li
              key={s.slug}
              initial={reduce ? false : { opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.09, ease: EASE }}
            >
              <ScholarshipCard s={s} lang={lang} />
            </motion.li>
          ))}
        </ul>
      </section>

      {closed.length > 0 && (
        <section className="border-t border-line pt-6">
          <button
            type="button"
            onClick={() => setShowClosed((v) => !v)}
            aria-expanded={showClosed}
            className="flex items-center gap-2 text-sm font-semibold text-midnight"
          >
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

/** Placeholder while the list loads. */
export function DirectorySkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[30rem] animate-pulse rounded-brand-lg bg-white ring-1 ring-line" />
        ))}
      </div>
    </div>
  );
}
