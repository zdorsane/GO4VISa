import "server-only";
import * as z from "zod";
import { TRANSLATABLE, type Scholarship, type Translations } from "@/lib/scholarships";
import { db } from "./db";
import { askGemini } from "./gemini";
import { getById } from "./scholarships";

const LANGS = { fr: "French", en: "English", ar: "Modern Standard Arabic" } as const;
type Lang = keyof typeof LANGS;

const Texts = z.object({
  ...(Object.fromEntries(TRANSLATABLE.map((k) => [k, z.string().nullable()])) as Record<(typeof TRANSLATABLE)[number], z.ZodNullable<z.ZodString>>),
  fields: z.array(z.string()),
});

const SYSTEM = `You translate the texts of a scholarship listing for Go4Visa, an Algerian study-abroad website.

Rules:
- Translate every non-null field faithfully into the requested language. Keep null fields null.
- Do not add, remove or change facts: dates, amounts, currencies, links, numbers and names stay exactly the same.
- Keep official names (programmes, universities, organisations) in their usual form in the target language; translate city names to their usual form (Genève → Geneva).
- Keep line breaks and list structure. Use a clear, natural tone.
- "fields" is a list of fields of study: return it translated, same order and same length.`;

/** Translates the texts of one opportunity into the site's other languages and stores them. */
export async function translateScholarship(id: string): Promise<boolean> {
  const s = await getById(id);
  if (!s) return false;
  const source = Object.fromEntries(TRANSLATABLE.map((k) => [k, s[k] ?? null])) as Record<string, string | null>;
  const targets = (Object.keys(LANGS) as Lang[]).filter((l) => l !== s.content_lang);

  const schema = z.object(Object.fromEntries(targets.map((l) => [l, Texts])));
  const result = (await askGemini(
    SYSTEM,
    [
      {
        text: `Source language: ${LANGS[s.content_lang]}. Translate into: ${targets.map((l) => `${l} (${LANGS[l]})`).join(", ")}.\n\n${JSON.stringify({ ...source, fields: s.fields }, null, 1)}`,
      },
    ],
    schema,
  )) as Translations;

  await db()`update scholarships set translations = ${JSON.stringify(result)}::jsonb where id = ${id}`;
  return true;
}

/** Opportunities whose translations are missing (new, edited or imported since the last run). */
export async function untranslatedIds(): Promise<string[]> {
  const rows = (await db()`select id from scholarships where status <> 'archived' and translations = '{}'::jsonb order by updated_at desc`) as Pick<Scholarship, "id">[];
  return rows.map((r) => r.id);
}
