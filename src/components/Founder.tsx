"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";
import { Icon, type IconName } from "./ui/Icon";
import { ButtonLink } from "./ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

function Badge({
  icon,
  children,
  className,
  float,
  delay,
}: {
  icon: IconName;
  children: React.ReactNode;
  className: string;
  float: number;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -float, 0] }}
        transition={{ duration: 4 + float / 4, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex items-center gap-3 rounded-2xl bg-white/90 py-2.5 pe-4 ps-2.5 shadow-[0_20px_45px_-15px_rgba(11,45,91,0.45)] ring-1 ring-white backdrop-blur-md"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-midnight text-gold">
          <Icon name={icon} className="h-4.5 w-4.5" />
        </span>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Founder({ lang, t, start }: { lang: Locale; t: Dict["founder"]; start: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -30, reduce ? 0 : 30]);
  const photoScale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 1.12, 1]);
  const cardY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 30, reduce ? 0 : -30]);
  const words = t.quote.split(" ");

  return (
    <section ref={ref} id="founder" aria-labelledby="founder-title" className="relative overflow-x-clip bg-white py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -start-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(0,168,203,0.12),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -end-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.12),transparent_65%)]" />

      <div className="container-brand relative grid grid-cols-[minmax(0,1fr)] items-center gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-24">
        {/* Portrait */}
        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto w-full max-w-[22rem] sm:max-w-[25rem]"
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
            className="absolute inset-0 translate-x-5 translate-y-5 rotate-3 rounded-[2rem] bg-linear-to-br from-midnight via-ocean to-teal shadow-[0_40px_80px_-30px_rgba(11,45,91,0.6)]"
          />

          {/* photo */}
          <motion.div
            variants={{
              hidden: { clipPath: "inset(100% 0% 0% 0% round 2rem)" },
              show: { clipPath: "inset(0% 0% 0% 0% round 2rem)", transition: { duration: 1.1, ease } },
            }}
            className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-midnight shadow-[0_30px_60px_-25px_rgba(11,45,91,0.55)]"
          >
            <motion.div style={{ y: photoY, scale: photoScale }} className="absolute -inset-y-8 inset-x-0">
              <Image
                src="/founder/mahdi-sedira.webp"
                alt={t.photoAlt}
                fill
                sizes="(min-width: 640px) 25rem, 22rem"
                className="object-cover object-[50%_30%]"
              />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-midnight/90 via-midnight/40 to-transparent px-6 pb-6 pt-20">
              <p className="text-lg font-semibold text-white">{t.name}</p>
              <p className="text-sm text-gold">{t.role}</p>
            </div>
          </motion.div>

          <Badge icon="globe" float={8} delay={0.5} className="-start-4 top-8 sm:-start-12">
            <span>
              <span className="block bg-linear-to-r from-ocean to-teal bg-clip-text text-xl font-bold leading-none text-transparent">
                {t.badges.countries.value}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-slate">{t.badges.countries.label}</span>
            </span>
          </Badge>
          <Badge icon="pulse" float={10} delay={0.7} className="-end-4 top-[42%] sm:-end-14">
            <span className="text-sm font-semibold text-midnight">{t.badges.doctor}</span>
          </Badge>
          <Badge icon="plane" float={7} delay={0.9} className="-start-4 bottom-28 sm:-start-10">
            <span className="text-sm font-semibold text-midnight">{t.badges.traveler}</span>
          </Badge>
        </motion.div>

        {/* Story */}
        <div>
          <Reveal>
            <p className="label-caps text-ocean">{t.eyebrow}</p>
            <h2 id="founder-title" className="mt-3 text-4xl font-bold leading-tight text-midnight md:text-6xl">
              {t.name}
            </h2>
            <p className="mt-3 flex items-center gap-3 font-semibold text-ocean">
              <span aria-hidden className="h-0.5 w-10 rounded-full bg-linear-to-r from-gold to-amber" />
              {t.role}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-xl font-medium leading-relaxed text-midnight md:text-2xl">{t.lead}</p>
            <p className="mt-5 text-lg leading-relaxed text-slate">{t.body}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <figure className="pattern-grings relative mt-10 overflow-hidden rounded-brand-lg p-7 text-white md:p-9">
              <div aria-hidden className="absolute inset-0 bg-linear-to-br from-midnight via-midnight/95 to-navy/95" />
              <div aria-hidden className="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.3),transparent_65%)]" />
              <Icon name="quote" className="relative h-9 w-9 text-gold" />
              <blockquote className="relative mt-4 text-xl font-semibold leading-snug md:text-2xl">
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
              <figcaption className="relative mt-6 flex items-center gap-3 text-sm text-mist">
                <span aria-hidden className="h-px w-8 bg-gold" />
                <span>
                  <span className="font-semibold text-white">{t.name}</span> · {t.role}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <ButtonLink href={`/${lang}#contact`} arrow>
              {start}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
