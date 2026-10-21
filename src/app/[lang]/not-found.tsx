import { lang as rootLang } from "next/root-params";
import { ButtonLink } from "@/components/ui/Button";
import { LogoSymbol } from "@/components/brand/Logo";
import { getDictionary } from "@/lib/content";
import { defaultLocale, hasLocale } from "@/lib/i18n";

export default async function NotFound() {
  const value = await rootLang();
  const lang = hasLocale(value) ? value : defaultLocale;
  const t = getDictionary(lang).notFound;

  return (
    <section className="pattern-flight flex min-h-svh items-center pt-[var(--g4v-header-h)]">
      <div className="container-brand flex flex-col items-center text-center">
        <LogoSymbol variant="white" className="h-28 w-auto" />
        <p className="label-caps mt-8 text-gold">404</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{t.title}</h1>
        <ButtonLink href={`/${lang}`} className="mt-8" arrow>
          {t.back}
        </ButtonLink>
      </div>
    </section>
  );
}
