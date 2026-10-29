"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import * as z from "zod";
import { can, login, logActivity, logout, requireAdmin } from "@/lib/server/auth";
import {
  addSource,
  deleteScholarship,
  duplicateScholarship,
  getById,
  parseScholarshipForm,
  removeSource,
  saveScholarship,
  setStatus,
} from "@/lib/server/scholarships";
import { deleteNews, getNewsById, parseNewsForm, saveNews } from "@/lib/server/news";
import { deleteMedia, uploadImage, UploadError } from "@/lib/server/media";
import { WORKFLOW } from "@/lib/scholarships";

export type FormState = { ok?: boolean; error?: string; fields?: Record<string, string[]>; message?: string } | undefined;

const uuid = z.uuid();
const refreshScholarships = () => updateTag("scholarships");
const refreshNews = () => updateTag("news");

// ── Session ────────────────────────────────────────────────────────────────

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "missing" };
  const result = await login(email, password);
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

// ── Scholarships ───────────────────────────────────────────────────────────

export async function saveScholarshipAction(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin("edit");
  const id = String(form.get("id") ?? "") || null;
  if (id && !uuid.safeParse(id).success) return { error: "not-found" };

  const parsed = parseScholarshipForm(form);
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) (fields[String(issue.path[0])] ??= []).push(issue.message);
    return { error: "invalid", fields };
  }
  const data = parsed.data;

  // editors can move work up to "review"; approving, publishing and archiving need an admin
  const previous = id ? await getById(id) : null;
  const statusChanged = data.status !== (previous?.status ?? "draft");
  if (statusChanged && !["draft", "review"].includes(data.status) && !can(admin.role, "publish")) {
    return { error: "forbidden-status" };
  }
  if (!statusChanged && previous && ["approved", "published", "archived"].includes(previous.status) && !can(admin.role, "publish")) {
    return { error: "forbidden-status" };
  }

  let savedId: string;
  try {
    savedId = await saveScholarship(id, data, admin.id);
  } catch (e) {
    if (e instanceof Error && e.message === "SLUG_TAKEN") return { error: "invalid", fields: { slug: ["taken"] } };
    throw e;
  }
  await logActivity(admin.id, id ? "update" : "create", "scholarship", savedId, { title: data.title, status: data.status });
  refreshScholarships();
  if (!id) redirect(`/admin/scholarships/${savedId}?saved=1`);
  return { ok: true };
}

export async function setScholarshipStatusAction(form: FormData) {
  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!uuid.safeParse(id).success || !(WORKFLOW as readonly string[]).includes(status)) return;
  const admin = await requireAdmin(["draft", "review"].includes(status) ? "edit" : "publish");
  const current = await getById(id);
  if (!current) return;
  if (status === "published" && !current.source_url) redirect(`/admin/scholarships/${id}?error=no-source`);
  await setStatus(id, status as (typeof WORKFLOW)[number], admin.id);
  await logActivity(admin.id, `status:${status}`, "scholarship", id, { title: current.title });
  refreshScholarships();
  redirect(`/admin/scholarships/${id}?saved=1`);
}

export async function duplicateScholarshipAction(form: FormData) {
  const id = String(form.get("id"));
  if (!uuid.safeParse(id).success) return;
  const admin = await requireAdmin("edit");
  const copy = await duplicateScholarship(id, admin.id);
  if (!copy) return;
  await logActivity(admin.id, "duplicate", "scholarship", copy, { from: id });
  redirect(`/admin/scholarships/${copy}?saved=1`);
}

export async function deleteScholarshipAction(form: FormData) {
  const id = String(form.get("id"));
  if (!uuid.safeParse(id).success) return;
  const admin = await requireAdmin("delete");
  const current = await getById(id);
  if (!current) redirect("/admin/scholarships");
  await deleteScholarship(id);
  await logActivity(admin.id, "delete", "scholarship", id, { title: current.title });
  refreshScholarships();
  redirect("/admin/scholarships?deleted=1");
}

