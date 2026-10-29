import { NextResponse, type NextRequest } from "next/server";
import * as z from "zod";
import { db, hasDatabase } from "@/lib/server/db";

const Body = z.object({
  email: z.email().trim().toLowerCase().max(254),
  lang: z.enum(["fr", "en", "ar"]).default("fr"),
  // honeypot: real visitors never see or fill this field
  website: z.string().max(0).optional(),
});

/** Newsletter sign-up. Responds { status: "ok" | "already" } or an error code. */
export async function POST(request: NextRequest) {
  if (!hasDatabase()) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    const bot = parsed.error.issues.some((i) => i.path[0] === "website");
    // pretend success to bots so they do not retry
    return bot ? NextResponse.json({ status: "ok" }) : NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { email, lang } = parsed.data;
  const rows = await db()`
    insert into newsletter_subscribers (email, lang) values (${email}, ${lang})
    on conflict (email) do update set unsubscribed_at = null, lang = excluded.lang
      where newsletter_subscribers.unsubscribed_at is not null
    returning (xmax = 0) as inserted`;
  return NextResponse.json({ status: rows.length ? "ok" : "already" });
}
