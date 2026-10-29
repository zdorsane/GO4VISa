"use client";

import { useRef, useState, useTransition } from "react";
import { uploadMediaAction } from "../actions";

const ERRORS: Record<string, string> = {
  empty: "Choisissez une image.",
  "too-large": "Image trop lourde (4 Mo maximum).",
  "bad-type": "Format refusé : PNG, JPEG, WebP ou GIF uniquement.",
  "storage-missing": "Le stockage d'images n'est pas configuré (BLOB_READ_WRITE_TOKEN).",
};

/** URL field with an upload button: the image goes to Vercel Blob and its URL fills the field. */
export function ImageField({ name, label, defaultValue, hint }: { name: string; label: string; defaultValue?: string | null; hint?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  const upload = (file: File) => {
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    start(async () => {
      const res = await uploadMediaAction(undefined, fd);
      if (res?.url) setUrl(res.url);
      else setError(ERRORS[res?.error ?? ""] ?? "Échec de l'envoi.");
      if (input.current) input.current.value = "";
    });
  };

  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="mt-1 flex items-start gap-3">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-cloud">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary URL
            <img src={url} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-slate">Aucune</span>
          )}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="admin-input" />
          <div className="flex flex-wrap items-center gap-2">
            <label className="admin-btn admin-btn-ghost cursor-pointer !py-1.5 text-xs">
              {pending ? "Envoi…" : "Importer une image"}
              <input
                ref={input}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                disabled={pending}
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </label>
            {url && (
              <button type="button" onClick={() => setUrl("")} className="text-xs text-slate hover:text-red-700">
                Retirer
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-700">{error}</p>}
          {hint && <p className="admin-hint">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
