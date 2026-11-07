import "server-only";
import * as z from "zod";
import { CATEGORIES, FUNDING, isTimeZone, LEVELS, slugify, type Scholarship } from "@/lib/scholarships";
import { askGemini, GeminiError } from "./gemini";
import { listAll, ScholarshipInput, saveScholarship } from "./scholarships";

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
  deadline_label: z.string().nullable(),
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
- Dates: "YYYY-MM-DD", or "YYYY-MM-DDTHH:mm" when the PDF gives a time. deadline_tz is the IANA time zone only if the PDF states one (e.g. "Europe/Paris" for CET), otherwise null. If the deadline is vague ("early March"), set deadline_at to null, put a short French label in deadline_label ("Début mars 2027") and explain it in deadline_note. If there are several deadlines (by course or track), set deadline_at to the latest one and deadline_label to a short French text listing them ("8 déc. 2026 ou 6 janv. 2027"). Otherwise deadline_label is null.
- algeria_eligible: "yes" if Algerians are explicitly eligible (or the programme is open to all nationalities), "no" if they are explicitly excluded, otherwise "unknown".
- Links: copy full http(s) URLs exactly as written in the PDF. source_url is the official programme page; application_url is where to apply.
- existing_slug: if the opportunity is the same programme as one in the "Already on the site" list (even under a translated or slightly different name), return that slug; otherwise null.`;

export type ImportReport = {
  created: { id: string; title: string; status: string }[];
  updated: { id: string; title: string; status: string }[];
  expired: string[];
  failed: { title: string; reason: string }[];
  /** Already on the site (or twice in the PDF): refused, the existing record is left as it is. */
  duplicates: string[];
};

const opt = (v: string | null | undefined) => v ?? "";
/** Drops a malformed link or time zone rather than rejecting the whole opportunity. */
const link = (v: string | null) => (v && /^https?:\/\/[^\s]+\.[^\s]+/.test(v.trim()) ? v.trim() : null);
const zone = (v: string | null) => (v && isTimeZone(v) ? v : "");

/** Wall time typed in the admin form ("YYYY-MM-DD" → read as 23:59 by ScholarshipInput). */
const day = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(v) ? v : "");

async function extract(pdf: Buffer, existing: Scholarship[]) {
  const known = existing.map((s) => `- ${s.slug}: ${s.title} (${s.institution})`).join("\n") || "(none)";
  try {
    const { scholarships } = await askGemini(
      SYSTEM,
      [
        { inlineData: { mimeType: "application/pdf", data: pdf.toString("base64") } },
        { text: `Today is ${new Date().toISOString().slice(0, 10)}.\n\nAlready on the site:\n${known}\n\nExtract every opportunity in this PDF.` },
      ],
      Extraction,
    );
    return scholarships;
  } catch (e) {
    throw e instanceof GeminiError ? new ImportError(e.message) : e;
  }
}

export class ImportError extends Error {}

/** "www.example.org/path" of a specific page; null for a bare home page, too generic to identify a programme. */
function pageKey(v: string | null) {
  const url = link(v);
  if (!url) return null;
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, "").toLowerCase();
    return path ? `${u.hostname.replace(/^www\./, "").toLowerCase()}${path}` : null;
  } catch {
    return null;
  }
}

/** Identifiers that mean "same programme": its slug and its official pages. */
function keys(s: { slug?: string; title: string; source_url: string | null; application_url: string | null }) {
  return [s.slug, slugify(s.title), pageKey(s.source_url), pageKey(s.application_url)].filter((k): k is string => !!k);
}

/** Words that say what kind of opportunity it is, not which one (in French and English). */
const GENERIC = new Set(
  ("programme program bourse scholarship fellowship international internationale university universite universidad " +
    "stage internship summer ete ecole school camp winter hiver leadership licence undergraduate graduate master masters " +
    "doctorat phd postdoc track edition call volunteer volontariat institute institut research recherche student etudiant " +
    "visiting scholar for pour and the des les une dans with avec").split(" "),
);

/** Distinctive words of a title ("Bourse Gates Cambridge 2027-2028" → gates, cambridge). */
function titleWords(title: string) {
  const words = slugify(title)
    .split("-")
    .map((w) => w.replace(/s$/, ""))
    .filter((w) => w.length >= 3 && !/^\d+$/.test(w) && !GENERIC.has(w) && !GENERIC.has(`${w}s`));
  return new Set(words);
}

/** Same programme under another name or language: most distinctive words in common. */
function sameTitle(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return false;
  const common = [...a].filter((w) => b.has(w)).length;
  return common > 0 && common / Math.min(a.size, b.size) >= 0.6;
}

/**
 * Reads a PDF with Gemini and saves every opportunity it finds; those whose deadline has passed are skipped.
 * An opportunity already on the site is refused, unless `updateExisting` is set (verified ones are never
 * overwritten); an archived one is reopened as the new edition. `publish` puts them online straight away,
 * otherwise they wait in "Relecture".
 */
export async function importScholarshipsFromPdf(
  pdf: Buffer,
  userId: string,
  { publish, updateExisting }: { publish: boolean; updateExisting: boolean },
): Promise<ImportReport> {
  const existing = await listAll();
  const found = await extract(pdf, existing);
  const report: ImportReport = { created: [], updated: [], expired: [], failed: [], duplicates: [] };
  const now = Date.now();

  const byKey = new Map<string, Scholarship>();
  for (const s of existing) for (const k of keys(s)) if (!byKey.has(k)) byKey.set(k, s);
  const existingWords = existing.map((s) => [s, titleWords(s.title)] as const);
  const seen = new Set<string>();
  const seenWords: Set<string>[] = [];

  for (const item of found) {
    const itemKeys = keys(item);
    const words = titleWords(item.title);
    if (itemKeys.some((k) => seen.has(k)) || seenWords.some((w) => sameTitle(w, words))) {
      report.duplicates.push(item.title);
      continue;
    }
    itemKeys.forEach((k) => seen.add(k));
    seenWords.push(words);

    const match =
      existing.find((s) => s.slug === item.existing_slug) ??
      itemKeys.map((k) => byKey.get(k)).find(Boolean) ??
      existingWords.find(([, w]) => sameTitle(w, words))?.[0] ??
      null;
    if (match && match.status !== "archived" && (!updateExisting || match.verification === "verified")) {
      report.duplicates.push(match.title);
      continue;
    }
    const previous = match;
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
    deadline_label: opt(x.deadline_label?.slice(0, 120)),
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
