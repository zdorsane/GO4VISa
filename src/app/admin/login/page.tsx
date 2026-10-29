import type { Metadata } from "next";
import { LogoLockup } from "@/components/brand/Logo";
import { LoginForm } from "../ui/LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-midnight px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <LogoLockup variant="white" className="h-10" />
        </div>
        <div className="rounded-brand-lg bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-8">
          <h1 className="text-xl font-semibold text-midnight">Espace administrateur</h1>
          <p className="mt-1 text-sm text-slate">Accès réservé à l&apos;équipe Go4Visa.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
