"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import type { Destination } from "@/lib/destinations";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { DestinationFacts } from "./DestinationFacts";
import { SectionHeading } from "./ui/Section";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";

/** Light section (follows the site theme): one card per country, opening its flagship programme. */
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
      className="relative overflow-hidden bg-white py-12 md:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -end-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(0,168,203,0.12),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.10),transparent_65%)]"
      />

      <div className="container-brand relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="destinations-title" eyebrow={t.eyebrow} title={t.title} />
          <Reveal>
            <p className="max-w-sm text-sm text-slate">
              {t.select} {t.disclaimer}
            </p>
          </Reveal>
        </div>

        <LayoutGroup>
          <ul className="mt-8 grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  className={`overflow-hidden rounded-brand-lg ring-1 transition-[background-color,box-shadow] duration-300 ${
                    isOpen
                      ? "bg-white shadow-[0_25px_50px_-25px_rgba(11,45,91,0.35)] ring-gold/60 sm:col-span-2 lg:col-span-3"
                      : "bg-cloud ring-line hover:shadow-[0_15px_35px_-25px_rgba(11,45,91,0.4)] hover:ring-teal/40"
                  }`}
                >
                  <motion.h3 layout={!reduce ? "position" : false}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : d.slug)}
                      className="group flex w-full items-center gap-3.5 p-4 text-start"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/flags/${d.flag}.svg`}
                        alt=""
                        width={48}
                        height={48}
                        className={`h-10 w-10 shrink-0 rounded-full object-cover ring-2 transition-transform duration-300 group-hover:scale-110 ${
                          isOpen ? "ring-gold" : "ring-line"
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-bold tracking-widest text-ocean">{d.code}</span>
                          <span className="text-base font-semibold text-midnight">{d.country}</span>
                        </span>
                        <span className="mt-0.5 block text-sm text-slate">{d.programme}</span>
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-300 ${
                          isOpen ? "rotate-45 bg-gold text-midnight ring-gold" : "text-midnight ring-line group-hover:ring-teal"
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
                        <div className="border-t border-line p-5 md:p-8">
                          <p className="label-caps text-ocean">{t.flagship}</p>
                          <p className="mt-2 text-2xl font-semibold text-midnight">{d.programme}</p>
                          <div className="mt-6">
                            <DestinationFacts d={d} t={t} />
                          </div>
                          <Link
                            href={`/${lang}/destinations/${d.slug}`}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ocean underline-offset-4 hover:underline"
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

        <p className="mt-8 text-center text-xs text-slate">
          {t.footnote} {t.disclaimer}
        </p>
      </div>
    </section>
  );
}
