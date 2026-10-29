import "server-only";
import * as z from "zod";
import { CATEGORIES, FUNDING, isTimeZone, LEVELS, WORKFLOW, slugify, zonedToIso, type Scholarship } from "@/lib/scholarships";
import { db } from "./db";

const COLUMNS = `id, slug, content_lang, title, institution, logo_url, country_code, city, levels, categories, fields, tags,
  eligible_nationalities, algeria_eligible, qualifications, age_limit, language_requirements, funding_type, tuition,
  stipend, accommodation, travel, insurance, duration, opens_at, deadline_at, deadline_note, deadline_tz, application_url,
  source_url, verified_at::text as verified_at, verification, summary, description, documents, instructions, featured, status,
  published_at, created_at, updated_at`;

const toIso = (v: unknown) => (v instanceof Date ? v.toISOString() : (v as string | null));

function normalize(row: Record<string, unknown>): Scholarship {
  return {
    ...(row as unknown as Scholarship),
    opens_at: toIso(row.opens_at),
    deadline_at: toIso(row.deadline_at),
    published_at: toIso(row.published_at),
    created_at: toIso(row.created_at)!,
    updated_at: toIso(row.updated_at)!,
  };
}

// ── Reads ──────────────────────────────────────────────────────────────────

/** Every published opportunity (the public directory filters and sorts in the page). */
export async function listPublished(): Promise<Scholarship[]> {
  const rows = await db().query(`select ${COLUMNS} from scholarships where status = 'published' order by deadline_at asc nulls last`);
  return rows.map(normalize);
}

export async function getPublishedBySlug(slug: string): Promise<Scholarship | null> {
  const [row] = await db().query(`select ${COLUMNS} from scholarships where slug = $1 and status = 'published'`, [slug]);
  return row ? normalize(row) : null;
}

export async function listAll(): Promise<Scholarship[]> {
  const rows = await db().query(`select ${COLUMNS} from scholarships order by updated_at desc`);
  return rows.map(normalize);
}

export async function getById(id: string): Promise<Scholarship | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const [row] = await db().query(`select ${COLUMNS} from scholarships where id = $1`, [id]);
  return row ? normalize(row) : null;
}

export type Source = { id: string; url: string; label: string | null; checked_at: string | null };
export async function getSources(id: string): Promise<Source[]> {
  return (await db()`
    select id, url, label, checked_at::text as checked_at from scholarship_sources
    where scholarship_id = ${id} order by created_at`) as Source[];
}

// ── Validation ─────────────────────────────────────────────────────────────

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable();
const url = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine((v) => v === null || /^https?:\/\/[^\s]+\.[^\s]+/.test(v), { message: "invalid-url" });
const list = z
  .string()
  .transform((v) => [...new Set(v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean))].slice(0, 30));
/** <input type="datetime-local"> wall time; converted to an instant with the official time zone below. */
const localDate = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine((v) => v === null || /^d{4}-d{2}-d{2}(Td{2}:d{2})?$/.test(v), { message: "invalid-date" });

export const ScholarshipInput = z
  .object({
    title: z.string().trim().min(3).max(200),
    slug: z.string().trim().max(80),
    content_lang: z.enum(["fr", "en", "ar"]),
    institution: z.string().trim().min(2).max(200),
    logo_url: url,
    country_code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{2}$/),
    city: text(120),
    levels: z.array(z.enum(LEVELS)).max(LEVELS.length),
    categories: z.array(z.enum(CATEGORIES)).max(CATEGORIES.length),
    fields: list,
    tags: list,
    eligible_nationalities: text(2000),
    algeria_eligible: z.enum(["yes", "no", "unknown"]),
    qualifications: text(3000),
    age_limit: text(300),
    language_requirements: text(1000),
    funding_type: z.enum(FUNDING),
    tuition: text(1000),
    stipend: text(1000),
    accommodation: text(1000),
    travel: text(1000),
    insurance: text(1000),
    duration: text(300),
    opens_at: localDate,
    deadline_at: localDate,
    deadline_note: text(1000),
    deadline_tz: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .refine((v) => v === null || isTimeZone(v), { message: "invalid-timezone" }),
    application_url: url,
    source_url: url,
    verified_at: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: "invalid-date" }),
    verification: z.enum(["verified", "needs_verification"]),
    summary: text(400),
    description: text(10000),
    documents: text(5000),
    instructions: text(5000),
    featured: z.boolean(),
    status: z.enum(WORKFLOW),
  })
  .transform((v) => {
    // dates are typed in the official time zone (Algiers when the source states none)
    const tz = v.deadline_tz ?? "Africa/Algiers";
    return {
      ...v,
      slug: slugify(v.slug || v.title),
      opens_at: v.opens_at ? zonedToIso(v.opens_at, tz) : null,
      deadline_at: v.deadline_at ? zonedToIso(v.deadline_at, tz) : null,
    };
  })
  .refine((v) => v.slug.length > 0, { path: ["slug"], message: "required" })
  .refine((v) => !v.opens_at || !v.deadline_at || v.opens_at <= v.deadline_at, { path: ["deadline_at"], message: "before-opening" })
  .refine((v) => v.status !== "published" || !!v.source_url, { path: ["source_url"], message: "required-to-publish" });

