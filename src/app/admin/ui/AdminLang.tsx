"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translator, type AdminLang } from "../i18n";
import { setAdminLangAction } from "../actions";

const Ctx = createContext<AdminLang>("fr");

export function AdminLangProvider({ lang, children }: { lang: AdminLang; children: ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

/** Translator for client components of the back-office. */
export function useT() {
  const lang = useContext(Ctx);
  return { lang, t: translator(lang) };
}

/** FR / EN switch; the choice is kept in a cookie. */
export function AdminLangSwitch({ lang, tone = "dark" }: { lang: AdminLang; tone?: "dark" | "light" }) {
  return (
    <form action={setAdminLangAction} className={`inline-flex rounded-lg p-0.5 text-xs font-semibold ring-1 ${tone === "dark" ? "ring-white/20" : "ring-line"}`}>
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          name="lang"
          value={l}
          aria-pressed={lang === l}
          className={`rounded-md px-2.5 py-1 uppercase transition-colors ${
            lang === l ? "bg-gold text-midnight" : tone === "dark" ? "text-mist hover:text-white" : "text-slate hover:text-midnight"
          }`}
        >
          {l}
        </button>
      ))}
    </form>
  );
}
