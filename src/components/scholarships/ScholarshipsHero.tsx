import { GlobeHorizon } from "@/components/brand/GlobeHorizon";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/Stats";
import { countryName } from "@/lib/countries";
import { formatDate, getPlatformDict } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";
import type { PublicScholarship } from "@/lib/server/public";
import { Flag } from "./Flag";

/** Directory opening band: title, live key figures and the destination flags, all derived from the data. */
export function ScholarshipsHero({ lang, items }: { lang: Locale; items: PublicScholarship[] }) {
  const t = getPlatformDict(lang).directory;
  const live = items.filter((s) => s.deadline_status !== "closed");
  const next = live
    .filter((s) => s.deadline_at && s.deadline_status !== "upcoming")
    .sort((a, b) => Date.parse(a.deadline_at!) - Date.parse(b.deadline_at!))[0];
  const countries = [...new Set(live.map((s) => s.country_code))];

  const stats: { value: number | string; label: string }[] = [
    { value: live.length, label: t.statOpps },
    { value: next ? formatDate(next.deadline_at, lang, false, next.deadline_tz ?? undefined)! : "—", label: t.statNext },
  ];

  return (
    <section className="pattern-flight relative isolate overflow-hidden pb-28 pt-[calc(var(--g4v-header-h)+2.5rem)] md:pb-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-navy/80 via-midnight/40 to-midnight/90" />
      <div aria-hidden className="absolute -start-24 top-10 -z-10 h-72 w-72 rounded-full bg-ocean/25 blur-3xl" />
      <div aria-hidden className="absolute -end-20 bottom-10 -z-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-16 w-full md:h-24" />

      <Reveal className="container-brand max-w-4xl text-center">
        <p className="label-caps text-gold">{t.eyebrow}</p>
        <h1 id="scholarships-title" className="mt-3 text-3xl font-bold leading-tight text-white md:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-mist md:text-base">{t.lead}</p>

        {countries.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label={t.country}>
            {countries.map((c, i) => (
              <li key={c} style={{ animationDelay: `${0.25 + i * 0.07}s` }} className="g4v-rise inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pe-3 ps-1.5 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur">
                <Flag code={c} className="h-4 w-6" />
                {countryName(c, lang)}
              </li>
            ))}
          </ul>
        )}

        <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div key={s.label} style={{ animationDelay: `${0.5 + i * 0.1}s` }} className="g4v-rise rounded-2xl bg-white/[0.07] px-4 py-4 ring-1 ring-white/15 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] hover:ring-gold/40">
              <dt className="sr-only">{s.label}</dt>
              <dd className={`font-bold text-gold ${typeof s.value === "string" ? "text-lg leading-7 md:text-xl" : "text-3xl md:text-4xl"}`}>
                {typeof s.value === "number" ? <Counter value={s.value} /> : s.value}
              </dd>
              <dd aria-hidden className="mt-1 text-[0.7rem] font-medium uppercase tracking-wider text-mist">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