export type ScholarshipData = z.output<typeof ScholarshipInput>;

/** Reads the admin form; checkboxes and multi-selects come as repeated fields. */
export function parseScholarshipForm(form: FormData) {
  const get = (k: string) => String(form.get(k) ?? "");
  return ScholarshipInput.safeParse({
    title: get("title"),
    slug: get("slug"),
    content_lang: get("content_lang") || "en",
    institution: get("institution"),
    logo_url: get("logo_url"),
    country_code: get("country_code"),
    city: get("city"),
    levels: form.getAll("levels").map(String),
    categories: form.getAll("categories").map(String),
    fields: get("fields"),
    tags: get("tags"),
    eligible_nationalities: get("eligible_nationalities"),
    algeria_eligible: get("algeria_eligible") || "unknown",
    qualifications: get("qualifications"),
    age_limit: get("age_limit"),
    language_requirements: get("language_requirements"),
    funding_type: get("funding_type") || "unknown",
    tuition: get("tuition"),
    stipend: get("stipend"),
    accommodation: get("accommodation"),
    travel: get("travel"),
    insurance: get("insurance"),
    duration: get("duration"),
    opens_at: get("opens_at"),
    deadline_at: get("deadline_at"),
    deadline_note: get("deadline_note"),
    deadline_tz: get("deadline_tz"),
    application_url: get("application_url"),
    source_url: get("source_url"),
    verified_at: get("verified_at"),
    verification: get("verification") || "needs_verification",
    summary: get("summary"),
    description: get("description"),
    documents: get("documents"),
    instructions: get("instructions"),
    featured: form.get("featured") === "on",
    status: get("status") || "draft",
  });
}

// ── Writes ─────────────────────────────────────────────────────────────────

/** Inserts or updates; returns the id. Throws "SLUG_TAKEN" when the slug belongs to another row. */
export async function saveScholarship(id: string | null, d: ScholarshipData, userId: string): Promise<string> {
  const sql = db();
  const [clash] = await sql`select id from scholarships where slug = ${d.slug} and id is distinct from ${id}::uuid`;
  if (clash) throw new Error("SLUG_TAKEN");
  const values = [
    d.slug, d.content_lang, d.title, d.institution, d.logo_url, d.country_code, d.city, d.levels, d.categories,
    d.fields, d.tags, d.eligible_nationalities, d.algeria_eligible, d.qualifications, d.age_limit,
    d.language_requirements, d.funding_type, d.tuition, d.stipend, d.accommodation, d.travel, d.insurance,
    d.duration, d.opens_at, d.deadline_at, d.deadline_note, d.application_url, d.source_url, d.verified_at,
    d.verification, d.summary, d.description, d.documents, d.instructions, d.featured, d.status, d.deadline_tz, userId,
  ];
  const cols = `slug, content_lang, title, institution, logo_url, country_code, city, levels, categories, fields, tags,
    eligible_nationalities, algeria_eligible, qualifications, age_limit, language_requirements, funding_type, tuition,
    stipend, accommodation, travel, insurance, duration, opens_at, deadline_at, deadline_note, application_url,
    source_url, verified_at, verification, summary, description, documents, instructions, featured, status, deadline_tz`;
  const params = values.map((_, i) => `$${i + 1}`);
  if (!id) {
    const [row] = await sql.query(
      `insert into scholarships (${cols}, created_by, updated_by, published_at)
       values (${params.slice(0, -1).join(", ")}, $${values.length}, $${values.length},
               case when $36 = 'published' then now() end)
       returning id`,
      values,
    );
    return row.id as string;
  }
  const sets = cols
    .split(",")
    .map((c, i) => `${c.trim()} = $${i + 1}`)
    .join(", ");
  const [row] = await sql.query(
    `update scholarships set ${sets}, updated_by = $${values.length}, updated_at = now(),
       published_at = case when $36 = 'published' then coalesce(published_at, now()) else published_at end
     where id = $${values.length + 1} returning id`,
    [...values, id],
  );
  if (!row) throw new Error("NOT_FOUND");
  return row.id as string;
}

