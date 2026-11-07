import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { countryName } from "@/lib/countries";
import { formatDeadline, getPlatformDict } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";
import { toListItem, type PublicScholarship } from "@/lib/server/public";
import { Cover } from "./Cover";
import { DeadlineBadge } from "./DeadlineBadge";
import { Flag } from "./Flag";
import { Caveats, SaveButton, ScholarshipCard } from "./ScholarshipCard";

function Row({ label, children, empty }: { label: string; children: ReactNode; empty: string }) {
  const missing = children === null || children === undefined || children === "" || (Array.isArray(children) && !children.length);
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm font-medium text-slate">{label}</dt>
      <dd dir="auto" className={`text-sm leading-relaxed ${missing ? "italic text-slate/80" : "text-ink"}`}>{missing ? empty : children}</dd>
    </div>
  );
}

/** Opportunity page: name, target audience, eligibility, deadline and official link (public page and admin preview). */
export function ScholarshipDetail({
  s,
  related = [],
  lang,
  preview = false,
}: {
  s: PublicScholarship;
  related?: PublicScholarship[];
  lang: Locale;
  preview?: boolean;
}) {
  const t = getPlatformDict(lang);
  const f = t.detail.fields;
  const empty = t.detail.notSpecified;
  const applyUrl = s.application_url ?? s.source_url;
  const place = [s.city, countryName(s.country_code, lang)].filter(Boolean).join(", ");
  const deadline = formatDeadline(s.deadline_at, s.deadline_tz, lang);
  const officialUrl = s.source_url ?? s.application_url;

  return (
    <>
      <section className="pattern-flight relative isolate overflow-hidden pb-28 pt-[calc(var(--g4v-header-h)+2.5rem)] md:min-h-[30rem]">
        {s.cover_url && (
          <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
            <Cover src={s.cover_url} country={s.country_code} sizes="100vw" priority className="g4v-kenburns" />
          </div>
        )}
        <div aria-hidden className={`absolute inset-0 -z-10 ${s.cover_url ? "bg-linear-to-b from-midnight/85 via-midnight/55 to-midnight" : "bg-linear-to-b from-navy/80 via-midnight/50 to-midnight/95"}`} />
        {s.cover_credit && (
          <p className="absolute bottom-20 end-4 z-10 max-w-[18rem] text-end text-[0.65rem] text-white/60">
            {s.cover_credit_url ? (
              <a href={s.cover_credit_url} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                {s.cover_credit}
              </a>
            ) : (
              s.cover_credit
            )}
          </p>
        )}
        <div className="container-brand max-w-5xl">
          {!preview && (
            <Link href={`/${lang}/scholarships`} className="inline-flex items-center gap-2 text-sm text-mist hover:text-white">
              <Icon name="arrow" className="h-4 w-4 rotate-180 rtl:rotate-0" />
              {t.detail.back}
            </Link>
          )}
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="keep-light flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-3xl shadow-lg">
                {s.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- institution logos come from many hosts
                  <img src={s.logo_url} alt="" className="h-full w-full object-contain p-2" />
                ) : (
                  <Flag code={s.country_code} className="h-8 w-11" />
                )}
              </span>
              <div className="min-w-0">
                <DeadlineBadge lang={lang} opens_at={s.opens_at} deadline_at={s.deadline_at} deadline_label={s.deadline_label} initial={s.deadline_status} unconfirmed={s.verification !== "verified"} className="!bg-white/95" />
                <h1 dir="auto" className="mt-3 text-2xl font-bold leading-tight text-white md:text-4xl">{s.title}</h1>
                <p dir="auto" className="mt-2 text-sm text-mist md:text-base">
                  {s.institution}
                  {place && ` · ${place}`}
                </p>
                <Caveats s={s} lang={lang} className="mt-3" />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <SaveButton slug={s.slug} lang={lang} className="!h-11 !w-11" />
              {applyUrl && s.deadline_status !== "closed" && (
                <a href={applyUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("gold")}>
                  {s.application_url ? t.card.apply : t.card.official}
                  <Icon name="external" className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 -mt-14 pb-20">
        <div className="container-brand grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="min-w-0 rounded-brand-lg bg-white p-5 ring-1 ring-line sm:p-6">
            <h2 className="text-lg font-semibold text-midnight">{t.detail.essentials}</h2>
            <dl className="mt-2 divide-y divide-line">
              <Row label={f.name} empty={empty}>
                <strong className="text-midnight">{s.title}</strong>
              </Row>
              <Row label={f.target} empty={empty}>{s.levels.map((l) => t.level[l]).join(", ")}</Row>
              <Row label={t.detail.eligibility} empty={empty}>
                <ul className="space-y-1.5">
                  <li className={s.algeria_eligible === "yes" ? "font-semibold text-emerald-700" : s.algeria_eligible === "no" ? "font-semibold text-red-700" : ""}>
                    <Flag code="dz" className="me-1.5 inline-block h-3.5 w-5 align-[-2px]" />
                    {f.algeria} : {t.detail.algeria[s.algeria_eligible]}
                  </li>
                  {[s.eligible_nationalities, s.qualifications, s.language_requirements, s.age_limit].filter(Boolean).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </Row>
              <Row label={f.deadline} empty={empty}>
                <span className="font-semibold text-midnight">
                  {s.deadline_label ?? deadline?.official ?? (s.verification !== "verified" ? t.card.dateTbc : t.card.noDeadline)}
                </span>
                {!s.deadline_label && deadline?.local && <span className="block text-xs text-slate">{deadline.local}</span>}
                {s.deadline_note && <span className="mt-1 block text-xs text-slate">{s.deadline_note}</span>}
              </Row>
              <Row label={f.officialLink} empty={empty}>
                {officialUrl && (
                  <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-ocean underline underline-offset-2">
                    {new URL(officialUrl).hostname.replace(/^www\./, "")}
                    <Icon name="external" className="h-3.5 w-3.5" />
                  </a>
                )}
              </Row>
            </dl>
            {s.verification !== "verified" && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">{t.detail.unverifiedNote}</p>}
          </section>

          <aside className="lg:sticky lg:top-[calc(var(--g4v-header-h)+1rem)] lg:self-start">
            <section className="rounded-brand-lg bg-midnight p-5 text-white">
              <h2 className="font-semibold">{t.detail.help}</h2>
              <p className="mt-2 text-sm text-mist">{t.detail.helpText}</p>
              <Link href={`/${lang}/apply`} className={buttonClasses("gold", "mt-4 w-full !py-3")}>
                {t.detail.helpCta}
              </Link>
            </section>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="container-brand mt-12 max-w-5xl">
            <h2 className="text-xl font-semibold text-midnight">{t.detail.related}</h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="min-w-0">
                  <ScholarshipCard s={toListItem(r)} lang={lang} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
