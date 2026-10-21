"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LogoSymbol, PLANE_PATH } from "./brand/Logo";
import { GlobeHorizon } from "./brand/GlobeHorizon";
import { HeroBackground } from "./brand/HeroBackground";
import { ButtonLink } from "./ui/Button";
import { site, type Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

/** Dotted elliptical orbit with a plane flying along it. */
function Orbit({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <g transform="rotate(-18 260 260)">
        <path
          id="g4v-orbit"
          d="M20 260a240 96 0 1 0 480 0a240 96 0 1 0-480 0"
          fill="none"
          stroke="#F5B301"
          strokeOpacity=".55"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.1 9"
        />
        <path
          d="M70 260a190 70 0 1 1 380 0a190 70 0 1 1-380 0"
          fill="none"
          stroke="#03B3E2"
          strokeOpacity=".25"
          strokeWidth="1"
        />
        {animate ? (
          <g>
            <path d={PLANE_PATH} fill="#F5B301" transform="scale(.75)" />
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
              <mpath href="#g4v-orbit" />
            </animateMotion>
          </g>
        ) : (
          <path d={PLANE_PATH} fill="#F5B301" transform="translate(500 260) rotate(-90) scale(.75)" />
        )}
        {animate && (
          <circle r="3.5" fill="#03B3E2">
            <animateMotion dur="9s" repeatCount="indefinite" path="M70 260a190 70 0 1 1 380 0a190 70 0 1 1-380 0" />
          </circle>
        )}
      </g>
    </svg>
  );
}

export function Hero({ lang, t }: { lang: Locale; t: Dict["hero"] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const symbolY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  // content lifts away and fades as the visitor scrolls into the page
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduce ? 1 : 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, reduce ? 0 : -70]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="pattern-flight relative isolate flex min-h-svh items-center overflow-hidden pb-40 pt-[calc(var(--g4v-header-h)+2rem)] md:pb-48"
    >
      {/* depth: sky glow behind the symbol */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_70%_40%,rgba(3,179,226,0.28),transparent_70%),linear-gradient(180deg,rgba(1,33,73,0.65),rgba(11,45,91,0.2)_40%,rgba(11,45,91,0.85))]"
      />
      <HeroBackground scroll={scrollYProgress} />

      <div className="container-brand grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="text-center lg:text-start">
          <motion.p {...fade(0.1)} className="label-caps text-gold">
            {t.eyebrow}
          </motion.p>
          <motion.h1
            id="hero-title"
            {...fade(0.2)}
            className="mt-5 text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
          >
            {t.titleA}{" "}
            <span className="bg-linear-to-r from-sky to-teal bg-clip-text text-transparent">
              {t.titleB}
            </span>
          </motion.h1>
          <motion.p {...fade(0.35)} className="mx-auto mt-6 max-w-xl text-lg text-mist lg:mx-0">
            {t.subline}
          </motion.p>
          <motion.div {...fade(0.5)} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <ButtonLink href={`/${lang}#destinations`} arrow>
              {t.primaryCta}
            </ButtonLink>
            <ButtonLink href={`/${lang}#services`} variant="outline-light">
              {t.secondaryCta}
            </ButtonLink>
          </motion.div>
          <motion.p {...fade(0.65)} className="label-caps mt-12 text-white/70">
            {site.tagline}
          </motion.p>
        </motion.div>

        <motion.div style={{ y: symbolY }} className="relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-[32rem]">
          <Orbit animate={!reduce} />
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="absolute inset-[14%] flex items-center justify-center"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full drop-shadow-[0_20px_40px_rgba(3,179,226,0.35)]"
            >
              <LogoSymbol variant="white" title={t.symbolAlt} className="w-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        style={{ opacity: cueOpacity }}
        className="group absolute bottom-[7.5rem] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 text-white/70 transition-colors hover:text-white md:flex"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40 pt-2 transition-colors group-hover:border-gold">
          <span className="h-2 w-1 rounded-full bg-gold motion-safe:animate-[g4v-wheel_1.8s_ease-in-out_infinite]" />
        </span>
        <span className="label-caps !text-[0.62rem]">{t.scroll}</span>
      </motion.a>

      <motion.div style={{ y: globeY }} className="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
        <GlobeHorizon className="h-40 w-full md:h-56" />
      </motion.div>
    </section>
  );
}
