import "server-only";
import * as z from "zod";
import { slugify } from "@/lib/scholarships";
import { NEWS_CATEGORIES, NEWS_LABELS, type NewsArticle } from "@/lib/news";
import { db } from "./db";

const COLUMNS = `n.id, n.slug, n.content_lang, n.title, n.cover_url, n.summary, n.body, n.category, n.labels, n.country_code,
  n.university, n.author, n.source_url, n.scholarship_id, n.seo_title, n.seo_description, n.status, n.published_at,
  n.created_at, n.updated_at, s.slug as scholarship_slug, s.title as scholarship_title, s.deadline_at as scholarship_deadline`;

const toIso = (v: unknown) => (v instanceof Date ? v.toISOString() : (v as string | null));
const normalize = (r: Record<string, unknown>): NewsArticle => ({
  ...(r as unknown as NewsArticle),
  published_at: toIso(r.published_at),
  created_at: toIso(r.created_at)!,
  updated_at: toIso(r.updated_at)!,
  scholarship_deadline: toIso(r.scholarship_deadline),
});

export async function listPublishedNews(limit = 50): Promise<NewsArticle[]> {
  const rows = await db().query(
    `select ${COLUMNS} from news n left join scholarships s on s.id = n.scholarship_id and s.status = 'published'
     where n.status = 'published' and n.published_at <= now() order by n.published_at desc limit $1`,
    [limit],
  );
  return rows.map(normalize);
}

export async function getPublishedNews(slug: string): Promise<NewsArticle | null> {
  const [r] = await db().query(
    `select ${COLUMNS} from news n left join scholarships s on s.id = n.scholarship_id and s.status = 'published'
     where n.slug = $1 and n.status = 'published' and n.published_at <= now()`,
    [slug],
  );
  return r ? normalize(r) : null;
}

export async function listAllNews(): Promise<NewsArticle[]> {
  const rows = await db().query(`select ${COLUMNS} from news n left join scholarships s on s.id = n.scholarship_id order by n.updated_at desc`);
  return rows.map(normalize);
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const [r] = await db().query(`select ${COLUMNS} from news n left join scholarships s on s.id = n.scholarship_id where n.id = $1`, [id]);
  return r ? normalize(r) : null;
}

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable();
const url = text(1000).refine((v) => v === null || /^https?:\/\/[^\s]+\.[^\s]+/.test(v), { message: "invalid-url" });

export const NewsInput = z
  .object({
    title: z.string().trim().min(3).max(200),
    slug: z.string().trim().max(80),
    content_lang: z.enum(["fr", "en", "ar"]),
    cover_url: url,
    summary: text(400),
    body: z.string().max(50000),
    category: z.enum(NEWS_CATEGORIES),
    labels: z.array(z.enum(NEWS_LABELS)).max(NEWS_LABELS.length),
    country_code: z
      .string()
      .trim()
      .toUpperCase()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .refine((v) => v === null || /^[A-Z]{2}$/.test(v), { message: "invalid-country" }),
    university: text(200),
    author: text(120),
    source_url: url,
    scholarship_id: z
      .string()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .refine((v) => v === null || z.uuid().safeParse(v).success),
    seo_title: text(70),
    seo_description: text(170),
    status: z.enum(["draft", "published"]),
    published_at: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : new Date(`${v}:00+01:00`)))
      .refine((d) => d === null || !Number.isNaN(d.getTime()), { message: "invalid-date" })
      .transform((d) => (d ? d.toISOString() : null)),
  })
  .transform((v) => ({ ...v, slug: slugify(v.slug || v.title) }))
  .refine((v) => v.slug.length > 0, { path: ["slug"], message: "required" });
export type NewsData = z.output<typeof NewsInput>;

export function parseNewsForm(form: FormData) {
  const get = (k: string) => String(form.get(k) ?? "");
  return NewsInput.safeParse({
    title: get("title"),
    slug: get("slug"),
    content_lang: get("content_lang") || "fr",
    cover_url: get("cover_url"),
    summary: get("summary"),
    body: get("body"),
    category: get("category") || "announcement",
    labels: form.getAll("labels").map(String),
    country_code: get("country_code"),
    university: get("university"),
    author: get("author"),
    source_url: get("source_url"),
    scholarship_id: get("scholarship_id"),
    seo_title: get("seo_title"),
    seo_description: get("seo_description"),
    status: get("status") || "draft",
    published_at: get("published_at"),
  });
}

export async function saveNews(id: string | null, d: NewsData, userId: string): Promise<string> {
  const sql = db();
  const [clash] = await sql`select id from news where slug = ${d.slug} and id is distinct from ${id}::uuid`;
  if (clash) throw new Error("SLUG_TAKEN");
  const publishedAt = d.status === "published" ? (d.published_at ?? new Date().toISOString()) : d.published_at;
  if (!id) {
    const [row] = await sql`
      insert into news (slug, content_lang, title, cover_url, summary, body, category, labels, country_code, university,
        author, source_url, scholarship_id, seo_title, seo_description, status, published_at, created_by, updated_by)
      values (${d.slug}, ${d.content_lang}, ${d.title}, ${d.cover_url}, ${d.summary}, ${d.body}, ${d.category}, ${d.labels},
        ${d.country_code}, ${d.university}, ${d.author}, ${d.source_url}, ${d.scholarship_id}, ${d.seo_title},
        ${d.seo_description}, ${d.status}, ${publishedAt}, ${userId}, ${userId})
      returning id`;
    return row.id;
  }
  const [row] = await sql`
    update news set slug = ${d.slug}, content_lang = ${d.content_lang}, title = ${d.title}, cover_url = ${d.cover_url},
      summary = ${d.summary}, body = ${d.body}, category = ${d.category}, labels = ${d.labels},
      country_code = ${d.country_code}, university = ${d.university}, author = ${d.author}, source_url = ${d.source_url},
      scholarship_id = ${d.scholarship_id}, seo_title = ${d.seo_title}, seo_description = ${d.seo_description},
      status = ${d.status}, published_at = ${publishedAt}, updated_by = ${userId}, updated_at = now()
    where id = ${id} returning id`;
  if (!row) throw new Error("NOT_FOUND");
  return row.id;
}

export async function deleteNews(id: string) {
  const [row] = await db()`delete from news where id = ${id} returning id`;
  return !!row;
}
