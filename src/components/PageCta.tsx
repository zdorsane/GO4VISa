import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";
import { ButtonLink } from "./ui/Button";

/** Closing call to action of the inner pages: book a consultation or get in touch. */
export function PageCta({ lang, t, start }: { lang: Locale; t: Dict["pages"]["cta"]; start: string }) {
  return (
    <section className="bg-cloud py-12 md:py-16">
      <div className="container-brand">
        <Reveal className="pattern-grings relative mx-auto max-w-4xl overflow-hidden rounded-brand-lg p-6 text-center shadow-[0_30px_60px_-30px_rgba(11,45,91,0.6)] md:p-10">
          <div aria-hidden className="absolute inset-0 bg-linear-to-br from-midnight via-midnight/95 to-navy/95" />
          <div aria-hidden className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(245,179,1,0.28),transparent_65%)]" />
          <div className="relative">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold text-midnight">
              <Icon name="plane" className="h-6 w-6 rtl:-scale-x-100" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white md:text-[1.9rem]">{t.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-mist md:text-base">{t.text}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={`/${lang}/apply`} arrow>
                {start}
              </ButtonLink>
              <ButtonLink href={`/${lang}#contact`} variant="outline-light">
                {t.contact}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
