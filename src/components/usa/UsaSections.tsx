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

type Benefit = keyof UsaSummerDict["experience"]["benefits"];
type Photo = (typeof photos)[keyof typeof photos];

/** The six benefits as a checkerboard: three icon tiles, three photo tiles. */
const TILES: ({ key: Benefit; icon: IconName } & ({ photo: Photo } | { bg: string; text: string; ring: string }))[] = [
  { key: "english", icon: "chat", bg: "bg-midnight", text: "text-white", ring: "ring-white/20" },
  { key: "people", icon: "globe", photo: photos.santaMonicaStairs },
  { key: "work", icon: "briefcase", bg: "bg-gold", text: "text-midnight", ring: "ring-midnight/15" },
  { key: "culture", icon: "star", photo: photos.timesSquare },
  { key: "money", icon: "wallet", bg: "bg-linear-to-br from-ocean to-teal", text: "text-white", ring: "ring-white/20" },
  { key: "travel", icon: "map", photo: photos.route66 },
];

const SERVICE_ICONS: IconName[] = ["search", "user", "pen", "chat", "doc", "id"];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`label-caps flex items-center gap-2 ${light ? "text-gold" : "text-ocean"}`}>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

/** Gold ribbon scrolling the six benefits. */
export function UsaTicker({ t }: { t: UsaSummerDict["experience"]["benefits"] }) {
  const items = Object.values(t);
  return (
    <div aria-hidden className="relative z-10 -mt-px overflow-hidden bg-gold py-4 text-midnight" dir="ltr">
      <div className="flex w-max motion-safe:animate-[g4v-marquee_38s_linear_infinite]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((label) => (
              <li key={label} className="flex items-center gap-6 px-6 text-sm font-extrabold uppercase tracking-[0.18em] md:text-base">
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

/** Why spend the summer in the USA: the story on one side, a photo mosaic on the other, then the six benefits. */
export function UsaExperience({ t }: { t: UsaSummerDict["experience"] }) {
  const [lead, ...rest] = t.paragraphs;
  return (
    <section id="experience" className="scroll-mt-[var(--g4v-header-h)] bg-white py-20 md:py-28">
      <div className="container-brand">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-midnight md:text-5xl">{t.title}</h2>
            <p className="mt-6 border-s-4 border-gold ps-5 text-lg font-medium leading-relaxed text-midnight md:text-xl">{lead}</p>
            {rest.map((p) => (
              <p key={p} className="mt-5 leading-relaxed text-slate md:text-lg">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <figure className="group relative col-span-2 aspect-[2.4/1] overflow-hidden rounded-3xl">
                <Image src={photos.centralPark.src} alt={photos.centralPark.alt} fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                <figcaption className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-midnight keep-light">Central Park, NYC</figcaption>
              </figure>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image src={photos.santaMonicaBeach.src} alt={photos.santaMonicaBeach.alt} fill placeholder="blur" sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                <figcaption className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-midnight keep-light">Santa Monica</figcaption>
              </figure>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image src={photos.santaMonicaPier.src} alt={photos.santaMonicaPier.alt} fill placeholder="blur" sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover object-[70%_center] transition-transform duration-[1400ms] group-hover:scale-105" />
                <figcaption className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-midnight keep-light">Los Angeles</figcaption>
              </figure>
            </div>
            <span aria-hidden className="absolute -end-3 -top-5 flex h-20 w-20 rotate-12 items-center justify-center rounded-full bg-gold shadow-xl ring-4 ring-white keep-light">
              <Flag code="us" className="h-7 w-10" />
            </span>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {TILES.map((tile, i) => (
            <Reveal as="li" key={tile.key} delay={(i % 3) * 0.08} className="group relative h-56 overflow-hidden rounded-3xl ring-1 ring-line md:h-64">
              {"photo" in tile ? (
                <>
                  <Image src={tile.photo.src} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                  <span aria-hidden className="absolute inset-0 bg-linear-to-t from-midnight/90 via-midnight/30 to-transparent" />
                </>
              ) : (
                <span aria-hidden className={`absolute inset-0 ${tile.bg} ${tile.text}`}>
                  <Icon name={tile.icon} className="absolute -bottom-6 -end-6 h-44 w-44 opacity-10 transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110" />
                </span>
              )}
              <div className={`relative flex h-full flex-col justify-between p-6 ${"photo" in tile ? "text-white" : tile.text}`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6 ${"photo" in tile ? "bg-white/15 ring-white/25 backdrop-blur" : `bg-white/15 ${tile.ring}`}`}>
                  <Icon name={tile.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold leading-snug md:text-2xl">{t.benefits[tile.key]}</h3>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Go4Visa as the guide: the promise on one side, the logo in an orbit on the other. */
export function UsaGuide({ t }: { t: UsaSummerDict["guide"] }) {
  return (
    <section className="pattern-flight relative isolate overflow-hidden bg-midnight py-20 md:py-28">
      <div aria-hidden className="absolute -start-32 top-10 -z-10 h-96 w-96 rounded-full bg-ocean/25 blur-3xl" />
      <div aria-hidden className="absolute -end-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="container-brand grid items-center gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Reveal>
          <Eyebrow light>{t.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold uppercase leading-tight text-white md:text-5xl rtl:normal-case">{t.title}</h2>
          {t.paragraphs.map((p, i) => (
            <p key={p} className={`mt-5 leading-relaxed md:text-lg ${i === 0 ? "text-white" : "text-mist"}`}>
              {p}
            </p>
          ))}
          <ul className="mt-8 flex flex-wrap gap-3">
            {t.tags.map((tag) => (
              <li key={tag} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15">
                <Icon name="check" className="h-4 w-4 text-gold" />
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15} aria-hidden className="relative mx-auto aspect-square w-full max-w-sm">
          <span className="absolute inset-0 rounded-full border border-dashed border-white/20" />
          <span className="absolute inset-[14%] rounded-full border border-white/10" />
          <span className="absolute inset-0 motion-safe:animate-[g4v-orbit_22s_linear_infinite]">
            <span className="absolute start-1/2 top-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-midnight shadow-[0_0_30px_rgba(245,179,1,0.6)] rtl:translate-x-1/2">
              <Icon name="plane" className="h-5 w-5 rotate-90" />
            </span>
          </span>
          <span className="absolute inset-[14%] motion-safe:animate-[g4v-orbit_16s_linear_infinite_reverse]">
            <span className="absolute bottom-0 start-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-sky shadow-[0_0_14px_4px_rgba(56,189,248,0.5)] rtl:translate-x-1/2" />
          </span>
          <span className="absolute inset-[28%] flex items-center justify-center rounded-full bg-white p-[12%] shadow-[0_30px_80px_-20px_rgba(245,179,1,0.45)] keep-light">
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

/** The six services, numbered, three per row on wide screens. */
export function UsaServices({ t }: { t: UsaSummerDict["services"] }) {
  return (
    <section className="bg-cloud py-20 md:py-28">
      <div className="container-brand">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="label-caps text-ocean">{t.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold text-midnight md:text-5xl">{t.title}</h2>
        </Reveal>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={(i % 3) * 0.08}
              className="group relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-line transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(11,45,91,0.45)] hover:ring-gold/60"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-gold via-amber to-sky transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
              <span aria-hidden className="absolute -end-2 -top-4 text-8xl font-black text-midnight/[0.05] transition-colors duration-500 group-hover:text-gold/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-midnight text-gold transition-all duration-500 group-hover:rotate-6 group-hover:bg-gold group-hover:text-midnight">
                <Icon name={SERVICE_ICONS[i]} className="h-6 w-6" />
              </span>
              <p className="relative mt-6 text-xs font-bold tracking-[0.2em] text-ocean">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="relative mt-1 text-xl font-bold text-midnight">{s.title}</h3>
              <p className="relative mt-3 leading-relaxed text-slate">{s.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The 80% figure with its context and the disclaimer, never presented as a guarantee. */
export function UsaCommitment({ t, rate }: { t: UsaSummerDict["commitment"]; rate: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-midnight via-navy to-midnight py-20 md:py-28">
      <div aria-hidden className="absolute start-1/4 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-brand grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>{rate}</Reveal>
        <Reveal delay={0.12}>
          <Eyebrow light>{t.eyebrow}</Eyebrow>
          <p className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">{t.rateNote}</p>
          <blockquote className="relative mt-8 rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 md:p-8">
            <Icon name="quote" className="absolute -top-4 start-6 h-9 w-9 rounded-full bg-gold p-2 text-midnight" />
            <p className="text-lg font-medium leading-relaxed text-white md:text-xl">{t.trust}</p>
          </blockquote>
          <aside className="mt-6 flex gap-4 rounded-2xl border border-white/15 p-5">
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
    </section>
  );
}

/** Closing band over the Golden Gate: book a consultation, then the photo credits. */
export function UsaFinalCta({ lang, t, credits }: { lang: Locale; t: UsaSummerDict["cta"]; credits: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight">
      <Image src={photos.goldenGate.src} alt="" fill placeholder="blur" sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-midnight/85 via-midnight/55 to-midnight/90" />
      <div className="container-brand flex min-h-[80svh] flex-col items-center justify-center py-24 text-center">
        <Reveal className="max-w-3xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl keep-light">
            <Flag code="us" className="h-6 w-8" />
          </span>
          <h2 className="mt-6 text-4xl font-extrabold uppercase leading-[1.05] text-white md:text-6xl rtl:normal-case rtl:leading-tight">{t.title}</h2>
          <p className="mt-6 text-xl font-semibold text-gold md:text-2xl">{t.paragraphs[0]}</p>
          <p className="mx-auto mt-3 max-w-2xl text-white/85 md:text-lg">{t.paragraphs[1]}</p>
          <Link href={`/${lang}/apply`} className={buttonClasses("gold", "mt-10 !px-9 !py-5 text-base uppercase tracking-wider rtl:tracking-normal")}>
            {t.button}
            <Icon name="arrow" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80">
            {t.note}
            <Flag code="us" className="h-3.5 w-5" />
          </p>
        </Reveal>
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
