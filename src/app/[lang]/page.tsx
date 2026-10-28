import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Feedback } from "@/components/Feedback";
import { FounderContact } from "@/components/FounderContact";
import { FloatingCta } from "@/components/FloatingCta";
import { getDictionary, site } from "@/lib/content";
import { getFeedback, getVisas } from "@/lib/feedback";
import { getPhotos } from "@/lib/gallery";
import { hasLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        name: site.name,
        url: site.url,
        email: site.email,
        logo: `${site.url}/assets/go4visa-logo.jpg`,
        slogan: site.tagline,
        description: t.meta.description,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero lang={lang} t={t.hero} />
      <Stats t={t.stats} />
      <About lang={lang} t={t.about} />
      <Services lang={lang} t={t.services} />
      <Feedback t={t.feedback} viewer={t.gallery} items={getFeedback(lang)} visas={getVisas()} />
      <Gallery lang={lang} t={t.gallery} start={t.ui.getStarted} photos={getPhotos(lang)} />
      <FounderContact
        lang={lang}
        founder={t.founder}
        contact={t.contact}
        social={{ label: t.footer.social, on: t.footer.socialOn }}
      />
      <FloatingCta lang={lang} t={t.floatingCta} />
    </>
  );
}
