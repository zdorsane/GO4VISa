import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/server/auth";
import { archiveExpired } from "@/lib/server/scholarships";

/** Daily Vercel Cron job (vercel.json): archives every opportunity whose deadline has passed. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const archived = await archiveExpired();
  for (const s of archived) await logActivity(null, "auto-archive", "scholarship", s.id, { title: s.title });
  if (archived.length) revalidateTag("scholarships", "max");
  return NextResponse.json({ archived: archived.length });
}
