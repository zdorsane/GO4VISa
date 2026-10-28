"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import type { Dict } from "@/lib/content";
import type { FeedbackItem, VisaItem } from "@/lib/feedback";
import type { GalleryPhoto } from "@/lib/gallery";
import { SectionHeading } from "./ui/Section";
import { Icon } from "./ui/Icon";
import { LogoSymbol } from "./brand/Logo";
import { Lightbox } from "./Gallery";

const ease = [0.22, 1, 0.36, 1] as const;

/** Ring radius of the diagram, in % of its width. */
const RING = 40;

/**
 * Every student story as one hub-and-spoke diagram: Go4Visa in the centre, small
 * photo thumbnails on a ring around it. Hover shows the caption, a click opens the viewer.
 */
function StoryDiagram({ t, items, onOpen }: { t: Dict["feedback"]; items: FeedbackItem[]; onOpen: (i: number) => void }) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const nodes = items.map((f, i) => {
    const a = (i / items.length) * 2 * Math.PI - Math.PI / 2;
    // rounded so the server and the browser render identical positions
    const round = (n: number) => Math.round(n * 1000) / 1000;
    return { f, x: round(50 + RING * Math.cos(a)), y: round(50 + RING * Math.sin(a)) };
  });

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
        {/* spokes and orbit */}
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx="50" cy="50" r={RING} fill="none" stroke="rgba(245,179,1,0.18)" strokeWidth="0.25" strokeDasharray="0.8 1.2" />
          <circle cx="50" cy="50" r={RING - 14} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" />
          {nodes.map(({ x, y }, i) => {
            const d = `M50 50 L${x} ${y}`;
            const on = active === i;
            return (
              <g key={i}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke={on ? "rgba(245,179,1,0.9)" : "rgba(255,255,255,0.16)"}
                  strokeWidth={on ? 0.35 : 0.2}
                  strokeDasharray="0.6 0.8"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease }}
                />
                {!reduce && i % 2 === 0 && (
                  <circle r="0.55" fill="#f5b301">
                    {/* negative begin: already in flight on load, never parked at the SVG origin */}
                    <animateMotion dur={`${2.6 + (i % 3) * 0.5}s`} repeatCount="indefinite" path={d} begin={`-${i * 0.25}s`} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* hub */}
        <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-midnight text-center shadow-[0_0_0_8px_rgba(245,179,1,0.08),0_0_60px_-10px_rgba(245,179,1,0.45)] ring-1 ring-gold/40">
          <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-gold/30 motion-safe:animate-[g4v-ping-soft_3s_ease-out_infinite]" />
          <span className="keep-light flex h-[34%] w-[34%] items-center justify-center rounded-full bg-white p-[6%]">
            <LogoSymbol className="h-full w-auto" />
          </span>
          <span className="mt-[6%] text-xl font-bold leading-none text-gold sm:text-2xl">{items.length}</span>
          <span className="mt-1 px-2 text-[0.5rem] font-semibold uppercase leading-tight tracking-[0.16em] text-mist sm:text-[0.56rem]">
            {t.stories}
          </span>
        </div>

        {/* photo nodes */}
        <ul>
          {nodes.map(({ f, x, y }, i) => (
            <motion.li
              key={f.src}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.06, ease }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <button
                type="button"
                onClick={() => onOpen(i)}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${t.open}: ${f.caption}`}
                className={`group relative block h-12 w-12 overflow-hidden rounded-2xl bg-midnight shadow-[0_12px_28px_-10px_rgba(0,0,0,0.8)] ring-2 transition-all duration-300 focus-visible:outline-none sm:h-14 sm:w-14 ${
                  active === i ? "z-10 scale-110 ring-gold" : "ring-white/25 hover:ring-gold"
                }`}
              >
                <Image src={f.src} alt="" fill sizes="80px" className="object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute inset-0 bg-midnight/25 transition-opacity duration-300 group-hover:opacity-0" />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* caption of the hovered story */}
      <p aria-live="polite" className="mx-auto mt-3 flex min-h-10 max-w-md items-center justify-center gap-2 px-2 text-center text-xs text-mist">
        {active !== null ? (
          <>
            <Icon name="check" className="h-4 w-4 shrink-0 text-gold" />
            <span className="text-white">{items[active].caption}</span>
          </>
        ) : (
          <>
            <Icon name="plus" className="h-4 w-4 shrink-0 text-gold" />
            {t.hint}
          </>
        )}
      </p>
    </div>
  );
}

/** Horizontal, swipeable row of visa stickers; each card opens the photo viewer. */
function VisaWall({ t, visas, onOpen }: { t: Dict["feedback"]; visas: VisaItem[]; onOpen: (i: number) => void }) {
  const track = useRef<HTMLUListElement>(null);
  const reduce = !!useReducedMotion();

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 280;
    el.scrollBy({ left: (step + 16) * dir * (rtl ? -1 : 1), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div id="feedback-visas" className="min-w-0 scroll-mt-24" role="region" aria-labelledby="feedback-visas-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold text-midnight shadow-[0_10px_30px_-10px_rgba(245,179,1,0.6)]"
          >
            <Icon name="plane" className="h-5 w-5 rtl:-scale-x-100" />
          </span>
          <div>
            <p className="label-caps !text-[0.65rem] text-gold">{t.visasEyebrow}</p>
            <h3 id="feedback-visas-title" className="mt-1 text-lg font-semibold text-white">
              {t.visasTitle}
            </h3>
          </div>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={t.scrollPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white ring-1 ring-white/20 transition-colors hover:bg-gold hover:text-midnight hover:ring-gold"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180 rtl:rotate-0" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={t.scrollNext}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white ring-1 ring-white/20 transition-colors hover:bg-gold hover:text-midnight hover:ring-gold"
          >
            <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="-mx-1 mt-4 flex snap-x snap-mandatory scroll-px-1 gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {visas.map((v, i) => {
          return (
            <li key={v.src} className="w-52 shrink-0 snap-start sm:w-58">
              <button
                type="button"
                onClick={() => onOpen(i)}
                aria-label={`${t.open}: ${t.visaGranted}`}
                className="group block w-full overflow-hidden rounded-brand bg-white/[0.04] text-start ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] hover:ring-gold/50"
              >
                <span className="relative block aspect-[7/5] overflow-hidden bg-midnight">
                  <Image
                    src={v.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 14.5rem, 13rem"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span aria-hidden className="absolute inset-0 bg-linear-to-t from-midnight/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 end-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white opacity-0 ring-1 ring-white/30 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    <Icon name="plus" className="h-4 w-4" />
                  </span>
                </span>
                <span className="flex items-center gap-2.5 border-t border-white/10 px-3 py-2.5">
                  <span className="keep-light flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white p-1">
                    <LogoSymbol className="h-full w-auto" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">Go4Visa</span>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold text-midnight">
                    <Icon name="check" className="h-3 w-3" />
                    {t.visaGranted}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Glass card holding the visa wall, beside the story diagram. */
function VisaPanel({ t, visas, onOpen }: { t: Dict["feedback"]; visas: VisaItem[]; onOpen: (i: number) => void }) {
  const reduce = !!useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease }}
      className="relative min-w-0 overflow-hidden rounded-brand-lg bg-white/[0.04] p-5 ring-1 ring-gold/30 shadow-[0_30px_60px_-35px_rgba(0,0,0,0.8)] md:p-6"
    >
      <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative">
        <VisaWall t={t} visas={visas} onOpen={onOpen} />
      </div>
    </motion.div>
  );
}

/** Student stories in one unified gallery, then visa support and the visa wall. */
export function Feedback({
  t,
  viewer,
  items,
  visas,
}: {
  t: Dict["feedback"];
  viewer: Dict["gallery"];
  items: FeedbackItem[];
  visas: VisaItem[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const onIndex = useCallback((i: number) => setOpen(i), []);
  const [openVisa, setOpenVisa] = useState<number | null>(null);
  const onVisaIndex = useCallback((i: number) => setOpenVisa(i), []);

  const photos: GalleryPhoto[] = items.map((f) => ({
    src: f.src,
    width: f.width,
    height: f.height,
    tag: "milestones",
    alt: f.caption,
  }));
  const label = useCallback(() => t.eyebrow, [t.eyebrow]);

  const visaPhotos: GalleryPhoto[] = visas.map((v) => ({
    src: v.src,
    width: v.width,
    height: v.height,
    tag: "milestones",
    alt: t.visaGranted,
  }));
  const visaLabel = useCallback(() => t.visaGranted, [t.visaGranted]);

  return (
    <section id="feedback" aria-labelledby="feedback-title" className="relative overflow-hidden bg-navy py-10 md:py-12">
      <div aria-hidden className="pattern-grings absolute inset-0 opacity-25 [mask-image:linear-gradient(180deg,black,transparent_60%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(45%_40%_at_15%_0%,rgba(245,179,1,0.14),transparent_70%)]" />

      <div className="container-brand relative">
        <SectionHeading tone="dark" align="center" id="feedback-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        {/* visa wall on the left, the story diagram on the right */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-10">
          <VisaPanel t={t} visas={visas} onOpen={setOpenVisa} />
          <StoryDiagram t={t} items={items} onOpen={setOpen} />
        </div>

        <p className="mx-auto mt-6 flex max-w-3xl items-start justify-center gap-2 text-center text-xs text-mist">
          <Icon name="check" className="mt-px h-3.5 w-3.5 shrink-0 text-gold" />
          {t.note}
        </p>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox photos={photos} index={open} t={viewer} label={label} onClose={() => setOpen(null)} onIndex={onIndex} />
        )}
        {openVisa !== null && (
          <Lightbox
            photos={visaPhotos}
            index={openVisa}
            t={viewer}
            label={visaLabel}
            onClose={() => setOpenVisa(null)}
            onIndex={onVisaIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
