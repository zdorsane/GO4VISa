// Imports db/seed/scholarships.json. Usage: npm run db:seed [-- --force]
// Existing slugs are left untouched (the back-office owns them) unless --force is given.
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Run `npx vercel env pull .env.local` first.");
  process.exit(1);
}
const force = process.argv.includes("--force");
const sql = neon(process.env.DATABASE_URL);
const { scholarships } = JSON.parse(await readFile("db/seed/scholarships.json", "utf8"));

let inserted = 0, updated = 0, skipped = 0;
for (const s of scholarships) {
  const [existing] = await sql`select id from scholarships where slug = ${s.slug}`;
  if (existing && !force) { skipped++; continue; }
  const row = { ...s, levels: s.levels ?? [], categories: s.categories ?? [], fields: s.fields ?? [], tags: s.tags ?? [] };
  const [saved] = await sql`
    insert into scholarships (
      slug, content_lang, title, institution, country_code, city, levels, categories, fields, tags,
      eligible_nationalities, algeria_eligible, qualifications, age_limit, language_requirements,
      funding_type, tuition, stipend, accommodation, travel, insurance, duration,
      opens_at, deadline_at, deadline_note, application_url, source_url, verified_at, verification,
      summary, description, documents, instructions, featured, status, published_at
    ) values (
      ${row.slug}, ${row.content_lang}, ${row.title}, ${row.institution}, ${row.country_code}, ${row.city},
      ${row.levels}, ${row.categories}, ${row.fields}, ${row.tags},
      ${row.eligible_nationalities}, ${row.algeria_eligible}, ${row.qualifications}, ${row.age_limit}, ${row.language_requirements},
      ${row.funding_type}, ${row.tuition}, ${row.stipend}, ${row.accommodation}, ${row.travel}, ${row.insurance}, ${row.duration},
      ${row.opens_at}, ${row.deadline_at}, ${row.deadline_note}, ${row.application_url}, ${row.source_url}, ${row.verified_at}, ${row.verification},
      ${row.summary}, ${row.description}, ${row.documents}, ${row.instructions}, ${row.featured}, ${row.status},
      ${row.status === "published" ? new Date().toISOString() : null}
    )
    on conflict (slug) do update set
      content_lang = excluded.content_lang, title = excluded.title, institution = excluded.institution,
      country_code = excluded.country_code, city = excluded.city, levels = excluded.levels,
      categories = excluded.categories, fields = excluded.fields, tags = excluded.tags,
      eligible_nationalities = excluded.eligible_nationalities, algeria_eligible = excluded.algeria_eligible,
      qualifications = excluded.qualifications, age_limit = excluded.age_limit,
      language_requirements = excluded.language_requirements, funding_type = excluded.funding_type,
      tuition = excluded.tuition, stipend = excluded.stipend, accommodation = excluded.accommodation,
      travel = excluded.travel, insurance = excluded.insurance, duration = excluded.duration,
      opens_at = excluded.opens_at, deadline_at = excluded.deadline_at, deadline_note = excluded.deadline_note,
      application_url = excluded.application_url, source_url = excluded.source_url,
      verified_at = excluded.verified_at, verification = excluded.verification, summary = excluded.summary,
      description = excluded.description, documents = excluded.documents, instructions = excluded.instructions,
      featured = excluded.featured, status = excluded.status,
      published_at = coalesce(scholarships.published_at, excluded.published_at), updated_at = now()
    returning id`;
  await sql`delete from scholarship_sources where scholarship_id = ${saved.id}`;
  for (const src of s.sources ?? []) {
    await sql`insert into scholarship_sources (scholarship_id, url, label, checked_at)
              values (${saved.id}, ${src.url}, ${src.label ?? null}, ${s.verified_at})`;
  }
  existing ? updated++ : inserted++;
}
console.log(`scholarships: ${inserted} inserted, ${updated} updated, ${skipped} skipped (already in the database)`);
