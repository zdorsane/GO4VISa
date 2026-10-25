import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Steps } from "@/components/Steps";
import { Destinations } from "@/components/Destinations";
import { PageCta } from "@/components/PageCta";
import { PageHeader } from "@/components/ui/PageHeader";
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

/** The student journey step by step, then the scholarship destinations. */
export default async function HowItWorksPage({ params }: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <PageHeader id="page-title" eyebrow={t.pages.howItWorks.eyebrow} title={t.pages.howItWorks.title} lead={t.pages.howItWorks.lead} />
      <Steps t={t.steps} />
      <Destinations lang={lang} t={t.destinations} destinations={getDestinations(lang)} />
      <PageCta lang={lang} t={t.pages.cta} start={t.ui.getStarted} />
    </>
  );
}
