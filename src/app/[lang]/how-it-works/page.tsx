import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Steps } from "@/components/Steps";
import { Destinations } from "@/components/Destinations";
import { PageCta } from "@/components/PageCta";
import { JourneyHero } from "@/components/JourneyHero";
import { getDictionary } from "@/lib/content";
import { getDestinations } from "@/lib/destinations";
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

/** Hero, the student journey step by step, the scholarship destinations, then the booking call to action. */
export default async function HowItWorksPage({ params }: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const destinations = getDestinations(lang);

  return (
    <>
      <JourneyHero lang={lang} t={t.pages.howItWorks} steps={t.steps.items} />
      <Steps t={t.steps} />
      <Destinations lang={lang} t={t.destinations} destinations={destinations} />
      <PageCta lang={lang} t={t.pages.howItWorks.cta} start={t.pages.howItWorks.book} />
    </>
  );
}
