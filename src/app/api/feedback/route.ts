import { NextResponse, type NextRequest } from "next/server";
import * as z from "zod";
import { hasDatabase } from "@/lib/server/db";
import { saveMessage } from "@/lib/server/messages";

const Body = z.object({
  name: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(1000),
  rating: z.number().int().min(1).max(5).nullable().default(null),
  lang: z.enum(["fr", "en", "ar"]).default("fr"),
  // honeypot: real visitors never see or fill this field
  website: z.string().max(0).optional(),
});

/** Feedback left by a student on the home page; read and moderated in the back-office. */
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
    if (bot) return NextResponse.json({ status: "ok" });
    return NextResponse.json({ error: "invalid", fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] }, { status: 400 });
  }
  const { name, message, rating, lang } = parsed.data;
  await saveMessage({ kind: "feedback", name, email: null, phone: null, subject: null, message, rating, lang });
  return NextResponse.json({ status: "ok" });
}
