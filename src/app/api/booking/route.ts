import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  bookingMessages,
  sanitizeBooking,
  sheetLabels,
  validateBooking,
  type BookingInput,
} from "@/lib/booking";

/**
 * POST /api/booking (multipart/form-data, receipt in the "receipt" field)
 *
 * - If GOOGLE_SHEET_WEBHOOK_URL is set (the Apps Script web app URL, see
 *   google-apps-script/booking.gs), the booking is forwarded there: the script
 *   saves the receipt to Google Drive and adds one row to the Google Sheet.
 *   GOOGLE_SHEET_SECRET must match SECRET in the script.
 * - Otherwise it is appended to data/bookings.jsonl and the receipt saved in
 *   data/receipts/ (local development only — serverless filesystems are read-only).
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

  const file = form.get("receipt");
  const receipt = file instanceof File ? file : null;
  const t = bookingMessages(fields.lang);
  const errors = validateBooking(
    fields,
    receipt && { name: receipt.name, type: receipt.type, size: receipt.size },
    fields.lang,
  );
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
    payment: sheetLabels.payment[data.payment as keyof typeof sheetLabels.payment],
    lang: data.lang,
  };
  const bytes = Buffer.from(await receipt!.arrayBuffer());
  const ext = path.extname(receipt!.name).slice(0, 10) || (receipt!.type === "application/pdf" ? ".pdf" : "");
  const safeName = data.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 40) || "candidate";
  const receiptName = `${row.receivedAt.slice(0, 10)}_${safeName}${ext}`;

  try {
    const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhook) {
      // Apps Script answers with a redirect to its result page; fetch follows it.
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.GOOGLE_SHEET_SECRET ?? "",
          ...row,
          receipt: { name: receiptName, type: receipt!.type, base64: bytes.toString("base64") },
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(`Apps Script responded ${res.status}: ${json?.error ?? "no JSON"}`);
    } else {
      const dir = path.join(process.cwd(), "data");
      await mkdir(path.join(dir, "receipts"), { recursive: true });
      await writeFile(path.join(dir, "receipts", receiptName), bytes);
      await appendFile(
        path.join(dir, "bookings.jsonl"),
        JSON.stringify({ ...row, receipt: `data/receipts/${receiptName}` }) + "\n",
        "utf8",
      );
    }
  } catch (err) {
    console.error("[booking] could not store submission", err);
    return Response.json({ ok: false, error: t.serverFail }, { status: 500 });
  }

  return Response.json({ ok: true });
}
