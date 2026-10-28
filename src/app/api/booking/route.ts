import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  bookingMessages,
  sanitizeBooking,
  sheetLabels,
  validateBooking,
  type BookingInput,
} from "@/lib/booking";

/**
 * POST /api/booking (multipart/form-data)
 *
 * No payment details or receipt are collected: the team shares payment details
 * on WhatsApp after the booking arrives.
 *
 * - If GOOGLE_SHEET_WEBHOOK_URL is set (the Apps Script web app URL, see
 *   google-apps-script/booking.gs), the booking is forwarded there and the
 *   script adds one row to the Google Sheet. GOOGLE_SHEET_SECRET must match
 *   SECRET in the script.
 * - Otherwise it is appended to data/bookings.jsonl (local development only —
 *   serverless filesystems are read-only).
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: bookingMessages(undefined).invalidRequest }, { status: 400 });
  }

  const fields = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string"),
  ) as Partial<BookingInput>;

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (fields.company) return Response.json({ ok: true });

  const t = bookingMessages(fields.lang);
  const errors = validateBooking(fields, fields.lang);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const data = sanitizeBooking(fields);
  const row = {
    receivedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp,
    opportunity: data.opportunity,
    reason: data.reason,
    help: sheetLabels.help[data.help as keyof typeof sheetLabels.help] + (data.helpOther ? `: ${data.helpOther}` : ""),
    question: data.question,
    lang: data.lang,
  };

  try {
    const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhook) {
      // Apps Script answers with a redirect to its result page; fetch follows it.
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.GOOGLE_SHEET_SECRET ?? "", ...row }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(`Apps Script responded ${res.status}: ${json?.error ?? "no JSON"}`);
    } else {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "bookings.jsonl"), JSON.stringify(row) + "\n", "utf8");
    }
  } catch (err) {
    console.error("[booking] could not store submission", err);
    return Response.json({ ok: false, error: t.serverFail }, { status: 500 });
  }

  return Response.json({ ok: true });
}
