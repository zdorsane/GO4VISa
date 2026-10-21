"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, locales, type Locale } from "@/lib/i18n";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * EN | FR pill. Swaps the locale segment of the current URL (keeping the rest
 * of the path, the query and the #section) and remembers the choice in a cookie
 * so src/proxy.ts sends the visitor to the same language next time.
 */
export function LanguageSwitch({
  lang,
  label,
  switchTo,
  tone,
}: {
  lang: Locale;
  label: string;
  switchTo: string;
  tone: "light" | "dark";
}) {
  const router = useRouter();

  function go(e: MouseEvent<HTMLAnchorElement>, target: Locale) {
    e.preventDefault();
    if (target === lang) return;
    rememberLocale(target);
    const { pathname, search, hash } = window.location;
    const rest = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");
    router.push(`/${target}${rest}${search}${hash}`);
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center rounded-full p-1 text-xs font-semibold ring-1 ${
        tone === "dark" ? "ring-midnight/15" : "ring-white/30"
      }`}
    >
      {locales.map((l) => {
        const active = l === lang;
        return (
          <a
            key={l}
            href={`/${l}`}
            hrefLang={l}
            lang={l}
            onClick={(e) => go(e, l)}
            aria-current={active ? "true" : undefined}
            title={active ? undefined : switchTo}
            className={`rounded-full px-2.5 py-2 uppercase tracking-wider transition-colors ${
              active
                ? "bg-gold text-midnight"
                : tone === "dark"
                  ? "text-midnight hover:bg-midnight/5"
                  : "text-white hover:bg-white/10"
            }`}
          >
            {l}
          </a>
        );
      })}
    </div>
  );
}
