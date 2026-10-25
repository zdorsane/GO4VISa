"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { site, whatsappHref, type Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { GlobeHorizon } from "./brand/GlobeHorizon";
import { LogoSymbol } from "./brand/Logo";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";
import { ButtonLink } from "./ui/Button";

const channelIcon =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold ring-1 ring-white/15 transition-colors group-hover:bg-gold group-hover:text-midnight";

function PassField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate">{label}</p>
      <p className="mt-0.5 truncate font-semibold text-midnight">{value}</p>
    </div>
  );
}

/** "Start your journey" call to action, drawn as a boarding pass. */
function BoardingPass({ lang, t }: { lang: Locale; t: Dict["contact"]["journey"] }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* soft gold glow behind the pass */}
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(245,179,1,0.22),transparent)]" />

      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-brand-lg bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
      >
        {/* header strip */}
        <div className="flex items-center justify-between gap-3 bg-linear-to-r from-gold to-amber px-4 py-2 text-midnight sm:px-5">
          <span className="flex items-center gap-2.5">
            <span className="keep-light flex h-7 w-7 items-center justify-center rounded-full bg-white p-1">
              <LogoSymbol className="h-full w-auto" />
            </span>
            <span className="text-sm font-bold">Go4Visa</span>
          </span>
          <span className="label-caps !text-[0.6rem] !tracking-[0.22em]">{t.pass}</span>
        </div>

        {/* route */}
        <div className="px-4 pt-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate">{t.from}</p>
              <p className="mt-0.5 font-bold text-midnight sm:text-lg">{t.fromValue}</p>
            </div>
            <div aria-hidden className="relative flex h-8 min-w-12 flex-1 items-center">
              <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-midnight/20" />
              <span className="absolute top-1/2 -mt-1.5 h-3 w-3 rounded-full bg-gold motion-safe:animate-[g4v-flow-x_2.4s_ease-in-out_infinite]" />
              <span className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-midnight text-gold">
                <Icon name="plane" className="h-4 w-4 rtl:-scale-x-100" />
              </span>
            </div>
            <div className="min-w-0 text-end">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate">{t.to}</p>
              <p className="mt-0.5 font-bold text-midnight sm:text-lg">{t.toValue}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-cloud px-3 py-2 ring-1 ring-line">
            <PassField label={t.passenger} value={t.passengerValue} />
            <PassField label={t.session} value={t.sessionValue} />
            <PassField label={t.gate} value={t.gateValue} />
          </div>
        </div>

        {/* perforation */}
        <div aria-hidden className="relative my-3 h-6">
          <span className="absolute -start-3 top-0 h-6 w-6 rounded-full bg-midnight" />
          <span className="absolute -end-3 top-0 h-6 w-6 rounded-full bg-midnight" />
          <span className="absolute inset-x-5 top-1/2 border-t-2 border-dashed border-line" />
        </div>

        {/* stub */}
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <p className="text-lg font-bold text-midnight sm:text-xl">{t.title}</p>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-slate">{t.text}</p>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-3 sm:gap-2">
            {t.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-1.5 text-xs font-medium text-midnight">
                <Icon name="check" className="mt-px h-3.5 w-3.5 shrink-0 text-ocean" />
                {perk}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-4">
            <ButtonLink href={`/${lang}/apply`} arrow className="flex-1 !py-2.5 sm:flex-none">
              {t.cta}
            </ButtonLink>
            {/* decorative barcode */}
            <span
              aria-hidden
              className="ms-auto hidden h-8 w-24 opacity-70 sm:block"
              style={{
                background:
                  "repeating-linear-gradient(90deg,#0b2d5b 0 2px,transparent 2px 4px,#0b2d5b 4px 5px,transparent 5px 8px,#0b2d5b 8px 11px,transparent 11px 12px)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Contact({ lang, t: contact }: { lang: Locale; t: Dict["contact"] }) {
  const whatsapp = whatsappHref();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-midnight pb-24 pt-12 md:pb-32 md:pt-16"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_20%_20%,rgba(3,179,226,0.22),transparent_70%)]" />
      <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 w-full md:h-28" />

      <div className="container-brand grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <Reveal>
          <p className="label-caps text-gold">{contact.eyebrow}</p>
          <h2 id="contact-title" className="mt-3 text-2xl font-bold leading-tight text-white md:text-[2rem]">
            {contact.title}
          </h2>
          <p className="mt-3 text-sm text-mist md:text-base">{contact.lead}</p>

          <ul className="mt-6 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="group inline-flex min-w-0 max-w-full items-center gap-4 text-white">
                <span className={channelIcon}>
                  <Icon name="mail" className="h-5 w-5" />
                </span>
                <span className="break-all underline-offset-4 group-hover:underline">{site.email}</span>
              </a>
            </li>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-4 text-white">
                  <span className={channelIcon}>
                    <Icon name="chat" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wider text-mist">{contact.whatsapp}</span>
                    <span dir="ltr" className="underline-offset-4 group-hover:underline">{site.whatsappDisplay}</span>
                  </span>
                </a>
              </li>
            )}
            {/* Shown once site.phone and site.phoneHref are set in lib/content.ts */}
            {site.phoneHref && (
              <li>
                <a href={site.phoneHref} className="group inline-flex items-center gap-4 text-white">
                  <span className={channelIcon}>
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <span dir="ltr" className="underline-offset-4 group-hover:underline">{site.phone}</span>
                </a>
              </li>
            )}
            <li>
              <a href={site.url} className="group inline-flex items-center gap-4 text-white">
                <span className={channelIcon}>
                  <Icon name="web" className="h-5 w-5" />
                </span>
                <span className="underline-offset-4 group-hover:underline">www.go4visa.com</span>
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <BoardingPass lang={lang} t={contact.journey} />
        </Reveal>
      </div>
    </section>
  );
}
