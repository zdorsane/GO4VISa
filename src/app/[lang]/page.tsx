import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Founder } from "@/components/Founder";
import { Destinations } from "@/components/Destinations";
import { Services } from "@/components/Services";
import { Steps } from "@/components/Steps";
import { Gallery } from "@/components/Gallery";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { FloatingCta } from "@/components/FloatingCta";
import { faqAnswerText, getDictionary, site } from "@/lib/content";
import { getDestinations } from "@/lib/destinations";
import { getPhotos } from "@/lib/gallery";
import { hasLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const destinations = getDestinations(lang);

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
      {
        "@type": "FAQPage",
        inLanguage: lang,
        mainEntity: t.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: faqAnswerText(f) },
        })),
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
      <Founder lang={lang} t={t.founder} start={t.ui.getStarted} />
      <Destinations lang={lang} t={t.destinations} destinations={destinations} />
      <Services lang={lang} t={t.services} />
      <Steps t={t.steps} />
      <Gallery lang={lang} t={t.gallery} start={t.ui.getStarted} photos={getPhotos(lang)} />
      <FAQ t={t.faq} />
      <Contact lang={lang} t={t.contact} services={t.services.items} destinations={destinations} />
      <FloatingCta lang={lang} t={t.floatingCta} />
    </>
  );
}
