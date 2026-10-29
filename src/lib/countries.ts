/** Country names come from Intl.DisplayNames, so FR/EN/AR names need no hand-written table. */

const cache = new Map<string, Intl.DisplayNames>();

export function countryName(code: string | null | undefined, lang: "fr" | "en" | "ar") {
  if (!code) return "";
  let names = cache.get(lang);
  if (!names) {
    names = new Intl.DisplayNames([lang], { type: "region" });
    cache.set(lang, names);
  }
  try {
    return names.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Suggestions for the admin form (any valid ISO code is accepted). */
export const COMMON_COUNTRIES = [
  "DZ", "MA", "TN", "EG", "LB", "JO", "SA", "AE", "QA", "TR", "FR", "DE", "IT", "ES", "PT", "BE", "NL", "LU", "CH", "AT",
  "GB", "IE", "SE", "NO", "DK", "FI", "PL", "CZ", "HU", "RO", "RU", "US", "CA", "MX", "BR", "CN", "JP", "KR", "IN", "MY",
  "SG", "ID", "TH", "AU", "NZ", "ZA", "RW", "KE", "GH", "NG", "SN",
] as const;
