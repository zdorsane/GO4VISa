import Image from "next/image";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";
import { Icon, type IconName } from "./ui/Icon";
import { ButtonLink } from "./ui/Button";

/** Tooltip placement keeps the first and last bubbles inside the card on phones. */
function tipPosition(i: number, last: number) {
  if (i === 0) return "start-0";
  if (i === last) return "end-0";
  return "left-1/2 -translate-x-1/2";
}

export function About({ lang, t: about }: { lang: Locale; t: Dict["about"] }) {
  const last = about.symbol.length - 1;
  return (
    <section id="about" aria-labelledby="about-title" className="pattern-icons relative overflow-x-clip py-12 md:py-14">
      <div className="container-brand grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        {/* Logo + what each part of the symbol means (hover / focus for the story) */}
        <Reveal className="relative order-last mx-auto w-full max-w-md lg:order-first lg:max-w-none">
          <div aria-hidden className="absolute -inset-3 rotate-2 rounded-brand-lg bg-linear-to-br from-teal/20 to-sky/5" />
          <div className="keep-light relative rounded-brand-lg bg-white px-5 pb-5 pt-7 shadow-[0_30px_60px_-30px_rgba(11,45,91,0.35)] ring-1 ring-line md:px-7">
            <Image
              src="/assets/go4visa-logo.jpg"
              alt={about.logoAlt}
              width={1280}
              height={1133}
              className="mx-auto h-auto w-full max-w-40"
              sizes="160px"
            />
            <p className="mt-5 text-center text-xs font-semibold text-midnight">{about.symbolTitle}</p>
            <ul className="mt-3 grid grid-cols-5 gap-1">
              {about.symbol.map((item, i) => (
                <li key={item.title} className="group relative">
                  <span
                    tabIndex={0}
                    aria-describedby={`about-symbol-${i}`}
                    className="flex cursor-default flex-col items-center gap-1.5 rounded-xl p-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-sky/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky/10 text-midnight ring-1 ring-line transition-colors duration-300 group-focus-within:bg-midnight group-focus-within:text-gold group-hover:bg-midnight group-hover:text-gold">
                      <Icon name={item.icon as IconName} className="h-5 w-5" />
                    </span>
                    <span className="text-[0.65rem] font-semibold leading-tight text-midnight">{item.title}</span>
                  </span>
                  <span
                    id={`about-symbol-${i}`}
                    role="tooltip"
                    className={`pointer-events-none absolute bottom-full z-10 mb-2 w-44 rounded-xl bg-midnight px-3 py-2 text-center text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 ${tipPosition(i, last)}`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <p className="label-caps text-ocean">{about.eyebrow}</p>
          <h2 id="about-title" className="mt-2 text-2xl font-semibold leading-tight text-midnight md:text-[1.9rem]">
            {about.title}
          </h2>
          <p className="mt-4 border-s-2 border-gold ps-4 text-base font-medium leading-relaxed text-midnight md:text-lg">{about.lead}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {about.pillars.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2.5 rounded-xl bg-white/80 px-3.5 py-2.5 text-sm font-medium text-midnight ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-teal/40"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-midnight text-gold">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-slate">{about.body}</p>
          <ButtonLink href={`/${lang}#services`} variant="midnight" className="mt-6" arrow>
            {about.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
