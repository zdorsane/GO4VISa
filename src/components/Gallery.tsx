"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { Dict } from "@/lib/content";
import type { GalleryPhoto } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";
import { ButtonLink, buttonClasses } from "./ui/Button";

const INITIAL = 8;
const ease = [0.22, 1, 0.36, 1] as const;

function Lightbox({
  photos,
  index,
  t,
  onClose,
  onIndex,
}: {
  photos: GalleryPhoto[];
  index: number;
  t: Dict["gallery"];
  onClose: () => void;
  onIndex: (i: number, dir: number) => void;
}) {
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [dir, setDir] = useState(0);
  const photo = photos[index];
  const total = photos.length;

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      onIndex((index + delta + total) % total, delta);
    },
    [index, total, onIndex],
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        // keep keyboard focus inside the viewer
        const items = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const slide = reduce ? 0 : 80;

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={t.viewer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex flex-col bg-navy/95 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-sm font-semibold tracking-widest text-mist" aria-live="polite">
          {String(index + 1).padStart(2, "0")} <span className="text-white/30">/</span> {String(total).padStart(2, "0")}
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-gold hover:text-midnight"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <motion.div
            key={photo.src}
            custom={dir}
            initial={{ opacity: 0, x: dir * slide, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -slide, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: 0.35, ease }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              else if (info.offset.x > 70) go(-1);
            }}
            className="flex max-h-full cursor-grab items-center justify-center active:cursor-grabbing"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="100vw"
              draggable={false}
              className="h-auto max-h-[72svh] w-auto max-w-full select-none rounded-brand object-contain shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t.prev}
          className="absolute start-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-gold hover:text-midnight sm:flex"
        >
          <Icon name="arrow" className="h-5 w-5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t.next}
          className="absolute end-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-gold hover:text-midnight sm:flex"
        >
          <Icon name="arrow" className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pb-6 pt-4 sm:px-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t.prev}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 sm:hidden"
        >
          <Icon name="arrow" className="h-5 w-5 rotate-180" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <span className="label-caps !text-[0.62rem] text-gold">{t.tags[photo.tag]}</span>
          <p className="mt-1 text-sm text-white/90 md:text-base">{photo.alt}</p>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t.next}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 sm:hidden"
        >
          <Icon name="arrow" className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

/** Endless ribbon of photos; the list is rendered twice so the loop is seamless. */
function Ribbon({
  items,
  reverse,
  duration,
  t,
  onOpen,
}: {
  items: { p: GalleryPhoto; i: number }[];
  reverse?: boolean;
  duration: string;
  t: Dict["gallery"];
  onOpen: (i: number) => void;
}) {
  return (
    <div className="group/ribbon overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={`flex w-max motion-safe:animate-[g4v-marquee_var(--dur)_linear_infinite] group-hover/ribbon:[animation-play-state:paused] ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
        style={{ "--dur": duration } as React.CSSProperties}
      >
        {[0, 1].map((copy) =>
          items.map(({ p, i }) => (
            <div key={`${copy}-${p.src}`} className="shrink-0 pe-3 md:pe-4" aria-hidden={copy === 1 || undefined}>
              <button
                type="button"
                tabIndex={copy === 1 ? -1 : undefined}
                onClick={() => onOpen(i)}
                aria-label={`${t.open}: ${p.alt}`}
                className="group/photo relative block h-32 overflow-hidden rounded-2xl shadow-[0_15px_35px_-20px_rgba(11,45,91,0.6)] ring-1 ring-white/60 sm:h-40 md:h-52"
                style={{ aspectRatio: `${p.width} / ${p.height}` }}
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 360px, 220px"
                  className="object-cover transition-transform duration-700 group-hover/photo:scale-110"
                />
                <span className="absolute inset-0 bg-linear-to-t from-midnight/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100" />
              </button>
            </div>
          )),
        )}
      </div>
    </div>
  );
}

