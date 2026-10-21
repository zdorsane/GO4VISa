"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { Destination } from "@/lib/destinations";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { DestinationFacts } from "./DestinationFacts";
import { SectionHeading } from "./ui/Section";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";

export function Destinations({
  lang,
  t,
  destinations,
}: {
  lang: Locale;
  t: Dict["destinations"];
  destinations: Destination[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 30 };

  return (
    <section
      id="destinations"
      aria-labelledby="destinations-title"
      className="relative overflow-hidden bg-navy py-24 md:py-32"
    >
      <div aria-hidden className="pattern-grings absolute inset-0 opacity-40 [mask-image:linear-gradient(180deg,black,transparent_45%)]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_40%_at_80%_10%,rgba(0,168,203,0.25),transparent_70%)]"
      />

      <div className="container-brand relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            tone="dark"
            id="destinations-title"
            eyebrow={t.eyebrow}
            title={t.title}
          />
          <Reveal>
            <p className="max-w-sm text-sm text-mist">
              {t.select} {t.disclaimer}
            </p>
          </Reveal>
        </div>

        <LayoutGroup>
          <ul className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => {
              const isOpen = open === d.slug;
              const panelId = `dest-panel-${d.slug}`;
              return (
                <motion.li
                  key={d.slug}
                  layout={!reduce}
                  transition={{ layout: transition, default: { duration: 0.5, delay: reduce ? 0 : i * 0.05 } }}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  className={`overflow-hidden rounded-brand-lg ring-1 transition-colors duration-300 ${
                    isOpen
                      ? "bg-midnight ring-gold/60 sm:col-span-2 lg:col-span-3"
                      : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.08] hover:ring-gold/50"
                  }`}
                >
                  <motion.h3 layout={!reduce ? "position" : false}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : d.slug)}
                      className="group flex w-full items-center gap-4 p-5 text-start"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/flags/${d.flag}.svg`}
                        alt=""
                        width={48}
                        height={48}
                        className={`h-12 w-12 shrink-0 rounded-full object-cover ring-2 transition-transform duration-300 group-hover:scale-110 ${
                          isOpen ? "ring-gold" : "ring-white/20"
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-bold tracking-widest text-gold">{d.code}</span>
                          <span className="text-lg font-semibold text-white">{d.country}</span>
                        </span>
                        <span className="mt-0.5 block text-sm text-mist">{d.programme}</span>
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-300 ${
                          isOpen ? "rotate-45 bg-gold text-midnight ring-gold" : "text-white ring-white/20 group-hover:ring-gold/60"
                        }`}
                        aria-hidden
                      >
                        <Icon name="plus" className="h-4 w-4" />
                      </span>
                    </button>
                  </motion.h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-label={`${d.country}: ${d.programme}`}
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="border-t border-white/10 p-5 md:p-8">
                          <p className="label-caps text-gold">{t.flagship}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{d.programme}</p>
                          <div className="mt-6">
                            <DestinationFacts d={d} t={t} tone="dark" />
                          </div>
                          <Link
                            href={`/${lang}/destinations/${d.slug}`}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold underline-offset-4 hover:underline"
                          >
                            {t.fullDetails} {d.country}
                            <Icon name="arrow" className="h-4 w-4" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </LayoutGroup>

        <p className="mt-10 text-center text-sm text-mist">
          {t.footnote} {t.disclaimer}
        </p>
      </div>
    </section>
  );
}
