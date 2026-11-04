import "server-only";
import * as z from "zod";
import { CATEGORIES, FUNDING, isTimeZone, LEVELS, type Scholarship } from "@/lib/scholarships";
import { getBySlug, listAll, ScholarshipInput, saveScholarship } from "./scholarships";

export const MAX_PDF_BYTES = 30 * 1024 * 1024;

/** What the AI returns for each opportunity found in the PDF (strings stay null when the PDF says nothing). */
const Extracted = z.object({
  existing_slug: z.string().nullable(),
  title: z.string(),
  institution: z.string(),
  country_code: z.string(),
  city: z.string().nullable(),
  levels: z.array(z.enum(LEVELS)),
  categories: z.array(z.enum(CATEGORIES)),
  fields: z.array(z.string()),
  eligible_nationalities: z.string().nullable(),
  algeria_eligible: z.enum(["yes", "no", "unknown"]),
  qualifications: z.string().nullable(),
  age_limit: z.string().nullable(),
  language_requirements: z.string().nullable(),
  funding_type: z.enum(FUNDING),
  tuition: z.string().nullable(),
  stipend: z.string().nullable(),
  accommodation: z.string().nullable(),
  travel: z.string().nullable(),
  insurance: z.string().nullable(),
  duration: z.string().nullable(),
  opens_at: z.string().nullable(),
  deadline_at: z.string().nullable(),
  deadline_tz: z.string().nullable(),
  deadline_note: z.string().nullable(),
  application_url: z.string().nullable(),
  source_url: z.string().nullable(),
  summary: z.string().nullable(),
  description: z.string().nullable(),
  documents: z.string().nullable(),
  instructions: z.string().nullable(),
});
const Extraction = z.object({ scholarships: z.array(Extracted) });
type ExtractedScholarship = z.infer<typeof Extracted>;

const SYSTEM = `You turn a PDF listing international scholarships and opportunities into records for Go4Visa, an Algerian study-abroad website.

Rules:
- Return one record per distinct opportunity in the PDF. Do not invent opportunities.
- Use only facts written in the PDF. When the PDF does not state something, use null (or an empty list). Never guess amounts, dates, links or eligibility.
- Write every text field in French, clear and concise. Keep proper names (programme, university) in their official form.
- title: the programme name, including the intake year when the PDF gives one.
- summary: one or two sentences (max 300 characters) saying what the opportunity is and for whom.
- description: a short presentation (2 to 4 short paragraphs separated by a blank line).
- documents and instructions: one item per line, when the PDF lists them.
- country_code: ISO 3166-1 alpha-2 code of the host country (e.g. "FR", "US"). Use the main host country for multi-country programmes.
- Dates: "YYYY-MM-DD", or "YYYY-MM-DDTHH:mm" when the PDF gives a time. deadline_tz is the IANA time zone only if the PDF states one (e.g. "Europe/Paris" for CET), otherwise null. If the deadline is vague ("early March", "rolling"), set deadline_at to null and explain it in deadline_note.
- algeria_eligible: "yes" if Algerians are explicitly eligible (or the programme is open to all nationalities), "no" if they are explicitly excluded, otherwise "unknown".
- Links: copy full http(s) URLs exactly as written in the PDF. source_url is the official programme page; application_url is where to apply.
- existing_slug: if the opportunity is the same programme as one in the "Already on the site" list, return that slug so the record is updated instead of duplicated; otherwise null.`;

export type ImportReport = {
  created: { id: string; title: string; status: string }[];
  updated: { id: string; title: string; status: string }[];
  expired: string[];
  failed: { title: string; reason: string }[];
  /** Already checked on the official site: the PDF does not overwrite them. */
  kept: string[];
};

const opt = (v: string | null | undefined) => v ?? "";
/** Drops a malformed link or time zone rather than rejecting the whole opportunity. */
const link = (v: string | null) => (v && /^https?:\/\/[^\s]+\.[^\s]+/.test(v.trim()) ? v.trim() : null);
const zone = (v: string | null) => (v && isTimeZone(v) ? v : "");

/** Wall time typed in the admin form ("YYYY-MM-DD" → read as 23:59 by ScholarshipInput). */
const day = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(v) ? v : "");

/** Free tier of Google's Gemini API, tried in order: the free models are often briefly overloaded (503). */
const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];

async function callGemini(body: string) {
  let last: Response | null = null;
  for (const model of GEMINI_MODELS) {
    last = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body,
    });
    // overloaded, over quota or retired for this key: try the next model
    if (![404, 429, 500, 503].includes(last.status)) return last;
  }
  return last!;
}

