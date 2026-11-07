import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { contactMessages, sanitizeContact, validateContact, type ContactInput } from "@/lib/contact";
import { hasDatabase } from "@/lib/server/db";
import { saveMessage } from "@/lib/server/messages";

/**
 * POST /api/contact
 *
 * - With a database (production): stored in `messages`, read in the back-office (/admin/messages).
 * - If FORMSPREE_ENDPOINT is set (e.g. https://formspree.io/f/xxxxxxx), the
 *   submission is also forwarded there.
 * - Without either it is appended to data/contact-submissions.jsonl (local dev only:
 *   serverless hosts have a read-only filesystem).
 */
export async function POST(request: Request) {
  let body: Partial<ContactInput>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: contactMessages(undefined).invalidRequest }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (body.company) return Response.json({ ok: true });

  const t = contactMessages(body.lang);
  const errors = validateContact(body, body.lang);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const data = { ...sanitizeContact(body), receivedAt: new Date().toISOString() };

  try {
    const endpoint = process.env.FORMSPREE_ENDPOINT;
    if (hasDatabase()) {
      await saveMessage({
        kind: "contact",
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: [data.service, data.destination].filter(Boolean).join(" · ") || null,
        message: data.message,
        rating: null,
        lang: data.lang as "fr" | "en" | "ar",
      });
    }
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
    } else if (!hasDatabase()) {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "contact-submissions.jsonl"), JSON.stringify(data) + "\n", "utf8");
    }
  } catch (err) {
    console.error("[contact] could not store submission", err);
    return Response.json(
      { ok: false, error: t.serverFail },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
