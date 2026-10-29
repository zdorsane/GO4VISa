import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { countryName } from "@/lib/countries";
import { formatDate, formatDeadline, getPlatformDict } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";
import { toListItem, type PublicScholarship } from "@/lib/server/public";
import type { Source } from "@/lib/server/scholarships";
import { DeadlineBadge } from "./DeadlineBadge";
import { Flag } from "./Flag";
import { SaveButton, ScholarshipCard } from "./ScholarshipCard";
import { ShareActions } from "./ShareActions";

function Row({ label, children, empty }: { label: string; children: ReactNode; empty: string }) {
  const missing = children === null || children === undefined || children === "" || (Array.isArray(children) && !children.length);
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm font-medium text-slate">{label}</dt>
      <dd dir="auto" className={`text-sm leading-relaxed ${missing ? "italic text-slate/80" : "text-ink"}`}>{missing ? empty : children}</dd>
    </div>
  );
}

function Block({ title, icon, children }: { title: string; icon: Parameters<typeof Icon>[0]["name"]; children: ReactNode }) {
  return (
    <section className="rounded-brand-lg bg-white p-5 ring-1 ring-line sm:p-6">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold text-midnight">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cloud text-ocean">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        {title}
      </h2>
      <dl className="mt-2 divide-y divide-line">{children}</dl>
    </section>
  );
}

const lines = (v: string | null) =>
  v ? (
    <ul className="list-disc space-y-1 ps-5">
      {v
        .split(/\n+/)
        .map((l) => l.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean)
        .map((l, i) => (
          <li key={i}>{l}</li>
        ))}
    </ul>
  ) : null;

/** Full opportunity page body, shared by the public page and the admin preview. */
export function ScholarshipDetail({
  s,
  sources,
  related = [],
  lang,
  preview = false,
}: {
  s: PublicScholarship;
  sources: Source[];
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
  const opens = formatDate(s.opens_at, lang, false, s.deadline_tz ?? undefined);

  return (
    <>
      <section className="pattern-flight relative isolate overflow-hidden pb-24 pt-[calc(var(--g4v-header-h)+2rem)]">
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-navy/80 via-midnight/50 to-midnight/95" />
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
                <div className="flex flex-wrap items-center gap-2">
                  <DeadlineBadge lang={lang} opens_at={s.opens_at} deadline_at={s.deadline_at} initial={s.deadline_status} className="!bg-white/95" />
                  <span className="rounded-full bg-gold px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-midnight">{t.funding[s.funding_type]}</span>
                </div>
                <h1 dir="auto" className="mt-3 text-2xl font-bold leading-tight text-white md:text-4xl">{s.title}</h1>
                <p dir="auto" className="mt-2 text-sm text-mist md:text-base">
                  {s.institution}
                  {place && ` · ${place}`}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <SaveButton slug={s.slug} lang={lang} className="!h-11 !w-11" />
              {applyUrl && s.deadline_status !== "closed" && (
                <a href={applyUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("gold")}>
                  {t.card.apply}
                  <Icon name="external" className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 -mt-14 pb-20">
        <div className="container-brand grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-6">
            <section className="rounded-brand-lg bg-white p-5 ring-1 ring-line sm:p-6">
              <h2 className="text-lg font-semibold text-midnight">{t.detail.overview}</h2>
              {s.description || s.summary ? (
                <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-slate">
                  {(s.description ?? s.summary ?? "").split(/\n{2,}/).map((p, i) => (
                    <p key={i} dir="auto">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm italic text-slate/80">{empty}</p>
              )}
              <div className="mt-5">
                <ShareActions lang={lang} title={s.title} applyUrl={applyUrl} />
              </div>
            </section>

            <Block title={t.detail.eligibility} icon="user">
              <Row label={f.level} empty={empty}>{s.levels.map((l) => t.level[l]).join(", ")}</Row>
              <Row label={f.nationalities} empty={empty}>{s.eligible_nationalities}</Row>
              <Row label={f.algeria} empty={empty}>
                <span className={s.algeria_eligible === "yes" ? "font-semibold text-emerald-700" : s.algeria_eligible === "no" ? "font-semibold text-red-700" : ""}>
                  <Flag code="dz" className="me-1.5 inline-block h-3.5 w-5 align-[-2px]" />
                  {t.detail.algeria[s.algeria_eligible]}
                </span>
              </Row>
              <Row label={f.studyFields} empty={empty}>{s.fields.join(", ")}</Row>
              <Row label={f.qualifications} empty={empty}>{s.qualifications}</Row>
              <Row label={f.age} empty={empty}>{s.age_limit}</Row>
              <Row label={f.languages} empty={empty}>{s.language_requirements}</Row>
            </Block>

            <Block title={t.detail.benefits} icon="wallet">
              <Row label={f.funding} empty={empty}>{s.funding_type === "unknown" ? null : t.funding[s.funding_type]}</Row>
              <Row label={f.tuition} empty={empty}>{s.tuition}</Row>
              <Row label={f.stipend} empty={empty}>{s.stipend}</Row>
              <Row label={f.accommodation} empty={empty}>{s.accommodation}</Row>
              <Row label={f.travel} empty={empty}>{s.travel}</Row>
              <Row label={f.insurance} empty={empty}>{s.insurance}</Row>
              <Row label={f.duration} empty={empty}>{s.duration}</Row>
            </Block>

            <Block title={t.detail.howToApply} icon="doc">
              <Row label={f.documents} empty={empty}>{lines(s.documents)}</Row>
              <Row label={f.instructions} empty={empty}>{s.instructions}</Row>
              <Row label={f.applyLink} empty={empty}>
                {s.application_url && (
                  <a href={s.application_url} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-ocean underline underline-offset-2">
                    {s.application_url}
                  </a>
                )}
              </Row>
            </Block>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--g4v-header-h)+1rem)] lg:self-start">
            <section className="rounded-brand-lg bg-white p-5 ring-1 ring-line">
              <h2 className="font-semibold text-midnight">{t.detail.dates}</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-slate">{f.deadline}</dt>
                  <dd className="mt-0.5 text-base font-semibold text-midnight">{deadline?.official ?? t.card.noDeadline}</dd>
                  {deadline?.local && <dd className="mt-0.5 text-xs text-slate">{deadline.local}</dd>}
                </div>
                <div>
                  <dt className="text-slate">{f.opens}</dt>
                  <dd className="mt-0.5 font-medium text-midnight">{opens ?? <span className="italic text-slate/80">{empty}</span>}</dd>
                </div>
                {s.deadline_note && <dd dir="auto" className="rounded-xl bg-cloud p-3 text-xs leading-relaxed text-slate">{s.deadline_note}</dd>}
              </dl>
            </section>

            <section className="rounded-brand-lg bg-white p-5 ring-1 ring-line">
              <h2 className="font-semibold text-midnight">{t.detail.sources}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {s.source_url ? (
                  <li>
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-ocean underline underline-offset-2">
                      {f.source}
                    </a>
                  </li>
                ) : (
                  <li className="italic text-slate/80">{empty}</li>
                )}
                {sources.map((src) => (
                  <li key={src.id}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="break-all text-ocean underline underline-offset-2">
                      {src.label || src.url}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate">
                {f.verified} : <strong className="text-midnight">{formatDate(s.verified_at, lang) ?? empty}</strong>
              </p>
              <p className={`mt-3 rounded-xl p-3 text-xs leading-relaxed ${s.verification === "verified" ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
                {s.verification === "verified" ? t.detail.verifiedNote : t.detail.unverifiedNote}
              </p>
            </section>

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
                <li key={r.slug}>
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
