"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Dict, Service } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon, type IconName } from "./ui/Icon";
import { ButtonLink } from "./ui/Button";

type Modes = Dict["services"]["modes"];

/** The two ways Go4Visa helps, each drawn as a small flow: input → service → result. */
const FLOWS = [
  { key: "writing", icon: "pen", fromIcon: "user", toIcon: "check", delay: "" },
  { key: "review", icon: "search", fromIcon: "doc", toIcon: "list", delay: "[animation-delay:0.9s]" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

/** Dashed line with a dot travelling along it — vertical on mobile, horizontal from md. */
function Connector({ delay }: { delay: string }) {
  return (
    <span aria-hidden className="relative mx-auto block h-7 w-px md:h-px md:w-full">
      <span className="absolute inset-0 border-s-2 border-dashed border-white/20 md:border-s-0 md:border-t-2" />
      <span
        className={`absolute -start-[2px] top-0 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(245,179,1,0.6)] md:-top-[2px] md:start-auto motion-safe:animate-[g4v-flow-y_1.8s_ease-in-out_infinite] md:motion-safe:animate-[g4v-flow-x_1.8s_ease-in-out_infinite] ${delay}`}
      />
    </span>
  );
}

function Panel({
  lang,
  s,
  index,
  total,
  modes,
  t,
  active,
  reduce,
  tabId,
  panelId,
}: {
  lang: Locale;
  s: Service;
  index: number;
  total: number;
  modes: Modes;
  t: Dict["services"];
  active: boolean;
  reduce: boolean;
  tabId: string;
  panelId: string;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      aria-hidden={!active}
      inert={!active}
      className={`[grid-area:1/1] ${active ? "visible" : "invisible"}`}
    >
      <motion.div variants={container} initial={false} animate={active ? "show" : "hidden"} className="flex h-full flex-col">
        <motion.div variants={item} className="flex items-start gap-5">
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold text-midnight shadow-[0_15px_35px_-10px_rgba(245,179,1,0.6)]">
            <Icon name={s.icon as IconName} className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <p className="label-caps !text-[0.68rem] text-sky">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h3 className="mt-1.5 text-2xl font-semibold leading-snug text-white md:text-[1.75rem]">{s.title}</h3>
          </div>
        </motion.div>
        <motion.p variants={item} className="mt-5 max-w-2xl leading-relaxed text-mist">
          {s.text}
        </motion.p>

        <motion.p variants={item} className="label-caps mt-8 !text-[0.68rem] text-gold">
          {t.modesLabel}
        </motion.p>
        <ul className="mt-4 space-y-4">
          {FLOWS.map((f) => (
            <motion.li
              key={f.key}
              variants={item}
              className="grid items-center gap-0 rounded-brand bg-white/[0.03] p-3 ring-1 ring-white/10 md:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1.5fr)_2.25rem_minmax(0,1fr)] md:p-4"
            >
              <span className="flex items-center gap-2.5 rounded-xl px-2 py-1 text-sm text-mist">
                <Icon name={f.fromIcon} className="h-4.5 w-4.5 shrink-0 text-sky" />
                {modes[f.key].from}
              </span>
              <Connector delay={f.delay} />
              <span className="block rounded-xl bg-white p-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
                <span className="flex items-center gap-2 font-semibold text-midnight">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      f.key === "writing" ? "bg-midnight text-gold" : "bg-teal/15 text-ocean"
                    }`}
                  >
                    <Icon name={f.icon} className="h-4 w-4" />
                  </span>
                  {modes[f.key].label}
                </span>
                <span className="mt-1.5 block text-sm leading-snug text-slate">{s[f.key]}</span>
              </span>
              <Connector delay={f.delay} />
              <span className="flex items-center gap-2.5 rounded-xl bg-gold/10 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-gold/30">
                <Icon name={f.toIcon} className="h-4.5 w-4.5 shrink-0 text-gold" />
                {modes[f.key].to}
              </span>
            </motion.li>
          ))}
        </ul>

        {s.note && (
          <motion.p variants={item} className="mt-4 flex items-start gap-2.5 text-sm text-mist">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {s.note}
          </motion.p>
        )}

        <motion.div variants={item} className="mt-auto pt-8">
          <ButtonLink
            href={`/${lang}?service=${s.id}#contact`}
            arrow
            className="w-full sm:w-auto"
            aria-label={t.requestQuoteAria.replace("{name}", s.title)}
            tabIndex={active ? undefined : -1}
          >
            {t.requestQuote}
          </ButtonLink>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Services({ lang, t }: { lang: Locale; t: Dict["services"] }) {
  const [active, setActive] = useState(0);
  const reduce = !!useReducedMotion();
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const total = t.items.length;
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;

  function select(i: number, focus = false) {
    setActive(i);
    const tab = tabs.current[i];
    if (!tab) return;
    if (focus) tab.focus({ preventScroll: true });
    // Keep the chosen tab visible in the horizontal strip (mobile) without scrolling the page.
    const strip = list.current;
    if (strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left: tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2,
        behavior: reduce ? "auto" : "smooth",
      });
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: total - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select((keys[e.key] + total) % total, true);
  }

  return (
    <section id="services" aria-labelledby="services-title" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -end-40 top-20 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(0,168,203,0.12),transparent_65%)]"
      />
      <div className="container-brand relative">
        <SectionHeading id="services-title" align="center" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <Reveal className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-8">
          {/* Service picker: horizontal strip on small screens, vertical list from lg */}
          <div className="min-w-0">
            <p id={`${uid}-pick`} className="sr-only">
              {t.pick}
            </p>
            <div
              ref={list}
              role="tablist"
              aria-labelledby={`${uid}-pick`}
              onKeyDown={onKeyDown}
              className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {t.items.map((s, i) => {
                const selected = i === active;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    id={tabId(i)}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={panelId(i)}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    className={`group relative flex w-[15.5rem] shrink-0 snap-start items-center gap-4 rounded-brand p-4 text-start transition-colors duration-300 lg:w-full lg:p-5 ${
                      selected ? "text-white" : "bg-cloud text-midnight ring-1 ring-line hover:ring-teal/50"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`${uid}-active`}
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                        aria-hidden
                        className="absolute inset-0 rounded-brand bg-midnight shadow-[0_20px_40px_-20px_rgba(11,45,91,0.7)]"
                      />
                    )}
                    <span
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        selected ? "bg-gold text-midnight" : "bg-white text-midnight ring-1 ring-line group-hover:text-ocean"
                      }`}
                    >
                      <Icon name={s.icon as IconName} className="h-5 w-5" />
                    </span>
                    <span className="relative min-w-0 flex-1">
                      <span className={`block text-[0.7rem] font-semibold tracking-widest ${selected ? "text-gold" : "text-ocean"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-0.5 block font-semibold leading-snug">{s.title}</span>
                    </span>
                    <Icon
                      name="arrow"
                      className={`relative hidden h-4 w-4 shrink-0 transition-all duration-300 lg:block ${
                        selected ? "text-gold opacity-100" : "opacity-0 group-hover:translate-x-1 group-hover:opacity-60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quote card — under the list on large screens */}
            <div className="mt-6 hidden rounded-brand bg-cloud p-6 ring-1 ring-line lg:block">
              <p className="flex items-center gap-2 font-semibold text-midnight">
                <Icon name="chat" className="h-5 w-5 text-ocean" />
                {t.quote.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate">{t.quote.text}</p>
              <ButtonLink href={`/${lang}#contact`} variant="outline-dark" className="mt-5 w-full" arrow>
                {t.quote.cta}
              </ButtonLink>
            </div>
          </div>

          {/* Detail panel: every panel shares one grid cell so the height never jumps */}
          <div className="pattern-grings relative overflow-hidden rounded-brand-lg p-6 sm:p-8 md:p-10">
            <div aria-hidden className="absolute inset-0 bg-linear-to-br from-midnight via-midnight/95 to-navy/95" />
            <div
              aria-hidden
              className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(3,179,226,0.3),transparent_65%)]"
            />
            <div className="relative grid">
              {t.items.map((s, i) => (
                <Panel
                  key={s.id}
                  lang={lang}
                  s={s}
                  index={i}
                  total={total}
                  modes={t.modes}
                  t={t}
                  active={i === active}
                  reduce={reduce}
                  tabId={tabId(i)}
                  panelId={panelId(i)}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Quote banner — small and medium screens */}
        <Reveal className="mt-6 flex flex-col gap-5 rounded-brand bg-cloud p-6 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between lg:hidden">
          <div>
            <p className="flex items-center gap-2 font-semibold text-midnight">
              <Icon name="chat" className="h-5 w-5 text-ocean" />
              {t.quote.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate">{t.quote.text}</p>
          </div>
          <ButtonLink href={`/${lang}#contact`} variant="outline-dark" className="shrink-0" arrow>
            {t.quote.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
