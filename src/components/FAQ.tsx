"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site, whatsappHref, type Dict, type FaqItem } from "@/lib/content";
import { SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon, type IconName } from "./ui/Icon";
import { buttonClasses } from "./ui/Button";

type Cat = "all" | FaqItem["cat"];
const CATS: Cat[] = ["all", "opportunities", "services", "process"];
const ease = [0.22, 1, 0.36, 1] as const;

function HelpCard({ t }: { t: Dict["faq"]["help"] }) {
  const whatsapp = whatsappHref();
  return (
    <div className="pattern-grings relative overflow-hidden rounded-brand-lg p-6 text-white md:p-7">
      <div aria-hidden className="absolute inset-0 bg-linear-to-br from-midnight via-midnight/95 to-navy/95" />
      <div aria-hidden className="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.25),transparent_65%)]" />
      <div className="relative">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-midnight">
          <Icon name="chat" className="h-6 w-6" />
        </span>
        <p className="mt-5 text-xl font-semibold">{t.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-mist">{t.text}</p>
        <div className="mt-6 flex flex-col gap-3">
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClasses("gold", "w-full")}>
              <Icon name="chat" className="h-4 w-4" />
              {t.whatsapp}
            </a>
          )}
          <a href={`mailto:${site.email}`} className={buttonClasses("outline-light", "w-full")}>
            <Icon name="mail" className="h-4 w-4" />
            {t.email}
          </a>
        </div>
      </div>
    </div>
  );
}

function Answer({ item, reduce }: { item: FaqItem; reduce: boolean }) {
  if (!item.steps) return <p className="leading-relaxed text-slate">{item.a}</p>;
  return (
    <div>
      <p className="leading-relaxed text-slate">{item.a}</p>
      <ol className="mt-4 space-y-0">
        {item.steps.map((step, i) => (
          <motion.li
            key={step}
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.1 + i * 0.07, ease }}
            className="relative flex items-center gap-3 pb-3 last:pb-0"
          >
            {i < item.steps!.length - 1 && (
              <span aria-hidden className="absolute start-[0.9375rem] top-8 bottom-0 w-px bg-linear-to-b from-gold to-gold/20" />
            )}
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-midnight text-xs font-bold text-gold">
              {i + 1}
            </span>
            <span className="rounded-full bg-cloud px-4 py-1.5 text-sm font-medium text-midnight ring-1 ring-line">{step}</span>
          </motion.li>
        ))}
      </ol>
      {item.outro && <p className="mt-4 leading-relaxed text-slate">{item.outro}</p>}
    </div>
  );
}

export function FAQ({ t }: { t: Dict["faq"] }) {
  const items = t.items as FaqItem[];
  const [cat, setCat] = useState<Cat>("all");
  const [open, setOpen] = useState<string | null>(items[0]?.q ?? null);
  const reduce = !!useReducedMotion();
  const uid = useId();

  const visible = items.map((item, index) => ({ item, index })).filter(({ item }) => cat === "all" || item.cat === cat);
  const count = (c: Cat) => (c === "all" ? items.length : items.filter((i) => i.cat === c).length);

  function choose(c: Cat) {
    setCat(c);
    const first = items.find((i) => c === "all" || i.cat === c);
    setOpen(first?.q ?? null);
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-x-clip bg-white py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -start-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,168,203,0.10),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -end-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.10),transparent_65%)]" />

      <div className="container-brand relative grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-16">
        {/* Intro, filters and help — sticky on large screens */}
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <span aria-hidden className="pointer-events-none absolute -top-16 start-0 select-none text-[11rem] font-bold leading-none text-midnight/[0.04] md:text-[14rem]">
            ?
          </span>
          <SectionHeading id="faq-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

          <Reveal delay={0.05}>
            <div
              role="group"
              aria-label={t.filterLabel}
              className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {CATS.map((c) => {
                const active = c === cat;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(c)}
                    className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      active ? "text-white" : "bg-cloud text-midnight ring-1 ring-line hover:ring-teal/50"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`${uid}-cat`}
                        aria-hidden
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
                        className="absolute inset-0 rounded-full bg-midnight shadow-[0_10px_25px_-10px_rgba(11,45,91,0.6)]"
                      />
                    )}
                    <span className="relative">{t.cats[c]}</span>
                    <span
                      className={`relative rounded-full px-2 py-0.5 text-[0.7rem] ${
                        active ? "bg-gold text-midnight" : "bg-white text-slate ring-1 ring-line"
                      }`}
                    >
                      {count(c)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 hidden lg:block">
            <HelpCard t={t.help} />
          </Reveal>
        </div>

        {/* Questions */}
        <div className="min-w-0">
          <motion.ul layout={!reduce} className="space-y-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map(({ item, index }) => {
                const isOpen = open === item.q;
                const btnId = `${uid}-q-${index}`;
                const panelId = `${uid}-a-${index}`;
                return (
                  <motion.li
                    key={item.q}
                    layout={!reduce}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease }}
                    className={`group/item relative overflow-hidden rounded-brand-lg bg-white ring-1 transition-[box-shadow,color] duration-300 ${
                      isOpen
                        ? "shadow-[0_25px_50px_-25px_rgba(11,45,91,0.35)] ring-teal/40"
                        : "ring-line hover:shadow-[0_15px_35px_-25px_rgba(11,45,91,0.4)] hover:ring-teal/30"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 start-0 w-1 origin-top bg-linear-to-b from-gold to-amber transition-transform duration-500 ${
                        isOpen ? "scale-y-100" : "scale-y-0"
                      }`}
                    />
                    <h3>
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : item.q)}
                        className="flex w-full items-center gap-4 p-5 text-start md:p-6"
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                            isOpen ? "bg-gold text-midnight" : "bg-cloud text-midnight ring-1 ring-line group-hover/item:text-ocean"
                          }`}
                        >
                          <Icon name={item.icon as IconName} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.7rem] font-semibold tracking-widest text-ocean">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="mt-0.5 block break-words text-base font-semibold leading-snug text-midnight hyphens-auto md:text-lg">{item.q}</span>
                        </span>
                        <span
                          aria-hidden
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-300 ${
                            isOpen ? "rotate-45 bg-midnight text-gold ring-midnight" : "text-midnight ring-line group-hover/item:ring-teal"
                          }`}
                        >
                          <Icon name="plus" className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={btnId}
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 md:pe-8 md:ps-[5.25rem]">
                            <Answer item={item} reduce={reduce} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>

          <Reveal className="mt-8 lg:hidden">
            <HelpCard t={t.help} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