async function extract(pdf: Buffer, existing: Scholarship[]) {
  const known = existing.map((s) => `- ${s.slug}: ${s.title} (${s.institution})`).join("\n") || "(none)";
  const res = await callGemini(
    JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "application/pdf", data: pdf.toString("base64") } },
            {
              text: `Today is ${new Date().toISOString().slice(0, 10)}.

Already on the site:
${known}

Extract every opportunity in this PDF.`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(Extraction),
        temperature: 0,
      },
    }),
  );
  if (res.status === 429) throw new ImportError("quota");
  if (res.status === 503 || res.status === 500) throw new ImportError("busy");
  if (!res.ok) {
    console.error("Gemini error", res.status, (await res.text()).slice(0, 500));
    throw new ImportError(res.status === 400 || res.status === 403 ? "bad-api-key" : "failed");
  }
  const body = (await res.json()) as {
    candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[];
    promptFeedback?: { blockReason?: string };
  };
  const candidate = body.candidates?.[0];
  if (body.promptFeedback?.blockReason || candidate?.finishReason === "SAFETY") throw new ImportError("refused");
  if (candidate?.finishReason === "MAX_TOKENS") throw new ImportError("too-long");
  const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ImportError("unreadable");
  }
  const parsed = Extraction.safeParse(json);
  if (!parsed.success) throw new ImportError("unreadable");
  return parsed.data.scholarships;
}

export class ImportError extends Error {}

/**
 * Reads a PDF with Gemini and saves every opportunity it finds: new ones are created, known ones
 * (same programme) are updated, and those whose deadline has already passed are skipped.
 * `publish` puts them online straight away; otherwise they wait in "Relecture".
 */
export async function importScholarshipsFromPdf(pdf: Buffer, userId: string, publish: boolean): Promise<ImportReport> {
  if (!process.env.GEMINI_API_KEY) throw new ImportError("no-api-key");
  const existing = await listAll();
  const found = await extract(pdf, existing);
  const report: ImportReport = { created: [], updated: [], expired: [], failed: [], kept: [] };
  const now = Date.now();

  for (const item of found) {
    const previous = item.existing_slug ? await getBySlug(item.existing_slug) : null;
    if (previous?.verification === "verified" && previous.status !== "archived") {
      report.kept.push(previous.title);
      continue;
    }
    const parsed = ScholarshipInput.safeParse(toInput(item, previous, publish));
    if (!parsed.success) {
      report.failed.push({ title: item.title, reason: parsed.error.issues.map((i) => i.path.join(".")).join(", ") });
      continue;
    }
    const data = parsed.data;
    if (data.deadline_at && new Date(data.deadline_at).getTime() < now) {
      report.expired.push(data.title);
      continue;
    }
    try {
      const id = await saveScholarship(previous?.id ?? null, data, userId);
      (previous ? report.updated : report.created).push({ id, title: data.title, status: data.status });
    } catch (e) {
      report.failed.push({ title: data.title, reason: e instanceof Error && e.message === "SLUG_TAKEN" ? "slug" : "save" });
    }
  }
  return report;
}

/** Builds the admin form's raw values, keeping what only the back-office sets (photo, logo, featured). */
function toInput(x: ExtractedScholarship, previous: Scholarship | null, publish: boolean) {
  const source = link(x.source_url) ?? link(x.application_url);
  return {
    title: x.title,
    slug: previous?.slug ?? "",
    content_lang: "fr",
    institution: x.institution,
    logo_url: opt(previous?.logo_url),
    cover_url: opt(previous?.cover_url),
    cover_credit: opt(previous?.cover_credit),
    cover_credit_url: opt(previous?.cover_credit_url),
    country_code: x.country_code,
    city: opt(x.city),
    levels: x.levels,
    categories: x.categories,
    fields: x.fields.join(", "),
    tags: (previous?.tags ?? []).join(", "),
    eligible_nationalities: opt(x.eligible_nationalities),
    algeria_eligible: x.algeria_eligible,
    qualifications: opt(x.qualifications),
    age_limit: opt(x.age_limit),
    language_requirements: opt(x.language_requirements),
    funding_type: x.funding_type,
    tuition: opt(x.tuition),
    stipend: opt(x.stipend),
    accommodation: opt(x.accommodation),
    travel: opt(x.travel),
    insurance: opt(x.insurance),
    duration: opt(x.duration),
    opens_at: day(x.opens_at),
    deadline_at: day(x.deadline_at),
    deadline_note: opt(x.deadline_note),
    deadline_tz: zone(x.deadline_tz),
    application_url: opt(link(x.application_url)),
    source_url: opt(source),
    verified_at: "",
    // read from the client's PDF, not checked on the official site
    verification: "needs_verification",
    summary: opt(x.summary?.slice(0, 400)),
    description: opt(x.description),
    documents: opt(x.documents),
    instructions: opt(x.instructions),
    featured: previous?.featured ?? false,
    // publishing needs an official link; without one the record waits for review
    status: publish && source ? "published" : "review",
  };
}
