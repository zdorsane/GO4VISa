export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Cookie remembering the visitor's language choice (read by src/proxy.ts). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Each language's name written in that language (used by the language switch). */
export const localeNames: Record<Locale, string> = { en: "English", fr: "Français", ar: "العربية" };

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtl(lang: Locale) {
  return lang === "ar";
}

/** hreflang map for a path (without the locale prefix), e.g. "/apply". */
export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
    "x-default": `/${defaultLocale}${path}`,
  } as Record<Locale | "x-default", string>;
}
