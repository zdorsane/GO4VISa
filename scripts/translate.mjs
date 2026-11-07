// Translates every opportunity whose English/Arabic version is missing. Usage: npm run db:translate [-- --all]
// Same rules as src/lib/server/translate.ts (used by the back-office); --all redoes every opportunity.
import { existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (!process.env.DATABASE_URL || !process.env.GEMINI_API_KEY) {
  console.error("DATABASE_URL and GEMINI_API_KEY are required (.env.local).");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
const all = process.argv.includes("--all");

// keep in sync with TRANSLATABLE in src/lib/scholarships.ts
const FIELDS = [
  "title", "institution", "city", "summary", "description", "eligible_nationalities", "qualifications", "age_limit",
  "language_requirements", "tuition", "stipend", "accommodation", "travel", "insurance", "duration", "deadline_note",
  "deadline_label", "documents", "instructions",
];
const LANGS = { fr: "French", en: "English", ar: "Modern Standard Arabic" };
const MODELS = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];
const SYSTEM = `You translate the texts of a scholarship listing for Go4Visa, an Algerian study-abroad website.

Rules:
- Translate every non-null field faithfully into the requested language. Keep null fields null.
- Do not add, remove or change facts: dates, amounts, currencies, links, numbers and names stay exactly the same.
- Keep official names (programmes, universities, organisations) in their usual form in the target language; translate city names to their usual form (Genève → Geneva).
- Keep line breaks and list structure. Use a clear, natural tone.
- "fields" is a list of fields of study: return it translated, same order and same length.`;

const texts = {
  type: "object",
  properties: { ...Object.fromEntries(FIELDS.map((f) => [f, { type: ["string", "null"] }])), fields: { type: "array", items: { type: "string" } } },
  required: [...FIELDS, "fields"],
};

async function translate(row) {
  const targets = Object.keys(LANGS).filter((l) => l !== row.content_lang);
  const source = { ...Object.fromEntries(FIELDS.map((f) => [f, row[f] ?? null])), fields: row.fields ?? [] };
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: "user", parts: [{ text: `Source language: ${LANGS[row.content_lang]}. Translate into: ${targets.map((l) => `${l} (${LANGS[l]})`).join(", ")}.\n\n${JSON.stringify(source, null, 1)}` }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseJsonSchema: { type: "object", properties: Object.fromEntries(targets.map((l) => [l, texts])), required: targets },
      temperature: 0,
    },
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const model of MODELS) {
      let res;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
          body,
          signal: AbortSignal.timeout(120_000),
        });
      } catch {
        continue; // too slow or network hiccup: next model
      }
      if ([404, 429, 500, 503].includes(res.status)) continue;
      if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const out = await res.json();
      const json = JSON.parse(out.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "");
      for (const l of targets) if (!json[l]?.title) throw new Error(`missing ${l} translation`);
      return json;
    }
    await new Promise((r) => setTimeout(r, 15000)); // every model busy: wait and retry
  }
  throw new Error("Gemini is busy, try again later");
}

const rows = all
  ? await sql`select * from scholarships where status <> 'archived'`
  : await sql`select * from scholarships where status <> 'archived' and translations = '{}'::jsonb`;
let done = 0;
for (const row of rows) {
  try {
    const t = await translate(row);
    await sql`update scholarships set translations = ${JSON.stringify(t)}::jsonb where id = ${row.id}`;
    console.log(`✓ ${row.slug} → ${t.en.title}`);
    done++;
  } catch (e) {
    console.error(`✗ ${row.slug}: ${e.message}${e.cause ? " (" + (e.cause.code ?? e.cause.message) + ")" : ""}`);
  }
}
console.log(`${done}/${rows.length} translated`);
