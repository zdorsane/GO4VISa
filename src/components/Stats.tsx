"use client";

import { animate, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { useEffect, useRef, useState } from "react";
import type { Dict, Stat } from "@/lib/content";
import { Reveal } from "./ui/Reveal";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      <span aria-hidden>
        {(reduce ? value : display).toLocaleString("en-US")}
        <span className="text-gold">{suffix}</span>
      </span>
    </span>
  );
}

function StatValue({ stat }: { stat: Stat }) {
  if (typeof stat.value === "string") {
    return <span className="block text-balance text-xl leading-tight md:text-2xl">{stat.value}</span>;
  }
  return <Counter value={stat.value} suffix={stat.suffix} />;
}

export function Stats({ t }: { t: Dict["stats"] }) {
  return (
    <section aria-label={t.label} className="relative z-10 -mt-16 md:-mt-20">
      <div className="container-brand">
        <Reveal className="mx-auto grid max-w-3xl overflow-hidden rounded-brand-lg bg-white shadow-[0_30px_60px_-25px_rgba(11,45,91,0.35)] ring-1 ring-line sm:grid-cols-2">
          {t.items.map((s, i) => (
            <div
              key={s.label}
              className={`group relative flex flex-col items-center justify-center px-6 py-6 text-center md:py-7 ${
                i > 0 ? "border-t border-line sm:border-s sm:border-t-0" : ""
              }`}
            >
              <span
                aria-hidden
                className="absolute inset-x-8 top-0 h-0.5 origin-center scale-x-0 bg-linear-to-r from-teal to-sky transition-transform duration-500 group-hover:scale-x-100"
              />
              <p className="text-2xl font-bold text-midnight md:text-3xl">
                <StatValue stat={s} />
              </p>
              <p className="label-caps mt-3 !text-[0.68rem] text-slate">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