export async function setStatus(id: string, status: (typeof WORKFLOW)[number], userId: string) {
  const [row] = await db()`
    update scholarships set status = ${status}, updated_by = ${userId}, updated_at = now(),
      published_at = case when ${status} = 'published' then coalesce(published_at, now()) else published_at end
    where id = ${id} returning id`;
  return !!row;
}

export async function duplicateScholarship(id: string, userId: string): Promise<string | null> {
  const original = await getById(id);
  if (!original) return null;
  let slug = `${original.slug}-copy`.slice(0, 80);
  for (let n = 2; (await db()`select 1 from scholarships where slug = ${slug}`).length; n++) slug = `${original.slug}-copy-${n}`.slice(0, 80);
  const [row] = await db()`
    insert into scholarships (
      slug, content_lang, title, institution, logo_url, country_code, city, levels, categories, fields, tags,
      eligible_nationalities, algeria_eligible, qualifications, age_limit, language_requirements, funding_type, tuition,
      stipend, accommodation, travel, insurance, duration, opens_at, deadline_at, deadline_note, deadline_tz, application_url,
      source_url, verified_at, verification, summary, description, documents, instructions, featured, status,
      created_by, updated_by)
    select ${slug}, content_lang, title || ' (copy)', institution, logo_url, country_code, city, levels, categories, fields, tags,
      eligible_nationalities, algeria_eligible, qualifications, age_limit, language_requirements, funding_type, tuition,
      stipend, accommodation, travel, insurance, duration, opens_at, deadline_at, deadline_note, deadline_tz, application_url,
      source_url, null, 'needs_verification', summary, description, documents, instructions, false, 'draft',
      ${userId}, ${userId}
    from scholarships where id = ${id} returning id`;
  return row?.id ?? null;
}

export async function deleteScholarship(id: string) {
  const [row] = await db()`delete from scholarships where id = ${id} returning id`;
  return !!row;
}

export async function addSource(id: string, url: string, label: string | null, checkedAt: string | null) {
  await db()`insert into scholarship_sources (scholarship_id, url, label, checked_at) values (${id}, ${url}, ${label}, ${checkedAt})`;
}
export async function removeSource(sourceId: string) {
  await db()`delete from scholarship_sources where id = ${sourceId}`;
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export async function dashboardStats() {
  const [s] = await db()`
    select
      count(*)::int as total,
      count(*) filter (where status = 'published')::int as published,
      count(*) filter (where status = 'draft')::int as drafts,
      count(*) filter (where status in ('review', 'approved'))::int as in_review,
      count(*) filter (where status = 'archived')::int as archived,
      count(*) filter (where status = 'published' and (deadline_at is null or deadline_at >= now()) and (opens_at is null or opens_at <= now()))::int as open,
      count(*) filter (where status = 'published' and deadline_at >= now() and deadline_at < now() + interval '7 days')::int as closing,
      count(*) filter (where deadline_at < now() and status <> 'archived')::int as expired,
      count(*) filter (where verification = 'needs_verification' or verified_at is null or verified_at < current_date - 30)::int as needs_verification
    from scholarships`;
  const [sub] = await db()`select count(*) filter (where unsubscribed_at is null)::int as subscribers from newsletter_subscribers`;
  const deadlines = (await db()`
    select to_char(date_trunc('month', deadline_at at time zone 'Africa/Algiers'), 'YYYY-MM') as month, count(*)::int as n
    from scholarships where status = 'published' and deadline_at >= date_trunc('month', now())
    group by 1 order by 1 limit 6`) as { month: string; n: number }[];
  const activity = (await db()`
    select a.id, a.action, a.entity, a.entity_id, a.detail, a.created_at, u.name as user_name
    from activity_logs a left join admin_users u on u.id = a.user_id
    order by a.created_at desc limit 12`) as {
    id: number;
    action: string;
    entity: string;
    entity_id: string | null;
    detail: Record<string, string> | null;
    created_at: Date;
    user_name: string | null;
  }[];
  return { ...s, ...sub, deadlines, activity } as Record<string, number> & {
    deadlines: typeof deadlines;
    activity: typeof activity;
  };
}