/** Masonry tile: curtain reveal on scroll, 3D tilt and glare following the mouse. */
function Tile({
  p,
  i,
  t,
  reduce,
  onOpen,
}: {
  p: GalleryPhoto;
  i: number;
  t: Dict["gallery"];
  reduce: boolean;
  onOpen: (i: number) => void;
}) {
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 55%)`;

  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 12);
    rx.set((0.5 - y) * 12);
    gx.set(x * 100);
    gy.set(y * 100);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const delay = reduce ? 0 : (i % 4) * 0.1;
  return (
    <motion.li
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease } } }}
      className="mb-3 break-inside-avoid [perspective:1000px] md:mb-5"
    >
      <motion.button
        type="button"
        onClick={() => onOpen(i)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        aria-label={`${t.open}: ${p.alt}`}
        style={{ rotateX: rx, rotateY: ry }}
        className="group relative block w-full overflow-hidden rounded-brand-lg bg-midnight/5 shadow-[0_20px_40px_-25px_rgba(11,45,91,0.45)] ring-1 ring-black/5 transition-shadow duration-300 [transform-style:preserve-3d] hover:shadow-[0_35px_60px_-25px_rgba(11,45,91,0.6)]"
      >
        <motion.span
          className="block"
          variants={{ hidden: { scale: 1.25 }, show: { scale: 1, transition: { duration: 1.2, delay, ease } } }}
        >
          <Image
            src={p.src}
            alt=""
            width={p.width}
            height={p.height}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </motion.span>

        {/* curtain that slides away on reveal */}
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 origin-top bg-linear-to-b from-midnight to-navy"
            variants={{ hidden: { scaleY: 1 }, show: { scaleY: 0, transition: { duration: 0.9, delay: delay + 0.1, ease } } }}
          />
        )}

        {/* glare following the mouse */}
        <motion.span
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
        />

        <span className="label-caps absolute start-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 !text-[0.58rem] !tracking-[0.18em] text-midnight shadow-sm backdrop-blur md:start-3 md:top-3">
          {t.tags[p.tag]}
        </span>
        <span
          aria-hidden
          className="absolute end-3 top-3 hidden h-9 w-9 scale-75 items-center justify-center rounded-full bg-gold text-midnight opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 md:flex"
        >
          <Icon name="plus" className="h-4 w-4" />
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 hidden translate-y-3 bg-linear-to-t from-midnight/90 via-midnight/50 to-transparent px-4 pb-4 pt-12 text-start text-sm font-medium leading-snug text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:block"
        >
          {p.alt}
        </span>
      </motion.button>
    </motion.li>
  );
}

export function Gallery({
  lang,
  t,
  start,
  photos,
}: {
  lang: Locale;
  t: Dict["gallery"];
  start: string;
  photos: GalleryPhoto[];
}) {
  const reduce = !!useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const shown = expanded ? photos : photos.slice(0, INITIAL);
  const onIndex = useCallback((i: number) => setOpen(i), []);
  const indexed = photos.map((p, i) => ({ p, i }));
  const rowA = indexed.filter((_, k) => k % 2 === 0);
  const rowB = indexed.filter((_, k) => k % 2 === 1);

  return (
    <section id="experiences" aria-labelledby="experiences-title" className="relative overflow-x-clip bg-cloud py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -end-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.12),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -start-40 bottom-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,168,203,0.12),transparent_65%)]" />

      <div className="container-brand relative">
        <SectionHeading id="experiences-title" align="center" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      </div>

      {/* endless photo ribbons, full width */}
      <Reveal className="relative mt-14 -rotate-2 space-y-3 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] md:space-y-4">
        <Ribbon items={rowA} duration="70s" t={t} onOpen={setOpen} />
        <Ribbon items={rowB} duration="80s" reverse t={t} onOpen={setOpen} />
      </Reveal>

      <div className="container-brand relative">
        <ul className="mt-16 columns-2 gap-3 md:mt-20 md:columns-3 md:gap-5 lg:columns-4">
          {shown.map((p, i) => (
            <Tile key={p.src} p={p} i={i} t={t} reduce={reduce} onOpen={setOpen} />
          ))}
        </ul>

        {photos.length > INITIAL && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className={buttonClasses("outline-dark", "bg-white")}
            >
              {expanded ? t.showLess : t.showMore}
              {!expanded && (
                <span className="rounded-full bg-midnight px-2 py-0.5 text-[0.7rem] text-gold">+{photos.length - INITIAL}</span>
              )}
              <Icon name="plus" className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-45" : ""}`} />
            </button>
          </div>
        )}

        <Reveal className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-5 rounded-brand-lg bg-white p-6 text-center shadow-[0_25px_50px_-30px_rgba(11,45,91,0.35)] ring-1 ring-line sm:flex-row sm:justify-between sm:p-8 sm:text-start">
          <p className="flex items-center gap-3 text-lg font-semibold text-midnight md:text-xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-midnight text-gold">
              <Icon name="plane" className="h-5 w-5" />
            </span>
            {t.cta}
          </p>
          <ButtonLink href={`/${lang}#contact`} arrow className="shrink-0">
            {start}
          </ButtonLink>
        </Reveal>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox photos={photos} index={open} t={t} onClose={() => setOpen(null)} onIndex={onIndex} />
        )}
      </AnimatePresence>
    </section>
  );
}
