import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/lib/i18n";
import { ADMIN_COOKIE } from "@/lib/admin-cookie";

/** Saved choice first, then the browser's preferred language, then English. */
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .find((p) => hasLocale(p.lang));
  return (preferred?.lang as Locale | undefined) ?? defaultLocale;
}

/** Sends any public URL without a language prefix (e.g. "/") to /en/… or /fr/…. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Back-office: optimistic check only (no cookie → login page). The real session
  // check runs on the server (src/lib/server/auth.ts) for every admin page and action.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login" || request.cookies.has(ADMIN_COOKIE)) return;
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasPrefix) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (images,
  // flags, patterns, sitemap.xml, robots.txt, icon.svg…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
