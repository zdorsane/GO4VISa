"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flag } from "@/components/scholarships/Flag";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/motion";
import type { UsaSummerDict } from "@/lib/usa-summer";
import { summerPhotos } from "./photos";
import { SplitWords } from "./UsaMotion";

/** Starting tilt of each print (server and first paint use these, then they drift at random). */
const TILTS = [-6, 4, -3, 5, -4];
const EASE = [0.22, 1, 0.36, 1] as const;

/** Wall of pinned prints: every few seconds two swap places and one comes to the front, at random. */
export function UsaGallery({ t }: { t: UsaSummerDict["gallery"] }) {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(() => summerPhotos.map((_, i) => i));
  const [tilts, setTilts] = useState(TILTS);
  const [front, setFront] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => {
      setOrder((o) => {
        const next = [...o];
        const a = Math.floor(Math.random() * next.length);
        let b = Math.floor(Math.random() * (next.length - 1));
        if (b >= a) b++;
        [next[a], next[b]] = [next[b], next[a]];
        return next;
      });
      setTilts((ts) => ts.map(() => Math.round((Math.random() * 12 - 6) * 10) / 10));
      setFront(Math.floor(Math.random() * summerPhotos.length));
    }, 3200);
    return () => clearInterval(id);
  }, [reduce, paused]);

  return (
    <section className="pattern-flight relative isolate overflow-hidden bg-midnight py-20 md:py-28">
      <div aria-hidden className="absolute -end-24 top-0 -z-10 h-96 w-96 rounded-full bg-gold/15 blur-3xl motion-safe:animate-[g4v-drift-b_16s_ease-in-out_infinite]" />
      <div aria-hidden className="absolute -start-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-ocean/25 blur-3xl motion-safe:animate-[g4v-drift-a_14s_ease-in-out_infinite]" />
      <div className="container-brand">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="label-caps flex items-center justify-center gap-2 text-gold">
              <Flag code="us" className="h-3.5 w-5" />
              {t.eyebrow}
            </p>
          </Reveal>
          <SplitWords text={t.title} className="mt-3 text-3xl font-extrabold text-white md:text-5xl" />
          <Reveal delay={0.15}>
            <p className="mt-4 text-mist md:text-lg">{t.lead}</p>
          </Reveal>
        </div>

        <ul
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:flex lg:flex-nowrap lg:justify-center lg:gap-0"
        >
          {order.map((idx, pos) => {
            const p = summerPhotos[idx];
            const isFront = front === idx;
            return (
              <motion.li
                key={p.place}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 60, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                animate={{ rotate: isFront ? 0 : tilts[idx], scale: isFront ? 1.08 : 1, zIndex: isFront ? 20 : pos + 1 }}
                whileHover={{ rotate: 0, scale: 1.1, zIndex: 30 }}
                transition={{ duration: 0.9, ease: EASE, layout: { type: "spring", stiffness: 120, damping: 20 } }}
                className={`relative self-start ${pos === order.length - 1 ? "col-span-2 mx-auto w-1/2 sm:col-span-1 sm:w-auto" : ""} lg:mx-2 lg:w-52 xl:w-56 ${pos % 2 ? "lg:mt-12" : ""}`}
              >
                <figure className={`relative rounded-2xl bg-white p-2.5 pb-10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.75)] transition-shadow duration-500 keep-light ${isFront ? "ring-4 ring-gold/70" : ""}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <Image src={p.src} alt={p.place} fill placeholder="blur" sizes="(min-width: 1024px) 16rem, (min-width: 640px) 33vw, 50vw" className="object-cover" />
                  </div>
                  <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-midnight">
                    {p.place}
                    <Flag code="us" className="h-3 w-4.5" />
                  </figcaption>
                </figure>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
