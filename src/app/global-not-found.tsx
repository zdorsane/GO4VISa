import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { LogoSymbol } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 · Go4Visa",
};

/** 404 for URLs that match no route at all (the root layout lives under [lang]). */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body>
        <main className="pattern-flight flex min-h-svh items-center">
          <div className="container-brand flex flex-col items-center text-center">
            <LogoSymbol variant="white" className="h-28 w-auto" />
            <p className="label-caps mt-8 text-gold">404</p>
            <h1 className="mt-3 text-4xl font-bold text-white">This page has flown away</h1>
            <p className="mt-2 text-lg text-mist" lang="fr">Cette page s&apos;est envolée</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/en" className={buttonClasses("gold")}>Back to home</Link>
              <Link href="/fr" lang="fr" className={buttonClasses("outline-light")}>Retour à l&apos;accueil</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
