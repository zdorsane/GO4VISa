import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { deadlineStatus, type DeadlineStatus, type Scholarship } from "@/lib/scholarships";
import { hasDatabase } from "./db";
import { getPublishedBySlug, getSources, listPublished, type Source } from "./scholarships";

/** A published opportunity with its deadline status as of the cache time (browsers recompute it live). */
export type PublicScholarship = Scholarship & { deadline_status: DeadlineStatus };

const withStatus = (s: Scholarship, now: Date): PublicScholarship => ({ ...s, deadline_status: deadlineStatus(s, now) });

/**
 * Cached reads for public pages. Admin actions expire the "scholarships" tag
 * immediately; otherwise the data refreshes hourly so deadline statuses roll over.
 */
export async function getPublicScholarships(): Promise<PublicScholarship[]> {
  "use cache";
  cacheTag("scholarships");
  cacheLife("hours");
  if (!hasDatabase()) return [];
  const now = new Date();
  return (await listPublished()).map((s) => withStatus(s, now));
}

export async function getPublicScholarship(slug: string): Promise<{ scholarship: PublicScholarship; sources: Source[] } | null> {
  "use cache";
  cacheTag("scholarships");
  cacheLife("hours");
  if (!hasDatabase()) return null;
  const s = await getPublishedBySlug(slug);
  if (!s) return null;
  return { scholarship: withStatus(s, new Date()), sources: await getSources(s.id) };
}


/** Fields the cards and the directory filters need (keeps long texts out of the page payload). */
export type ListItem = Pick<
  PublicScholarship,
  | "slug"
  | "title"
  | "institution"
  | "logo_url"
  | "country_code"
  | "city"
  | "levels"
  | "categories"
  | "fields"
  | "tags"
  | "algeria_eligible"
  | "verification"
  | "funding_type"
  | "summary"
  | "opens_at"
  | "deadline_at"
  | "deadline_tz"
  | "deadline_status"
  | "application_url"
  | "source_url"
  | "featured"
  | "published_at"
  | "created_at"
  | "updated_at"
>;

export function toListItem(s: PublicScholarship): ListItem {
  return {
    slug: s.slug,
    title: s.title,
    institution: s.institution,
    logo_url: s.logo_url,
    country_code: s.country_code,
    city: s.city,
    levels: s.levels,
    categories: s.categories,
    fields: s.fields,
    tags: s.tags,
    algeria_eligible: s.algeria_eligible,
    verification: s.verification,
    funding_type: s.funding_type,
    summary: s.summary,
    opens_at: s.opens_at,
    deadline_at: s.deadline_at,
    deadline_tz: s.deadline_tz,
    deadline_status: s.deadline_status,
    application_url: s.application_url,
    source_url: s.source_url,
    featured: s.featured,
    published_at: s.published_at,
    created_at: s.created_at,
    updated_at: s.updated_at,
  };
}
