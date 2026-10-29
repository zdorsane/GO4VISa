import "server-only";
import { randomBytes } from "node:crypto";
import { del, put } from "@vercel/blob";
import { db } from "./db";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Allowed image types, checked against the file's first bytes (not just its declared type or name). */
const SIGNATURES: { type: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { type: "image/png", ext: "png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { type: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/webp", ext: "webp", test: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP" },
  { type: "image/gif", ext: "gif", test: (b) => String.fromCharCode(...b.slice(0, 4)) === "GIF8" },
];

export type MediaItem = { id: string; url: string; pathname: string; content_type: string; size: number; alt: string | null; created_at: string };

export class UploadError extends Error {}

export async function uploadImage(file: File, alt: string | null, userId: string): Promise<MediaItem> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new UploadError("storage-missing");
  if (!file || file.size === 0) throw new UploadError("empty");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("too-large");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = SIGNATURES.find((s) => s.test(bytes));
  if (!kind) throw new UploadError("bad-type");

  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image";
  const pathname = `media/${base}-${randomBytes(4).toString("hex")}.${kind.ext}`;
  const blob = await put(pathname, Buffer.from(bytes), { access: "public", contentType: kind.type, addRandomSuffix: false });

  const [row] = await db()`
    insert into media (url, pathname, content_type, size, alt, uploaded_by)
    values (${blob.url}, ${blob.pathname}, ${kind.type}, ${file.size}, ${alt}, ${userId})
    returning id, url, pathname, content_type, size, alt, created_at`;
  return { ...(row as MediaItem), created_at: new Date(row.created_at).toISOString() };
}

export async function listMedia(): Promise<MediaItem[]> {
  const rows = await db()`select id, url, pathname, content_type, size, alt, created_at from media order by created_at desc limit 200`;
  return rows.map((r) => ({ ...(r as MediaItem), created_at: new Date(r.created_at).toISOString() }));
}

export async function deleteMedia(id: string) {
  const [row] = await db()`delete from media where id = ${id} returning url`;
  if (row) await del(row.url);
  return !!row;
}
