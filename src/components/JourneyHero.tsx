"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { GlobeHorizon } from "./brand/GlobeHorizon";
import { PLANE_PATH } from "./brand/Logo";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

/** The route the four step chips sit on (viewBox 480 × 340). */
const ROUTE = "M24 312C120 312 130 214 214 200S330 150 352 104S410 34 458 30";
/** Chip anchors along the route, in % of the drawing (physical, so the route reads the same in RTL). */
const STOPS = [
  { left: "9%", top: "88%" },
  { left: "40%", top: "58%" },
  { left: "70%", top: "33%" },
  { left: "90%", top: "8%" },
];

/** Opening band of the How it works page: headline, CTAs and the journey drawn as a route. */
export function JourneyHero({
  lang,
  t,
  steps,
}: {
  lang: Locale;
  t: Dict["pages"]["howItWorks"];
  steps: Dict["steps"]["items"];
}) {
  const reduce = useReducedMotion();

  return (
    <section className="pattern-flight relative isolate overflow-hidden pb-20 pt-[calc(var(--g4v-header-h)+2.5rem)] md:pb-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-navy/80 via-midnight/40 to-midnight/90" />
      <div aria-hidden className="absolute -end-40 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(3,179,226,0.18),transparent_65%)]" />
      <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-16 w-full md:h-24" />

      <div className="container-brand grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <Reveal>
          <p className="label-caps text-gold">{t.eyebrow}</p>
          <h1 id="page-title" className="mt-4 text-[2.2rem] font-bold leading-[1.05] text-white md:text-[3.4rem]">
            {t.heroTitleA}
            <span className="block bg-linear-to-r from-gold to-amber bg-clip-text text-transparent">{t.heroTitleB}</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist md:text-base">{t.heroLead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/${lang}/apply`} arrow>
              {t.book}
            </ButtonLink>
            <ButtonLink href="#destinations" variant="outline-light">
              {t.explore}
            </ButtonLink>
          </div>
        </Reveal>

        {/* The journey as a route: 01 → 04 */}
        <div aria-hidden className="relative mx-auto aspect-[48/34] w-full max-w-xl">
          <svg viewBox="0 0 480 340" className="absolute inset-0 h-full w-full overflow-visible">
            <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
            <path
              id="g4v-journey-route"
              d={ROUTE}
              fill="none"
              stroke="#F5B301"
              strokeOpacity=".8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
              className="motion-safe:animate-[g4v-dash_6s_linear_infinite]"
            />
            {!reduce ? (
              <g>
                <path d={PLANE_PATH} fill="#F5B301" transform="scale(.8)" />
                <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#g4v-journey-route" />
                </animateMotion>
              </g>
            ) : (
              <path d={PLANE_PATH} fill="#F5B301" transform="translate(458 30) rotate(-10) scale(.8)" />
            )}
          </svg>

          {steps.map((s, i) => (
            <div key={s.key} style={STOPS[i]} className="absolute -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.18, ease }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                className="flex items-center gap-2 whitespace-nowrap rounded-2xl bg-white/10 py-1.5 pe-3 ps-1.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/20 backdrop-blur-md sm:py-2 sm:pe-4 sm:ps-2"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold sm:h-8 sm:w-8 ${
                    i === steps.length - 1 ? "bg-gold text-midnight" : "bg-midnight text-gold ring-1 ring-gold/40"
                  }`}
                >
                  0{i + 1}
                </span>
                <span className="text-xs font-semibold text-white sm:text-sm">{s.label}</span>
              </motion.div>
            </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
