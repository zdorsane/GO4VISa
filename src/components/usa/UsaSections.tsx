import Image from "next/image";
import Link from "next/link";
import { LogoSymbol } from "@/components/brand/Logo";
import { Flag } from "@/components/scholarships/Flag";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n";
import type { UsaSummerDict } from "@/lib/usa-summer";
import { photos } from "./photos";
import { Spotlight, SplitWords, Tilt } from "./UsaMotion";

type Benefit = keyof UsaSummerDict["experience"]["benefits"];

/** The six benefits, each on its own photo with the accent colour of its badge. */
const TILES: { key: Benefit; icon: IconName; photo: (typeof photos)[keyof typeof photos]; badge: string; place: string }[] = [
  { key: "english", icon: "chat", photo: photos.washingtonSquare, badge: "bg-white text-midnight", place: "Washington Square, NYC" },
  { key: "people", icon: "globe", photo: photos.santaMonicaStairs, badge: "bg-sky text-midnight", place: "Santa Monica, CA" },
  { key: "work", icon: "briefcase", photo: photos.lifeguard, badge: "bg-gold text-midnight", place: "Miami Beach, FL" },
  { key: "culture", icon: "star", photo: photos.timesSquare, badge: "bg-white text-midnight", place: "Times Square, NYC" },
  { key: "money", icon: "wallet", photo: photos.boardwalk, badge: "bg-gold text-midnight", place: "Santa Cruz, CA" },
  { key: "travel", icon: "map", photo: photos.route66, badge: "bg-sky text-midnight", place: "Route 66" },
];

const SERVICE_ICONS: IconName[] = ["search", "user", "pen", "chat", "doc", "id"];

/** Photos travelling on the postcard ribbon. */
const RIBBON = [
  photos.santaMonicaPier,
  photos.washingtonSquare,
  photos.route66,
  photos.lifeguard,
  photos.timesSquare,
  photos.goldenGate,
  photos.boardwalk,
  photos.liberty,
  photos.santaMonicaBeach,
  photos.centralPark,
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`label-caps flex items-center gap-2 ${light ? "text-gold" : "text-ocean"}`}>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

