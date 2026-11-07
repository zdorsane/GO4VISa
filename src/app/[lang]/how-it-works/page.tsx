import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Steps } from "@/components/Steps";
import { PageCta } from "@/components/PageCta";
import { JourneyHero } from "@/components/JourneyHero";
import { getDictionary } from "@/lib/content";
import { hasLocale, languageAlternates } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/how-it-works">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).pages.howItWorks;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${lang}/how-it-works`, languages: languageAlternates("/how-it-works") },
    openGraph: { title: `${t.metaTitle} · Go4Visa`, description: t.metaDescription, url: `/${lang}/how-it-works` },
  };
}

/** Hero, the student journey step by step, then the booking call to action. */
export default async function HowItWorksPage({ params }: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <JourneyHero lang={lang} t={t.pages.howItWorks} steps={t.steps.items} />
      <Steps t={t.steps} />
      <PageCta lang={lang} t={t.pages.howItWorks.cta} start={t.pages.howItWorks.book} />
    </>
  );
}
