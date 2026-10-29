import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Go4Visa admin" },
  robots: { index: false, follow: false },
};

/** Root layout of the back-office: separate from the public site, French, light theme, never indexed. */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full bg-cloud text-ink">{children}</body>
    </html>
  );
}