function Marquee({ items, reverse = false, className }: { items: string[]; reverse?: boolean; className: string }) {
  return (
    <div className={`overflow-hidden py-3.5 ${className}`} dir="ltr">
      <div className={`flex w-max ${reverse ? "motion-safe:animate-[g4v-marquee_44s_linear_infinite_reverse]" : "motion-safe:animate-[g4v-marquee_38s_linear_infinite]"}`}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {[...items, ...items].map((label, i) => (
              <li key={i} className="flex items-center gap-6 px-6 text-sm font-extrabold uppercase tracking-[0.18em] md:text-base">
                <span dir="auto">{label}</span>
                <Icon name="star" className="h-4 w-4 fill-current" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/** Two crossing tapes scrolling the six benefits in opposite directions. */
export function UsaTicker({ t }: { t: UsaSummerDict["experience"]["benefits"] }) {
  const items = Object.values(t);
  return (
    <div aria-hidden className="relative z-10 -mb-6 -mt-10 overflow-hidden pb-6 pt-10">
      <Marquee items={items} className="-mx-4 -rotate-2 bg-gold text-midnight shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]" />
      <Marquee items={items} reverse className="-mx-4 -mt-12 rotate-[1.5deg] bg-midnight text-white ring-1 ring-white/10" />
    </div>
  );
}

/** Why spend the summer in the USA: the story on one side, a photo mosaic on the other, then the six benefits. */
export function UsaExperience({ t }: { t: UsaSummerDict["experience"] }) {
  const [lead, ...rest] = t.paragraphs;
  return (
    <section id="experience" className="scroll-mt-[var(--g4v-header-h)] overflow-hidden bg-white py-20 md:py-28">
      <div className="container-brand">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>{t.eyebrow}</Eyebrow>
            </Reveal>
            <SplitWords text={t.title} className="mt-4 text-3xl font-extrabold leading-tight text-midnight md:text-5xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 border-s-4 border-gold ps-5 text-lg font-medium leading-relaxed text-midnight md:text-xl">{lead}</p>
            </Reveal>
            {rest.map((p, i) => (
              <Reveal key={p} delay={0.18 + i * 0.08}>
                <p className="mt-5 leading-relaxed text-slate md:text-lg">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Reveal y={40} className="col-span-2">
                <figure className="group relative aspect-[2.4/1] overflow-hidden rounded-3xl">
                  <Image src={photos.centralPark.src} alt={photos.centralPark.alt} fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                  <figcaption className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-midnight keep-light">Central Park, NYC</figcaption>
                </figure>
              </Reveal>
              <Reveal y={60} delay={0.12}>
                <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image src={photos.santaMonicaBeach.src} alt={photos.santaMonicaBeach.alt} fill placeholder="blur" sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                  <figcaption className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-midnight keep-light">Santa Monica</figcaption>
                </figure>
              </Reveal>
              <Reveal y={80} delay={0.24} className="translate-y-8">
                <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image src={photos.santaMonicaPier.src} alt={photos.santaMonicaPier.alt} fill placeholder="blur" sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover object-[70%_center] transition-transform duration-[1400ms] group-hover:scale-105" />
                  <figcaption className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-midnight keep-light">Los Angeles</figcaption>
                </figure>
              </Reveal>
            </div>
            <span aria-hidden className="absolute -end-3 -top-5 flex h-20 w-20 items-center justify-center rounded-full bg-gold shadow-xl ring-4 ring-white keep-light motion-safe:animate-[g4v-orbit_14s_linear_infinite]">
              <Flag code="us" className="h-7 w-10" />
            </span>
          </div>
        </div>

        <ul className="mt-20 grid gap-5 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal as="li" key={tile.key} y={50} delay={(i % 3) * 0.1} className="h-60 md:h-72">
              <Tilt className="overflow-hidden rounded-3xl shadow-[0_25px_50px_-30px_rgba(11,45,91,0.6)] ring-1 ring-line">
                <Image src={tile.photo.src} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover/tilt:scale-110" />
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/45 to-midnight/5 transition-opacity duration-500 group-hover/tilt:opacity-90" />
                <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white [transform:translateZ(40px)]">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover/tilt:-rotate-6 group-hover/tilt:scale-110 keep-light ${tile.badge}`}>
                      <Icon name={tile.icon} className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-black/30 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-white/85 backdrop-blur-sm">{tile.place}</span>
                  </div>
                  <div>
                    <span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-gold transition-all duration-500 group-hover/tilt:w-20" />
                    <h3 className="text-xl font-bold leading-snug md:text-2xl">{t.benefits[tile.key]}</h3>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Go4Visa as the guide: the promise on one side, the Statue of Liberty in an orbit on the other. */
export function UsaGuide({ t }: { t: UsaSummerDict["guide"] }) {
  return (
    <section className="pattern-flight relative isolate overflow-hidden bg-midnight py-20 md:py-28">
      <div aria-hidden className="absolute -start-32 top-10 -z-10 h-96 w-96 rounded-full bg-ocean/25 blur-3xl motion-safe:animate-[g4v-drift-a_14s_ease-in-out_infinite]" />
      <div aria-hidden className="absolute -end-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl motion-safe:animate-[g4v-drift-b_16s_ease-in-out_infinite]" />
      <div className="container-brand grid items-center gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <Reveal>
            <Eyebrow light>{t.eyebrow}</Eyebrow>
          </Reveal>
          <SplitWords text={t.title} className="mt-4 text-3xl font-extrabold uppercase leading-tight text-white md:text-5xl rtl:normal-case" />
          {t.paragraphs.map((p, i) => (
            <Reveal key={p} delay={0.1 + i * 0.1}>
              <p className={`mt-5 leading-relaxed md:text-lg ${i === 0 ? "text-white" : "text-mist"}`}>{p}</p>
            </Reveal>
          ))}
          <ul className="mt-8 flex flex-wrap gap-3">
            {t.tags.map((tag, i) => (
              <Reveal as="li" key={tag} delay={0.3 + i * 0.1} y={14} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-gold hover:text-midnight">
                <Icon name="check" className="h-4 w-4 text-gold" />
                {tag}
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.15} y={40} aria-hidden className="relative mx-auto aspect-square w-full max-w-sm">
          <span className="absolute inset-0 rounded-full border border-dashed border-white/25 motion-safe:animate-[g4v-orbit_60s_linear_infinite]" />
          <span className="absolute inset-[10%] rounded-full border border-white/10" />
          <span className="absolute inset-0 motion-safe:animate-[g4v-orbit_22s_linear_infinite]">
            <span className="absolute start-1/2 top-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-midnight shadow-[0_0_30px_rgba(245,179,1,0.6)] rtl:translate-x-1/2">
              <Icon name="plane" className="h-5 w-5 rotate-90" />
            </span>
          </span>
          <span className="absolute inset-[10%] motion-safe:animate-[g4v-orbit_16s_linear_infinite_reverse]">
            <span className="absolute bottom-0 start-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-sky shadow-[0_0_14px_4px_rgba(56,189,248,0.5)] rtl:translate-x-1/2" />
          </span>
          <span className="absolute inset-[18%] overflow-hidden rounded-full shadow-[0_30px_80px_-20px_rgba(245,179,1,0.5)] ring-4 ring-white/15">
            <Image src={photos.liberty.src} alt="" fill placeholder="blur" sizes="18rem" className="g4v-kenburns object-cover object-[35%_center]" />
          </span>
          <span className="absolute bottom-[12%] start-[6%] flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 shadow-xl keep-light">
            <LogoSymbol className="h-full w-auto" />
          </span>
          <span className="absolute bottom-[6%] end-[4%] flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg keep-light">
            <Flag code="dz" className="h-3.5 w-5" />
            <Icon name="arrow" className="h-3.5 w-3.5 text-midnight rtl:rotate-180" />
            <Flag code="us" className="h-3.5 w-5" />
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/** The six services, numbered, with a light following the pointer. */
export function UsaServices({ t }: { t: UsaSummerDict["services"] }) {
  return (
    <section className="bg-cloud py-20 md:py-28">
      <div className="container-brand">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="label-caps text-ocean">{t.eyebrow}</p>
          </Reveal>
          <SplitWords text={t.title} className="mt-3 text-3xl font-extrabold text-midnight md:text-5xl" />
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((s, i) => (
            <Reveal as="li" key={s.title} y={40} delay={(i % 3) * 0.1}>
              <Spotlight className="group h-full overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-line transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(11,45,91,0.45)] hover:ring-gold/60">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-gold via-amber to-sky transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
                <span aria-hidden className="absolute -end-2 -top-4 text-8xl font-black text-midnight/[0.05] transition-all duration-500 group-hover:-translate-y-1 group-hover:text-gold/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-midnight text-gold transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 group-hover:bg-gold group-hover:text-midnight">
                  <Icon name={SERVICE_ICONS[i]} className="h-6 w-6" />
                </span>
                <p className="relative mt-6 text-xs font-bold tracking-[0.2em] text-ocean">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="relative mt-1 text-xl font-bold text-midnight">{s.title}</h3>
                <p className="relative mt-3 leading-relaxed text-slate">{s.text}</p>
              </Spotlight>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Ribbon of tilted postcards drifting across the page (paused on hover). */
export function UsaRibbon() {
  return (
    <div aria-hidden className="group/ribbon overflow-hidden bg-cloud pb-20 pt-4" dir="ltr">
      <div className="flex w-max gap-6 motion-safe:animate-[g4v-marquee_70s_linear_infinite] group-hover/ribbon:[animation-play-state:paused]">
        {[...RIBBON, ...RIBBON].map((p, i) => (
          <figure
            key={i}
            className={`relative w-56 shrink-0 rounded-2xl bg-white p-2 pb-8 shadow-[0_20px_40px_-24px_rgba(11,45,91,0.55)] transition-transform duration-500 hover:z-10 hover:scale-105 hover:rotate-0 md:w-64 keep-light ${i % 2 ? "rotate-[3deg]" : "-rotate-[2deg]"}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={p.src} alt="" fill placeholder="blur" sizes="16rem" className="object-cover" />
            </div>
            <Flag code="us" className="absolute bottom-2.5 end-3 h-3 w-4.5" />
          </figure>
        ))}
      </div>
    </div>
  );
}

/** The 80% figure with its context and the disclaimer, never presented as a guarantee. */
export function UsaCommitment({ t, rate }: { t: UsaSummerDict["commitment"]; rate: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight py-20 md:py-28">
      <Image src={photos.brooklynNight.src} alt="" fill placeholder="blur" sizes="100vw" className="-z-20 object-cover opacity-30" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-br from-midnight/95 via-navy/85 to-midnight/95" />
      <div aria-hidden className="absolute start-1/4 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl motion-safe:animate-[g4v-drift-c_18s_ease-in-out_infinite]" />
      <div className="container-brand grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal y={30}>{rate}</Reveal>
        <div>
          <Reveal>
            <Eyebrow light>{t.eyebrow}</Eyebrow>
          </Reveal>
          <SplitWords as="p" text={t.rateNote} className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl" />
          <Reveal delay={0.15}>
            <blockquote className="relative mt-8 rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur-sm md:p-8">
              <Icon name="quote" className="absolute -top-4 start-6 h-9 w-9 rounded-full bg-gold p-2 text-midnight" />
              <p className="text-lg font-medium leading-relaxed text-white md:text-xl">{t.trust}</p>
            </blockquote>
          </Reveal>
          <Reveal delay={0.25}>
            <aside className="mt-6 flex gap-4 rounded-2xl border border-white/15 bg-midnight/40 p-5 backdrop-blur-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                <Icon name="id" className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white rtl:tracking-normal">{t.disclaimerTitle}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{t.disclaimer}</p>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Closing band over the Golden Gate: book a consultation, then the photo credits. */
export function UsaFinalCta({ lang, t, credits }: { lang: Locale; t: UsaSummerDict["cta"]; credits: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight">
      <Image src={photos.goldenGate.src} alt="" fill placeholder="blur" sizes="100vw" className="g4v-kenburns -z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-midnight/85 via-midnight/50 to-midnight/90" />
      <div className="container-brand flex min-h-[80svh] flex-col items-center justify-center py-24 text-center">
        <div className="max-w-3xl">
          <Reveal y={20}>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl keep-light motion-safe:animate-bounce">
              <Flag code="us" className="h-6 w-8" />
            </span>
          </Reveal>
          <SplitWords text={t.title} className="mt-6 text-4xl font-extrabold uppercase leading-[1.05] text-white md:text-6xl rtl:normal-case rtl:leading-tight" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-xl font-semibold text-gold md:text-2xl">{t.paragraphs[0]}</p>
            <p className="mx-auto mt-3 max-w-2xl text-white/85 md:text-lg">{t.paragraphs[1]}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <span className="relative mt-10 inline-flex">
              <span aria-hidden className="absolute inset-0 rounded-full bg-gold/60 motion-safe:animate-ping" />
              <Link href={`/${lang}/apply`} className={buttonClasses("gold", "relative !px-9 !py-5 text-base uppercase tracking-wider rtl:tracking-normal")}>
                {t.button}
                <Icon name="arrow" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </span>
            <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-white/80">
              {t.note}
              <Flag code="us" className="h-3.5 w-5" />
            </p>
          </Reveal>
        </div>
      </div>
      <p className="container-brand pb-6 text-center text-[0.65rem] leading-relaxed text-white/50">
        {credits} :{" "}
        {Object.values(photos).map((p, i) => (
          <span key={p.credit.url}>
            {i > 0 && " · "}
            <a href={p.credit.url} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
              {p.credit.author} ({p.credit.license})
            </a>
          </span>
        ))}{" "}
        — Wikimedia Commons
      </p>
    </section>
  );
}
