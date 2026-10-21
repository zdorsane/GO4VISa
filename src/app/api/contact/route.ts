import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { contactMessages, sanitizeContact, validateContact, type ContactInput } from "@/lib/contact";

/**
 * POST /api/contact
 *
 * - If FORMSPREE_ENDPOINT is set (e.g. https://formspree.io/f/xxxxxxx), the
 *   submission is forwarded there.
 * - Otherwise it is appended to data/contact-submissions.jsonl (fine for local
 *   dev or a self-hosted server; use Formspree or a database on serverless hosts,
 *   whose filesystem is read-only).
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
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
    } else {
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
