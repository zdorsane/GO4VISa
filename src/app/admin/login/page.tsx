import type { Metadata } from "next";
import { LogoLockup } from "@/components/brand/Logo";
import { getAdminT } from "../i18n-server";
import { AdminLangProvider, AdminLangSwitch } from "../ui/AdminLang";
import { LoginForm } from "../ui/LoginForm";

// reads the language cookie: render on request
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminT();
  return { title: t("Connexion") };
}

export default async function LoginPage() {
  const { lang, t } = await getAdminT();
  return (
    <AdminLangProvider lang={lang}>
      <main className="grid min-h-screen place-items-center bg-midnight px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between">
            <LogoLockup variant="white" className="h-10" />
            <AdminLangSwitch lang={lang} />
          </div>
          <div className="rounded-brand-lg bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-8">
            <h1 className="text-xl font-semibold text-midnight">{t("Espace administrateur")}</h1>
            <p className="mt-1 text-sm text-slate">{t("Accès réservé à l'équipe Go4Visa.")}</p>
            <LoginForm />
          </div>
        </div>
      </main>
    </AdminLangProvider>
  );
}