export async function addSourceAction(form: FormData) {
  const id = String(form.get("id"));
  const url = String(form.get("url") ?? "").trim();
  const label = String(form.get("label") ?? "").trim() || null;
  const checked = String(form.get("checked_at") ?? "").trim() || null;
  if (!uuid.safeParse(id).success || !/^https?:\/\/[^\s]+\.[^\s]+/.test(url)) redirect(`/admin/scholarships/${id}?error=source-url`);
  if (checked && !/^\d{4}-\d{2}-\d{2}$/.test(checked)) redirect(`/admin/scholarships/${id}?error=source-url`);
  const admin = await requireAdmin("edit");
  await addSource(id, url, label, checked);
  await logActivity(admin.id, "add-source", "scholarship", id, { url });
  refreshScholarships();
  redirect(`/admin/scholarships/${id}?saved=1#sources`);
}

export async function removeSourceAction(form: FormData) {
  const id = String(form.get("id"));
  const sourceId = String(form.get("source_id"));
  if (!uuid.safeParse(id).success || !uuid.safeParse(sourceId).success) return;
  const admin = await requireAdmin("edit");
  await removeSource(sourceId);
  await logActivity(admin.id, "remove-source", "scholarship", id);
  refreshScholarships();
  redirect(`/admin/scholarships/${id}#sources`);
}

// ── News ───────────────────────────────────────────────────────────────────

export async function saveNewsAction(_: FormState, form: FormData): Promise<FormState> {
  const id = String(form.get("id") ?? "") || null;
  if (id && !uuid.safeParse(id).success) return { error: "not-found" };
  const parsed = parseNewsForm(form);
  // publishing (or editing what is live) is reserved to admins
  const previous = id ? await getNewsById(id) : null;
  const touchesLive = (parsed.success && parsed.data.status === "published") || previous?.status === "published";
  const admin = await requireAdmin(touchesLive ? "publish" : "edit").catch((e) => {
    if (e instanceof Error && e.message === "FORBIDDEN") return null;
    throw e;
  });
  if (!admin) return { error: "forbidden-status" };
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) (fields[String(issue.path[0])] ??= []).push(issue.message);
    return { error: "invalid", fields };
  }
  let savedId: string;
  try {
    savedId = await saveNews(id, parsed.data, admin.id);
  } catch (e) {
    if (e instanceof Error && e.message === "SLUG_TAKEN") return { error: "invalid", fields: { slug: ["taken"] } };
    throw e;
  }
  await logActivity(admin.id, id ? "update" : "create", "news", savedId, { title: parsed.data.title, status: parsed.data.status });
  refreshNews();
  if (!id) redirect(`/admin/news/${savedId}?saved=1`);
  return { ok: true };
}

export async function deleteNewsAction(form: FormData) {
  const id = String(form.get("id"));
  if (!uuid.safeParse(id).success) return;
  const admin = await requireAdmin("delete");
  const current = await getNewsById(id);
  if (!current) redirect("/admin/news");
  await deleteNews(id);
  await logActivity(admin.id, "delete", "news", id, { title: current.title });
  refreshNews();
  redirect("/admin/news?deleted=1");
}

// ── Media ──────────────────────────────────────────────────────────────────

export type UploadState = { url?: string; error?: string } | undefined;

export async function uploadMediaAction(_: UploadState, form: FormData): Promise<UploadState> {
  const admin = await requireAdmin("media");
  const file = form.get("file");
  if (!(file instanceof File)) return { error: "empty" };
  const alt = String(form.get("alt") ?? "").trim().slice(0, 200) || null;
  try {
    const item = await uploadImage(file, alt, admin.id);
    await logActivity(admin.id, "upload", "media", item.id, { pathname: item.pathname });
    return { url: item.url };
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
}

export async function deleteMediaAction(form: FormData) {
  const id = String(form.get("id"));
  if (!uuid.safeParse(id).success) return;
  const admin = await requireAdmin("delete");
  await deleteMedia(id);
  await logActivity(admin.id, "delete", "media", id);
  redirect("/admin/media");
}
