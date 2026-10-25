"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import type { Dict } from "@/lib/content";
import type { FeedbackItem, FeedbackKind } from "@/lib/feedback";
import type { GalleryPhoto } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "./ui/Section";
import { Icon, type IconName } from "./ui/Icon";
import { ButtonLink } from "./ui/Button";
import { LogoSymbol } from "./brand/Logo";
import { Lightbox } from "./Gallery";

const ease = [0.22, 1, 0.36, 1] as const;

/** Columns of the diagram, in the order a student goes through them. */
const STAGES: { kind: FeedbackKind; icon: IconName; chip: string; ring: string }[] = [
  { kind: "shortlisted", icon: "star", chip: "bg-sky text-midnight", ring: "ring-sky/40" },
  { kind: "selected", icon: "check", chip: "bg-teal text-white", ring: "ring-teal/50" },
  { kind: "visa", icon: "plane", chip: "bg-gold text-midnight", ring: "ring-gold/50" },
];

/** Arrow between two columns: vertical on phones, horizontal from lg, with a travelling dot. */
function Arrow({ delay }: { delay: string }) {
  return (
    <span aria-hidden className="relative mx-auto block h-6 w-px lg:mx-0 lg:h-px lg:w-full lg:self-center">
      <span className="absolute inset-0 border-s-2 border-dashed border-white/20 lg:border-s-0 lg:border-t-2" />
      <span
        className={`absolute -start-[2px] top-0 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(245,179,1,0.6)] lg:-top-[2px] lg:start-auto motion-safe:animate-[g4v-flow-y_1.8s_ease-in-out_infinite] lg:motion-safe:animate-[g4v-flow-x_1.8s_ease-in-out_infinite] ${delay}`}
      />
    </span>
  );
}

/** Student results drawn as a journey: guidance → shortlisted → selected → visa. */
export function Feedback({
  lang,
  t,
  viewer,
  start,
  items,
}: {
  lang: Locale;
  t: Dict["feedback"];
  viewer: Dict["gallery"];
  start: string;
  items: FeedbackItem[];
}) {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const onIndex = useCallback((i: number) => setOpen(i), []);

  // Viewer order follows the diagram, column by column.
  const ordered = STAGES.flatMap((s) => items.filter((f) => f.kind === s.kind));
  const photos: GalleryPhoto[] = ordered.map((f) => ({
    src: f.src,
    width: f.width,
    height: f.height,
    tag: "milestones",
    alt: f.caption,
  }));
  const label = useCallback(
    (p: GalleryPhoto) => t.kinds[ordered.find((f) => f.src === p.src)!.kind],
    [ordered, t.kinds],
  );

  const reveal = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.5, delay: reduce ? 0 : i * 0.12, ease },
  });

  return (
    <section id="feedback" aria-labelledby="feedback-title" className="relative overflow-hidden bg-navy py-10 md:py-14">
      <div aria-hidden className="pattern-grings absolute inset-0 opacity-25 [mask-image:linear-gradient(180deg,black,transparent_60%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(45%_40%_at_15%_0%,rgba(245,179,1,0.14),transparent_70%)]" />

      <div className="container-brand relative">
        <SectionHeading tone="dark" align="center" id="feedback-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-0 lg:grid-cols-[minmax(0,0.75fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
          {/* Start of the journey */}
          <motion.div {...reveal(0)} className="flex flex-col items-center justify-center rounded-brand-lg bg-white/[0.04] p-4 text-center ring-1 ring-white/10">
            <span className="keep-light flex h-14 w-14 items-center justify-center rounded-full bg-white p-2 shadow-[0_0_0_6px_rgba(245,179,1,0.15)]">
              <LogoSymbol className="h-full w-auto" />
            </span>
            <p className="mt-3 text-sm font-semibold text-white">{t.start}</p>
            <p className="mt-1 text-xs leading-snug text-mist">{t.startText}</p>
          </motion.div>

          {STAGES.map((stage, si) => {
            const list = ordered.filter((f) => f.kind === stage.kind);
            return (
              <div key={stage.kind} className="contents">
                <Arrow delay={["", "[animation-delay:0.6s]", "[animation-delay:1.2s]"][si]} />
                <motion.div {...reveal(si + 1)} className={`rounded-brand-lg bg-white/[0.04] p-3 ring-1 ${stage.ring}`}>
                  <p className="flex items-center gap-2 px-1">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full ${stage.chip}`}>
                      <Icon name={stage.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-white">{t.kinds[stage.kind]}</span>
                    <span className="ms-auto rounded-full bg-white/10 px-2 py-0.5 text-[0.68rem] font-semibold text-mist">{list.length}</span>
                  </p>
                  <ul className="mt-3 space-y-2">
                    {list.map((f) => {
                      const index = ordered.indexOf(f);
                      return (
                        <li key={f.src}>
                          <button
                            type="button"
                            onClick={() => setOpen(index)}
                            aria-label={`${t.open}: ${f.caption}`}
                            className="group flex w-full items-center gap-3 rounded-xl bg-white/[0.04] p-1.5 text-start ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:ring-gold/50"
                          >
                            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-midnight ring-1 ring-white/20">
                              <Image src={f.src} alt="" fill sizes="96px" className="object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                            </span>
                            <span className="line-clamp-3 min-w-0 flex-1 text-xs leading-snug text-white/90">{f.caption}</span>
                            <Icon name="plus" className="me-1 h-3.5 w-3.5 shrink-0 text-mist transition-colors group-hover:text-gold" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Note and call to action */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-brand-lg bg-white/[0.04] px-4 py-3 ring-1 ring-white/10 sm:flex-row">
          <p className="flex items-start gap-2 text-xs text-mist">
            <Icon name="check" className="mt-px h-3.5 w-3.5 shrink-0 text-gold" />
            {t.note}
          </p>
          <ButtonLink href={`/${lang}/apply`} arrow className="shrink-0 !py-2.5">
            {start}
          </ButtonLink>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox photos={photos} index={open} t={viewer} label={label} onClose={() => setOpen(null)} onIndex={onIndex} />
        )}
      </AnimatePresence>
    </section>
  );
}
