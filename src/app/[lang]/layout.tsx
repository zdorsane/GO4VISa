import type { Metadata, Viewport } from "next";
import { Cairo, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, site } from "@/lib/content";
import { getDestinations } from "@/lib/destinations";
import { hasLocale, isRtl, languageAlternates, locales } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Arabic pages: Montserrat has no Arabic glyphs.
const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const KEYWORDS = {
  en: ["study abroad Algeria", "scholarships for Algerian students"],
  fr: ["étudier à l'étranger Algérie", "bourses pour étudiants algériens"],
  ar: ["الدراسة في الخارج الجزائر", "منح دراسية للطلاب الجزائريين"],
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    metadataBase: new URL(site.url),
    title: { default: t.title, template: "%s · Go4Visa" },
    description: t.description,
    keywords: [
      "Go4Visa",
      ...KEYWORDS[lang],
      "Stipendium Hungaricum",
      "Türkiye Bursları",
      "Chevening",
      "Fulbright",
      "DAAD",
      "Eiffel",
      "CSC",
      "GKS",
      "MEXT",
    ],
    alternates: {
      canonical: `/${lang}`,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      siteName: "Go4Visa",
      url: `${site.url}/${lang}`,
      title: t.title,
      description: t.description,
      locale: t.ogLocale,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => getDictionary(l).meta.ogLocale),
      images: [{ url: "/assets/go4visa-logo.jpg", width: 1280, height: 1133, alt: "Go4Visa logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ["/assets/go4visa-logo.jpg"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B2D5B",
};

// Arabic is right-to-left: components use logical properties (ms/me, ps/pe,
// start/end) so layouts mirror correctly.
export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const destinations = getDestinations(lang);

  return (
    <html
      lang={lang}
      dir={isRtl(lang) ? "rtl" : "ltr"}
      className={`${montserrat.variable} ${cairo.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ScrollProgress />
        <Navbar lang={lang} ui={t.ui} nav={t.nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} t={t.footer} ui={t.ui} nav={t.nav} destinations={destinations} />
      </body>
    </html>
  );
}
