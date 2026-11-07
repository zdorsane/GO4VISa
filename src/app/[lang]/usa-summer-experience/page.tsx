import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UsaHero } from "@/components/usa/UsaHero";
import { UsaGallery } from "@/components/usa/UsaGallery";
import { UsaRate } from "@/components/usa/UsaRate";
import { UsaCommitment, UsaExperience, UsaFinalCta, UsaGuide, UsaRibbon, UsaServices, UsaTicker } from "@/components/usa/UsaSections";
import { photos } from "@/components/usa/photos";
import { hasLocale, languageAlternates } from "@/lib/i18n";
import { getUsaSummerDict } from "@/lib/usa-summer";

export async function generateMetadata({ params }: PageProps<"/[lang]/usa-summer-experience">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getUsaSummerDict(lang);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${lang}/usa-summer-experience`, languages: languageAlternates("/usa-summer-experience") },
    openGraph: {
      title: `${t.metaTitle} · Go4Visa`,
      description: t.metaDescription,
      url: `/${lang}/usa-summer-experience`,
      images: [{ url: photos.nycSunset.src.src, width: photos.nycSunset.src.width, height: photos.nycSunset.src.height, alt: photos.nycSunset.alt }],
    },
  };
}

/** Campaign page for summer programmes in the United States: the experience, Go4Visa's guidance, then booking. */
export default async function UsaSummerPage({ params }: PageProps<"/[lang]/usa-summer-experience">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getUsaSummerDict(lang);

  return (
    <>
      <UsaHero lang={lang} t={t.hero} />
      <UsaTicker t={t.experience.benefits} />
      <UsaExperience t={t.experience} />
      <UsaGuide t={t.guide} />
      <UsaServices t={t.services} />
      <UsaGallery t={t.gallery} />
      <UsaRibbon />
      <UsaCommitment t={t.commitment} rate={<UsaRate value={80} label={t.commitment.rateLabel} />} />
      <UsaFinalCta lang={lang} t={t.cta} credits={t.credits} />
    </>
  );
}
