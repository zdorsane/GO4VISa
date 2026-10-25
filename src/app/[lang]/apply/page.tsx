import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/content";
import { hasLocale, languageAlternates } from "@/lib/i18n";
import { BookingForm } from "@/components/BookingForm";
import { GlobeHorizon } from "@/components/brand/GlobeHorizon";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[lang]/apply">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).booking;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: `/${lang}/apply`,
      languages: languageAlternates("/apply"),
    },
    openGraph: { title: `${t.metaTitle} · Go4Visa`, description: t.metaDescription, url: `/${lang}/apply` },
  };
}

/** Consultation booking — the single link shared on Instagram and the site's "Start your journey" buttons. */
export default async function ApplyPage({ params }: PageProps<"/[lang]/apply">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.booking;
  const home = `/${lang}`;

  return (
    <>
      <section className="pattern-flight relative isolate overflow-hidden pb-32 pt-[calc(var(--g4v-header-h)+2rem)] md:pb-40">
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-navy/70 via-midnight/30 to-midnight/90" />
        <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-36 w-full md:h-48" />
        <div className="container-brand">
          <nav aria-label={dict.detail.breadcrumb} className="text-sm text-mist">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={home} className="hover:text-gold">{dict.detail.home}</Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white">{t.metaTitle}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <Reveal>
              <p className="label-caps text-gold">{t.eyebrow}</p>
              <h1 className="mt-3 text-[1.7rem] font-bold leading-tight text-white md:text-[2.4rem]">{t.title}</h1>
              <p className="mt-4 max-w-2xl text-sm text-mist md:text-base">{t.lead}</p>
            </Reveal>
            <Reveal delay={0.1} className="rounded-brand-lg bg-white/[0.06] p-6 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="text-sm font-semibold text-gold">{t.agendaTitle}</p>
              <ul className="mt-4 space-y-3">
                {t.agenda.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-midnight">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="booking-title" className="relative -mt-24 pb-24 md:-mt-32">
        <div className="container-brand">
          <BookingForm lang={lang} t={t} />
        </div>
      </section>
    </>
  );
}
