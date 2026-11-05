"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flag } from "@/components/scholarships/Flag";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import type { UsaSummerDict } from "@/lib/usa-summer";
import { photos } from "./photos";
import { FlightPath } from "./UsaMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Postcards pinned over the skyline: tilted photos that drift slowly. */
const CARDS = [
  { photo: photos.santaMonicaPier, place: "Los Angeles", className: "end-0 top-0 w-64 -rotate-[5deg] xl:w-72", float: 10, delay: 0.9 },
  { photo: photos.timesSquare, place: "New York", className: "end-40 top-[15rem] w-56 rotate-[4deg] xl:end-52 xl:top-[16.5rem] xl:w-64", float: -8, delay: 1.05 },
  { photo: photos.route66, place: "Route 66", className: "end-4 top-[19.5rem] w-48 rotate-[8deg] xl:top-[21rem] xl:w-52", float: 6, delay: 1.2 },
];

/** Opening band: skyline at sunset with parallax, the campaign headline and both calls to action. */
export function UsaHero({ lang, t }: { lang: Locale; t: UsaSummerDict["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-midnight pb-24 pt-[calc(var(--g4v-header-h)+3rem)]">
      <motion.div aria-hidden style={reduce ? undefined : { y: bgY }} className="absolute inset-0 -z-20 scale-110">
        <Image src={photos.nycSunset.src} alt="" fill priority placeholder="blur" sizes="100vw" className="g4v-kenburns object-cover object-[60%_center]" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-midnight/95 via-midnight/70 to-midnight/10 rtl:bg-linear-to-l" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-midnight to-transparent" />
      <FlightPath />
      {/* a few stars twinkling over the sky */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {[
          "start-[8%] top-[22%]",
          "start-[46%] top-[14%]",
          "start-[62%] top-[30%] [animation-delay:1.2s]",
          "start-[30%] top-[78%] [animation-delay:0.6s]",
          "start-[85%] top-[12%] [animation-delay:1.8s]",
        ].map((pos) => (
          <span key={pos} className={`absolute h-1 w-1 rounded-full bg-gold shadow-[0_0_12px_3px_rgba(245,179,1,0.55)] motion-safe:animate-[g4v-twinkle_3.2s_ease-in-out_infinite] ${pos}`} />
        ))}
      </div>

      <motion.div style={reduce ? undefined : { opacity: fade }} className="container-brand grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="max-w-2xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pe-4 ps-2 text-xs font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/20 backdrop-blur-md rtl:tracking-normal"
          >
            <Flag code="us" className="h-4 w-6" />
            {t.label}
          </motion.p>

          <h1 className="mt-6 text-[2.6rem] font-extrabold uppercase leading-[0.98] tracking-tight text-white sm:text-6xl xl:text-[4.6rem] rtl:normal-case rtl:leading-[1.2]">
            {t.title.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: EASE }}
                  className={`block ${i === t.title.length - 1 ? "bg-linear-to-r from-gold via-amber to-[#ffd76a] bg-clip-text text-transparent" : ""}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            className="mt-6 max-w-xl text-lg text-white/85 md:text-xl"
          >
            {t.lead}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href={`/${lang}/apply`} className={buttonClasses("gold", "!px-7 !py-4 uppercase tracking-wider sm:whitespace-nowrap rtl:tracking-normal")}>
              {t.primary}
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <a href="#experience" className={buttonClasses("outline-light", "!px-7 !py-4 uppercase tracking-wider backdrop-blur-sm sm:whitespace-nowrap rtl:tracking-normal")}>
              {t.secondary}
              <Icon name="chevron" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        <motion.div aria-hidden style={reduce ? undefined : { y: cardsY }} className="relative hidden h-[33rem] lg:block">
          {CARDS.map((c) => (
            <motion.figure
              key={c.place}
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.9 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, c.float, 0], scale: 1 }}
              transition={{
                opacity: { duration: 0.8, delay: c.delay },
                scale: { duration: 0.8, delay: c.delay, ease: EASE },
                y: { duration: 7, delay: c.delay, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`absolute rounded-2xl bg-white p-2 pb-9 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] keep-light ${c.className}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={c.photo.src} alt="" fill placeholder="blur" sizes="18rem" className="object-cover" />
              </div>
              <figcaption className="absolute inset-x-3 bottom-2.5 flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-widest text-midnight">
                {c.place}
                <Flag code="us" className="h-3 w-4.5" />
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </motion.div>

      <a
        href="#experience"
        className="absolute bottom-4 start-1/2 flex -translate-x-1/2 flex-col items-center gap-2 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/60 hover:text-white rtl:translate-x-1/2"
      >
        {t.scroll}
        <span className="flex h-9 w-5 justify-center rounded-full ring-1 ring-white/40">
          <span className="mt-1.5 h-2 w-1 rounded-full bg-gold motion-safe:animate-bounce" />
        </span>
      </a>
    </section>
  );
}
