"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import type { Dict } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";

const ease = [0.22, 1, 0.36, 1] as const;

function CountriesLabel({ t }: { t: Dict["founder"] }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="bg-linear-to-r from-gold to-amber bg-clip-text text-base font-bold leading-none text-transparent">
        {t.badges.countries.value}
      </span>
      <span className="text-xs font-medium text-mist">{t.badges.countries.label}</span>
    </span>
  );
}

/** Founder profile — the left half of the founder + contact section (dark background). */
export function FounderProfile({ t }: { t: Dict["founder"] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -24, reduce ? 0 : 24]);
  const photoScale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 1.12, 1]);
  const cardY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 20, reduce ? 0 : -20]);
  const words = t.quote.split(" ");

  return (
    <div ref={ref}>
      <Reveal>
        <p className="label-caps text-gold">{t.eyebrow}</p>
      </Reveal>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] items-center gap-8 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-9">
        {/* Portrait */}
        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto w-full max-w-[12rem]"
        >
          {/* orbit */}
          <svg
            aria-hidden
            viewBox="0 0 400 400"
            className="pointer-events-none absolute -inset-[14%] h-[128%] w-[128%] motion-safe:animate-[spin_60s_linear_infinite]"
          >
            <ellipse cx="200" cy="200" rx="190" ry="190" fill="none" stroke="#F5B301" strokeOpacity=".45" strokeWidth="1.5" strokeDasharray="0.1 8" strokeLinecap="round" />
            <circle cx="200" cy="10" r="5" fill="#F5B301" />
            <circle cx="390" cy="200" r="3.5" fill="#03B3E2" />
          </svg>

          {/* back card */}
          <motion.div
            aria-hidden
            style={{ y: cardY }}
            className="absolute inset-0 translate-x-4 translate-y-4 rotate-3 rounded-[1.75rem] bg-linear-to-br from-ocean via-teal to-sky/70 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
          />

          {/* photo */}
          <motion.div
            variants={{
              hidden: { clipPath: "inset(100% 0% 0% 0% round 1.75rem)" },
              show: { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", transition: { duration: 1.1, ease } },
            }}
            className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]"
          >
            <motion.div style={{ y: photoY, scale: photoScale }} className="absolute -inset-y-8 inset-x-0">
              <Image
                src="/founder/mahdi-sedira.webp"
                alt={t.photoAlt}
                fill
                sizes="12rem"
                className="object-cover object-[50%_30%]"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Name, role, short intro */}
        <Reveal delay={0.1} className="text-center sm:text-start">
          <h2 id="founder-title" className="text-2xl font-bold leading-tight text-white md:text-[2rem]">
            {t.name}
          </h2>
          <p className="mt-2 flex items-center justify-center gap-3 font-semibold text-gold sm:justify-start">
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-linear-to-r from-gold to-amber" />
            {t.role}
          </p>
          <p className="mt-4 text-base font-medium leading-relaxed text-white md:text-lg">{t.lead}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {[
              { icon: "globe" as const, label: <CountriesLabel t={t} /> },
              { icon: "pulse" as const, label: <span className="text-xs font-semibold text-white">{t.badges.doctor}</span> },
              { icon: "plane" as const, label: <span className="text-xs font-semibold text-white">{t.badges.traveler}</span> },
            ].map((b) => (
              <li
                key={b.icon}
                className="flex items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pe-3 ps-1.5 ring-1 ring-white/15 transition-colors hover:bg-white/10"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-midnight">
                  <Icon name={b.icon} className="h-3.5 w-3.5" />
                </span>
                {b.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <p className="mt-7 text-sm leading-relaxed text-mist md:text-base">{t.body}</p>
      </Reveal>

      <Reveal delay={0.2}>
        <figure className="relative mt-6 overflow-hidden rounded-brand-lg bg-white/[0.04] p-5 ring-1 ring-white/10 md:p-6">
          <div aria-hidden className="absolute -end-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.25),transparent_65%)]" />
          <Icon name="quote" className="relative h-7 w-7 text-gold" />
          <blockquote className="relative mt-3 text-base font-semibold leading-snug text-white md:text-lg">
            <p>
              {words.map((w, i) => (
                <Fragment key={i}>
                  <motion.span
                    initial={reduce ? false : { opacity: 0.15, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: reduce ? 0 : 0.3 + i * 0.07, ease }}
                    className="inline-block"
                  >
                    {w}
                  </motion.span>{" "}
                </Fragment>
              ))}
            </p>
          </blockquote>
          <figcaption className="relative mt-4 flex items-center gap-3 text-sm text-mist">
            <span aria-hidden className="h-px w-8 bg-gold" />
            <span>
              <span className="font-semibold text-white">{t.name}</span> · {t.role}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}
