import Link from "next/link";
import { site, whatsappHref, type Dict } from "@/lib/content";
import type { Destination } from "@/lib/destinations";
import type { Locale } from "@/lib/i18n";
import { LogoSymbol, Wordmark } from "./brand/Logo";
import { Icon, type IconName } from "./ui/Icon";
import { CurrentYear } from "./ui/CurrentYear";

export function Footer({
  lang,
  t,
  ui,
  nav,
  destinations,
}: {
  lang: Locale;
  t: Dict["footer"];
  ui: Dict["ui"];
  nav: Dict["nav"];
  destinations: Destination[];
}) {
  const socials = site.socials.filter((s) => s.href);
  const whatsapp = whatsappHref();
  return (
    <footer className="border-t border-white/10 bg-midnight text-mist">
      <div className="container-brand grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:py-12 lg:grid-cols-[1.2fr_0.8fr_1.6fr_1.1fr] lg:gap-10">
        <div className="col-span-2 lg:col-span-1">
          <Link href={`/${lang}`} aria-label={ui.homeLabel} className="inline-flex items-center gap-3">
            <LogoSymbol variant="white" className="h-11 w-auto" />
            <Wordmark variant="white" className="text-2xl" />
          </Link>
          <p className="label-caps mt-4 !text-[0.65rem] text-gold">{site.tagline}</p>
          <p className="mt-3 max-w-xs text-sm">{t.closing}</p>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-2.5" aria-label={t.social}>
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    aria-label={`${t.socialOn} ${s.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-midnight hover:ring-gold"
                  >
                    <Icon name={s.name.toLowerCase() as IconName} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label={t.footerNav}>
          <h2 className="text-sm font-semibold text-white">{t.quickLinks}</h2>
          <ul className="mt-3 space-y-0.5 text-sm">
            {[
              { label: nav.home, path: "" },
              ...nav.pages,
              ...nav.sections.filter((s) => ["#services", "#feedback", "#contact"].includes(s.path)),
            ].map((n) => (
              <li key={n.path || "home"}>
                <Link href={`/${lang}${n.path}`} className="inline-block py-1 hover:text-gold">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 order-last lg:order-none lg:col-span-1">
          <h2 className="text-sm font-semibold text-white">{t.destinations}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-2">
            {destinations.map((d) => (
              <li key={d.slug} className="min-w-0">
                <Link
                  href={`/${lang}/destinations/${d.slug}`}
                  className="group flex items-center gap-2 rounded-full py-1 pe-3 ps-1 text-[0.8rem] ring-1 ring-white/10 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:ring-gold/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/flags/${d.flag}.svg`}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="truncate">{d.country}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/${lang}/how-it-works#destinations`}
            className="group mt-3 inline-flex items-center gap-2 py-1 text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            {t.allDestinations}
            <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">{t.contact}</h2>
          <ul className="mt-3 space-y-0.5 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="inline-block break-all py-1 hover:text-gold">
                {site.email}
              </a>
            </li>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-gold">
                  WhatsApp: <span dir="ltr" className="whitespace-nowrap">{site.whatsappDisplay}</span>
                </a>
              </li>
            )}
            {site.phoneHref && (
              <li>
                <a href={site.phoneHref} dir="ltr" className="inline-block py-1 hover:text-gold rtl:text-end">
                  {site.phone}
                </a>
              </li>
            )}
            {socials
              .filter((s) => s.handle)
              .map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-gold">
                    {s.name}: <span dir="ltr">{s.handle}</span>
                  </a>
                </li>
              ))}
            <li>
              <a href={site.url} className="inline-block py-1 hover:text-gold">
                {site.domain}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-brand py-4 text-center text-xs sm:text-start">
          <p>© <CurrentYear /> Go4Visa. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
