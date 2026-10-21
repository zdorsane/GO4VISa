"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Dict } from "@/lib/content";
import { SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon, type IconName } from "./ui/Icon";

export function Steps({ t }: { t: Dict["steps"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const width = useTransform(progress, (v) => `${(reduce ? 1 : v) * 100}%`);

  return (
    <section
      id="how-it-works"
      aria-labelledby="steps-title"
      className="pattern-flight relative overflow-hidden py-24 md:py-32"
    >
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-midnight via-midnight/80 to-midnight" />
      <div className="container-brand relative">
        <SectionHeading
          tone="dark"
          align="center"
          id="steps-title"
          eyebrow={t.eyebrow}
          title={t.items.map((s) => s.title).join(" → ")}
        />

        <div ref={ref} className="relative mt-20">
          {/* connecting route (desktop) */}
          <div aria-hidden className="absolute inset-x-[12.5%] top-10 hidden h-px md:block">
            <div className="h-full w-full border-t-2 border-dotted border-white/20" />
            <motion.div style={{ width }} className="absolute inset-y-0 start-0 border-t-2 border-dotted border-gold">
              <Icon
                name="plane"
                className="absolute -end-3 -top-[13px] h-6 w-6 rotate-45 text-gold rtl:-scale-x-100"
              />
            </motion.div>
          </div>

          <ol className="relative grid gap-12 md:grid-cols-4 md:gap-6">
          {t.items.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.12} className="relative text-center">
              <div className="group mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-midnight ring-1 ring-white/20 transition-all duration-300 hover:ring-gold">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-gold transition-transform duration-300 group-hover:scale-110">
                  <Icon name={s.icon as IconName} className="h-7 w-7" />
                </span>
              </div>
              <p className="label-caps mt-6 text-sky">{t.stepLabel} {i + 1}</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-mist">{s.text}</p>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
