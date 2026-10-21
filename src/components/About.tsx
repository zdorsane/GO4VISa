import Image from "next/image";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";
import { Icon, type IconName } from "./ui/Icon";
import { ButtonLink } from "./ui/Button";

export function About({ lang, t: about }: { lang: Locale; t: Dict["about"] }) {
  return (
    <section id="about" aria-labelledby="about-title" className="pattern-icons relative overflow-x-clip py-24 md:py-32">
      <div className="container-brand">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-last lg:order-first">
            <div className="absolute -inset-4 -z-0 rotate-2 rounded-brand-lg bg-linear-to-br from-teal/20 to-sky/5" aria-hidden />
            <div className="relative overflow-hidden rounded-brand-lg bg-white p-10 shadow-[0_30px_60px_-30px_rgba(11,45,91,0.35)] ring-1 ring-line md:p-14">
              <Image
                src="/assets/go4visa-logo.jpg"
                alt={about.logoAlt}
                width={1280}
                height={1133}
                className="mx-auto h-auto w-full max-w-sm"
                sizes="(min-width: 1024px) 400px, 80vw"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="label-caps text-ocean">{about.eyebrow}</p>
              <h2 id="about-title" className="mt-3 text-3xl font-semibold leading-tight text-midnight md:text-[2.5rem]">
                {about.title}
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-midnight md:text-xl">{about.lead}</p>
              <p className="mt-4 leading-relaxed text-slate">{about.body}</p>
              <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {about.pillars.map((p) => (
                  <li key={p} className="flex items-center gap-3 font-medium text-midnight">
                    <Icon name="check" className="h-5 w-5 shrink-0 text-ocean" />
                    {p}
                  </li>
                ))}
              </ul>
              <ButtonLink href={`/${lang}#services`} variant="midnight" className="mt-8" arrow>
                {about.cta}
              </ButtonLink>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <h3 className="text-sm font-semibold text-midnight">{about.symbolTitle}</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {about.symbol.map((item) => (
                  <li
                    key={item.title}
                    className="group flex gap-4 rounded-brand bg-white/80 p-4 ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-teal/40 last:sm:col-span-2"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cloud text-midnight ring-1 ring-line transition-colors group-hover:bg-midnight group-hover:text-gold">
                      <Icon name={item.icon as IconName} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-midnight">{item.title}</span>
                      <span className="mt-0.5 block text-sm text-slate">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
