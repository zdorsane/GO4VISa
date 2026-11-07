import "server-only";
import { cookies } from "next/headers";
import { ADMIN_LANG_COOKIE, translator, type AdminLang } from "./i18n";

/** The back-office language chosen with the FR/EN switch (French by default). */
export async function getAdminT() {
  const lang: AdminLang = (await cookies()).get(ADMIN_LANG_COOKIE)?.value === "en" ? "en" : "fr";
  return { lang, t: translator(lang) };
}
