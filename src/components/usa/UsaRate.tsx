"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Counter } from "@/components/Stats";
import { useReducedMotion } from "@/lib/motion";

const R = 88;
const C = 2 * Math.PI * R;

/** Dial that fills up to the rate while the number counts up, once it scrolls into view. */
export function UsaRate({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const target = C * (1 - value / 100);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[19rem]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="usa-rate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--g4v-gold)" />
            <stop offset="100%" stopColor="var(--g4v-sky)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="10" />
        <motion.circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="url(#usa-rate)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: reduce ? target : C }}
          animate={inView ? { strokeDashoffset: target } : undefined}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-6xl font-extrabold leading-none text-white md:text-7xl">
          <Counter value={value} suffix="%" />
        </p>
        <p className="mt-3 max-w-[11rem] text-xs font-bold uppercase tracking-[0.2em] text-mist rtl:tracking-normal">{label}</p>
      </div>
    </div>
  );
}
