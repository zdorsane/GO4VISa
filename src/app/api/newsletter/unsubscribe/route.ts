import { NextResponse, type NextRequest } from "next/server";
import { db, hasDatabase } from "@/lib/server/db";

/** One-click unsubscribe link for newsletter e-mails: /api/newsletter/unsubscribe?token=… */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  let lang = "fr";
  if (hasDatabase() && /^[a-f0-9]{48}$/.test(token)) {
    const [row] = await db()`
      update newsletter_subscribers set unsubscribed_at = coalesce(unsubscribed_at, now())
      where unsubscribe_token = ${token} returning lang`;
    if (row) lang = row.lang;
  }
  return NextResponse.redirect(new URL(`/${lang}?unsubscribed=1`, request.url));
}
