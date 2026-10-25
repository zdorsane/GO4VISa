import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAQ } from "@/components/FAQ";
import { PageCta } from "@/components/PageCta";
import { PageHeader } from "@/components/ui/PageHeader";
import { faqAnswerText, getDictionary } from "@/lib/content";
import { hasLocale, languageAlternates } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).pages.faq;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/${lang}/faq`, languages: languageAlternates("/faq") },
    openGraph: { title: `${t.metaTitle} · Go4Visa`, description: t.metaDescription, url: `/${lang}/faq` },
  };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: t.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(f) },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHeader id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} lead={t.faq.lead} />
      <FAQ t={t.faq} showHeading={false} />
      <PageCta lang={lang} t={t.pages.cta} start={t.ui.getStarted} />
    </>
  );
}
