import Link from "next/link";
import { site, whatsappHref, type Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { LogoSymbol, Wordmark } from "./brand/Logo";
import { CurrentYear } from "./ui/CurrentYear";

export function Footer({
  lang,
  t,
  ui,
  nav,
}: {
  lang: Locale;
  t: Dict["footer"];
  ui: Dict["ui"];
  nav: Dict["nav"];
}) {
  const socials = site.socials.filter((s) => s.href);
  const whatsapp = whatsappHref();
  return (
    <footer className="border-t border-white/10 bg-midnight text-mist">
      <div className="container-brand grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:py-12 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-12">
        <div className="col-span-2 lg:col-span-1">
          <Link href={`/${lang}`} aria-label={ui.homeLabel} className="inline-flex items-center gap-3">
            <LogoSymbol variant="white" className="h-11 w-auto" />
            <Wordmark variant="white" className="text-2xl" />
          </Link>
          <p className="label-caps mt-4 !text-[0.65rem] text-gold">{site.tagline}</p>
          <p className="mt-3 max-w-xs text-sm">{t.closing}</p>
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
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block break-all py-1 hover:text-gold">
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
