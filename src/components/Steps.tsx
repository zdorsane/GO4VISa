"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { useRef } from "react";
import type { Dict } from "@/lib/content";
import { SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon, type IconName } from "./ui/Icon";

/** The four-step journey on a light surface (follows the site theme). */
export function Steps({ t }: { t: Dict["steps"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const width = useTransform(progress, (v) => `${(reduce ? 1 : v) * 100}%`);

  return (
    <section id="how-it-works" aria-labelledby="steps-title" className="pattern-icons relative overflow-hidden py-12 md:py-16">
      <div className="container-brand relative">
        <SectionHeading
          align="center"
          id="steps-title"
          eyebrow={t.eyebrow}
          title={t.title}
        />

        <div ref={ref} className="relative mt-10">
          {/* connecting route (desktop) */}
          <div aria-hidden className="absolute inset-x-[12.5%] top-8 hidden h-px md:block">
            <div className="h-full w-full border-t-2 border-dotted border-line" />
            <motion.div style={{ width }} className="absolute inset-y-0 start-0 border-t-2 border-dotted border-gold">
              <Icon
                name="plane"
                className="absolute -end-3 -top-[13px] h-6 w-6 rotate-45 text-gold rtl:-scale-x-100"
              />
            </motion.div>
          </div>

          <ol className="relative grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-6">
          {t.items.map((s, i) => (
            <Reveal
              as="li"
              key={s.key}
              delay={i * 0.12}
              className="relative flex items-start gap-4 rounded-brand-lg text-start max-md:bg-white max-md:p-4 max-md:ring-1 max-md:ring-line md:block md:text-center"
            >
              <div className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white md:mx-auto md:h-16 md:w-16 shadow-[0_15px_30px_-15px_rgba(11,45,91,0.45)] ring-1 ring-line transition-all duration-300 hover:ring-gold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-midnight text-gold transition-transform duration-300 group-hover:scale-110 md:h-11 md:w-11">
                  <Icon name={s.icon as IconName} className="h-4 w-4 md:h-5 md:w-5" />
                </span>
              </div>
              <div className="min-w-0">
              <p className="label-caps !text-[0.65rem] text-ocean md:mt-4">{t.stepLabel} {i + 1}</p>
              <h3 className="mt-1 text-base font-semibold text-midnight md:mt-1.5 md:text-xl">{s.label}</h3>
              <p className="mt-1 text-sm font-semibold text-midnight md:mx-auto md:mt-2 md:max-w-xs">{s.title}</p>
              <p className="mt-1 text-sm text-slate md:mx-auto md:mt-1.5 md:max-w-xs">{s.text}</p>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
