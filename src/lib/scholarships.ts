/** Scholarship vocabulary and the automatic deadline status, shared by the site and the back-office. */

export const LEVELS = ["highschool", "bachelor", "master", "phd", "postdoc", "professional"] as const;
export type Level = (typeof LEVELS)[number];

export const CATEGORIES = [
  "undergraduate",
  "masters",
  "phd",
  "postdoc",
  "research-fellowship",
  "summer-school",
  "internship",
  "leadership",
  "exchange",
  "volunteering",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const FUNDING = ["full", "partial", "stipend", "unpaid", "unknown"] as const;
export type Funding = (typeof FUNDING)[number];

export const WORKFLOW = ["draft", "review", "approved", "published", "archived"] as const;
export type Workflow = (typeof WORKFLOW)[number];

export type Scholarship = {
  id: string;
  slug: string;
  content_lang: "fr" | "en" | "ar";
  title: string;
  institution: string;
  logo_url: string | null;
  country_code: string;
  city: string | null;
  levels: Level[];
  categories: Category[];
  fields: string[];
  tags: string[];
  eligible_nationalities: string | null;
  algeria_eligible: "yes" | "no" | "unknown";
  qualifications: string | null;
  age_limit: string | null;
  language_requirements: string | null;
  funding_type: Funding;
  tuition: string | null;
  stipend: string | null;
  accommodation: string | null;
  travel: string | null;
  insurance: string | null;
  duration: string | null;
  opens_at: string | null;
  deadline_at: string | null;
  deadline_note: string | null;
  application_url: string | null;
  source_url: string | null;
  verified_at: string | null;
  verification: "verified" | "needs_verification";
  summary: string | null;
  description: string | null;
  documents: string | null;
  instructions: string | null;
  featured: boolean;
  status: Workflow;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const DEADLINE_STATUSES = ["today", "closing", "open", "upcoming", "closed", "rolling"] as const;
export type DeadlineStatus = (typeof DEADLINE_STATUSES)[number];

/** Calendar day (YYYY-MM-DD) of an instant, in Algiers time, the site's reference timezone. */
export function dayKey(d: Date, timeZone = "Africa/Algiers") {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

const DAY = 24 * 60 * 60 * 1000;
export const CLOSING_SOON_DAYS = 7;

/**
 * Status computed from the dates and the current time, never stored:
 * closed (deadline passed) · today · closing (≤ 7 days) · upcoming (opens later) · open · rolling (no deadline).
 */
export function deadlineStatus(s: Pick<Scholarship, "opens_at" | "deadline_at">, now = new Date()): DeadlineStatus {
  const deadline = s.deadline_at ? new Date(s.deadline_at) : null;
  const opens = s.opens_at ? new Date(s.opens_at) : null;
  if (deadline && deadline.getTime() < now.getTime()) return "closed";
  if (opens && opens.getTime() > now.getTime()) return "upcoming";
  if (!deadline) return "rolling";
  if (dayKey(deadline) === dayKey(now)) return "today";
  if (deadline.getTime() - now.getTime() <= CLOSING_SOON_DAYS * DAY) return "closing";
  return "open";
}

/** Whole days left before the deadline (0 on the last day), or null. */
export function daysLeft(deadlineAt: string | null, now = new Date()) {
  if (!deadlineAt) return null;
  const ms = new Date(deadlineAt).getTime() - now.getTime();
  return ms < 0 ? null : Math.floor(ms / DAY);
}

/** Publishing checks shown to the administrator before an opportunity goes live. */
export type Warning = "no-source" | "bad-link" | "deadline-passed" | "eligibility-missing" | "stale" | "unverified" | "algeria-unknown";

export const STALE_AFTER_DAYS = 30;

export function isHttpUrl(v: string | null | undefined) {
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function publishWarnings(s: Partial<Scholarship>, now = new Date()): Warning[] {
  const w: Warning[] = [];
  if (!s.source_url) w.push("no-source");
  if (s.application_url !== undefined && s.application_url !== null && !isHttpUrl(s.application_url)) w.push("bad-link");
  if (!s.application_url && !s.source_url) w.push("bad-link");
  if (s.deadline_at && new Date(s.deadline_at).getTime() < now.getTime()) w.push("deadline-passed");
  if (!s.eligible_nationalities || !s.qualifications || !s.levels?.length) w.push("eligibility-missing");
  if (!s.verified_at) w.push("unverified");
  else if (now.getTime() - new Date(s.verified_at).getTime() > STALE_AFTER_DAYS * DAY) w.push("stale");
  if (s.verification === "needs_verification") w.push("unverified");
  if (!s.algeria_eligible || s.algeria_eligible === "unknown") w.push("algeria-unknown");
  return [...new Set(w)];
}

/** URL-safe slug from a title. */
export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
