import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinationSlugs, getDestination, getDestinations } from "@/lib/destinations";
import { getDictionary } from "@/lib/content";
import { hasLocale, locales } from "@/lib/i18n";
import { DestinationFacts } from "@/components/DestinationFacts";
import { GlobeHorizon } from "@/components/brand/GlobeHorizon";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return locales.flatMap((lang) => destinationSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/destinations/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDestination(slug, lang);
  if (!d) return {};
  const t = getDictionary(lang).detail;
  const description = `${d.programme} — ${d.covers}. ${t.fundedBy} ${d.fundedBy}.`;
  return {
    title: `${d.country}: ${d.programme}`,
    description,
    alternates: {
      canonical: `/${lang}/destinations/${d.slug}`,
      languages: {
        en: `/en/destinations/${d.slug}`,
        fr: `/fr/destinations/${d.slug}`,
        "x-default": `/en/destinations/${d.slug}`,
      },
    },
    openGraph: { title: `${d.country}: ${d.programme} · Go4Visa`, description, url: `/${lang}/destinations/${d.slug}` },
  };
}

export default async function DestinationPage({ params }: PageProps<"/[lang]/destinations/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDestination(slug, lang);
  if (!d) notFound();

  const dict = getDictionary(lang);
  const t = dict.detail;
  const destinations = getDestinations(lang);
  const index = destinations.findIndex((x) => x.slug === d.slug);
  const prev = destinations[(index - 1 + destinations.length) % destinations.length];
  const next = destinations[(index + 1) % destinations.length];
  const home = `/${lang}`;

  return (
    <>
      <section className="pattern-flight relative isolate overflow-hidden pb-40 pt-[calc(var(--g4v-header-h)+3rem)] md:pb-52">
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-navy/70 via-midnight/30 to-midnight/90" />
        <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-36 w-full md:h-48" />
        <div className="container-brand">
          <nav aria-label={t.breadcrumb} className="text-sm text-mist">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={home} className="hover:text-gold">{t.home}</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`${home}#destinations`} className="hover:text-gold">{dict.footer.destinations}</Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white">{d.country}</li>
            </ol>
          </nav>

          <Reveal className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gold text-4xl font-semibold text-midnight">
              {d.code}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/flags/${d.flag}.svg`} alt="" width={40} height={40} className="absolute -bottom-1 -end-1 h-10 w-10 rounded-full ring-4 ring-midnight" />
            </span>
            <div>
              <p className="label-caps text-gold">{dict.destinations.eyebrow}</p>
              <h1 className="mt-2 text-4xl font-bold text-white md:text-6xl">{d.country}</h1>
              <p className="mt-2 text-xl text-mist">{d.programme}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="programme-title" className="relative -mt-24 pb-24 md:-mt-32">
        <div className="container-brand">
          <Reveal className="rounded-brand-lg bg-white p-6 shadow-[0_30px_60px_-25px_rgba(11,45,91,0.35)] ring-1 ring-line md:p-12">
            <p className="label-caps text-ocean">{dict.destinations.flagship}</p>
            <h2 id="programme-title" className="mt-2 text-3xl font-semibold text-midnight">
              {d.programme}
            </h2>
            <div className="mt-8">
              <DestinationFacts d={d} t={dict.destinations} />
            </div>
            <p className="mt-6 text-sm text-slate">{dict.destinations.disclaimer}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`${home}#contact`} arrow>
                {t.apply}
              </ButtonLink>
              <ButtonLink href={`${home}#services`} variant="outline-dark">
                {t.seeServices}
              </ButtonLink>
            </div>
          </Reveal>

          <nav aria-label={t.others} className="mt-10 flex items-center justify-between gap-4">
            <Link href={`${home}/destinations/${prev.slug}`} className="group inline-flex items-center gap-2 py-2 font-semibold text-midnight hover:text-ocean">
              <Icon name="arrow" className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              {prev.country}
            </Link>
            <Link href={`${home}/destinations/${next.slug}`} className="group inline-flex items-center gap-2 py-2 font-semibold text-midnight hover:text-ocean">
              {next.country}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
