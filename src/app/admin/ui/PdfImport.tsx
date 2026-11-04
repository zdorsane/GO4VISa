"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";
import { importPdfAction } from "../actions";
import { WORKFLOW_LABEL } from "./labels";
import type { Workflow } from "@/lib/scholarships";

const ERRORS: Record<string, string> = {
  "bad-file": "Ce fichier n'est pas un PDF valide.",
  "too-large": "PDF trop lourd (30 Mo maximum).",
  "no-api-key": "La clé de l'IA (GEMINI_API_KEY) n'est pas configurée : ajoutez-la dans .env.local (en local) ou dans les réglages Vercel (en ligne).",
  "bad-api-key": "La clé de l'IA (GEMINI_API_KEY) est refusée par Google : recréez-la sur aistudio.google.com.",
  busy: "L'IA de Google est surchargée en ce moment : réessayez dans quelques minutes.",
  quota: "Limite gratuite de l'IA atteinte pour le moment : réessayez dans quelques minutes (ou demain).",
  refused: "L'IA a refusé de traiter ce document.",
  "too-long": "Le PDF contient trop de bourses pour un seul import : découpez-le en plusieurs fichiers.",
  unreadable: "L'IA n'a pas pu lire ce PDF. Vérifiez qu'il contient du texte (pas seulement des images floues).",
  failed: "L'import a échoué. Réessayez dans quelques minutes.",
  upload: "L'envoi du fichier a échoué.",
};

export function PdfImport({ publish }: { publish: boolean }) {
  const [state, action, pending] = useActionState(importPdfAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const busy = uploading || pending;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = new FormData(e.currentTarget).get("file");
    if (!(file instanceof File) || file.size === 0) return;
    setUploadError(false);
    setUploading(true);
    try {
      const blob = await upload("imports/import.pdf", file, {
        access: "public",
        contentType: "application/pdf",
        handleUploadUrl: "/api/admin/pdf-upload",
      });
      const form = new FormData();
      form.set("url", blob.url);
      startTransition(() => action(form));
    } catch {
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  }

  const r = state?.report;
  const error = uploadError ? "upload" : state?.error;
  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="admin-card grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="block">
          <span className="admin-label">Fichier PDF</span>
          <input
            type="file"
            name="file"
            required
            accept="application/pdf,.pdf"
            disabled={busy}
            className="admin-input mt-1 file:me-3 file:rounded-lg file:border-0 file:bg-cloud file:px-3 file:py-1 file:text-sm"
          />
        </label>
        <button disabled={busy} className="admin-btn admin-btn-gold">
          {uploading ? "Envoi du fichier…" : pending ? "Lecture par l'IA…" : publish ? "Importer et publier" : "Importer"}
        </button>
        {pending && (
          <p role="status" className="text-sm text-slate sm:col-span-2">
            L&apos;IA lit le document : comptez une à trois minutes. Gardez cette page ouverte.
          </p>
        )}
        {error && !busy && (
          <p role="alert" className="text-sm text-red-700 sm:col-span-2">
            {ERRORS[error] ?? ERRORS.failed}
          </p>
        )}
      </form>

      {r && !busy && (
        <section role="status" className="admin-card space-y-4">
          <h2 className="font-semibold text-midnight">
            Import terminé : {r.created.length} ajoutée{r.created.length > 1 ? "s" : ""}, {r.updated.length} mise
            {r.updated.length > 1 ? "s" : ""} à jour
          </h2>
          <ResultList title="Nouvelles bourses" items={r.created} />
          <ResultList title="Bourses mises à jour" items={r.updated} />
          {r.kept.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-midnight">Déjà vérifiées, non modifiées ({r.kept.length})</h3>
              <p className="text-xs text-slate">Ces bourses ont été vérifiées sur leur site officiel : modifiez-les depuis leur fiche si besoin.</p>
              <ul className="mt-1 list-disc ps-5 text-sm text-slate">
                {r.kept.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {r.expired.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-midnight">Ignorées : date limite passée ({r.expired.length})</h3>
              <ul className="mt-1 list-disc ps-5 text-sm text-slate">
                {r.expired.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {r.failed.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-red-700">Non importées ({r.failed.length}) : à ajouter à la main</h3>
              <ul className="mt-1 list-disc ps-5 text-sm text-slate">
                {r.failed.map((f) => (
                  <li key={f.title}>{f.title}</li>
                ))}
              </ul>
            </div>
          )}
          {!r.created.length && !r.updated.length && !r.kept.length && !r.expired.length && !r.failed.length && (
            <p className="text-sm text-slate">Aucune bourse trouvée dans ce document.</p>
          )}
        </section>
      )}
    </div>
  );
}

function ResultList({ title, items }: { title: string; items: { id: string; title: string; status: string }[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-sm font-medium text-midnight">
        {title} ({items.length})
      </h3>
      <ul className="mt-1 divide-y divide-cloud text-sm">
        {items.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-3 py-1.5">
            <Link href={`/admin/scholarships/${s.id}`} className="text-midnight hover:underline">
              {s.title}
            </Link>
            <span className="shrink-0 text-xs text-slate">{WORKFLOW_LABEL[s.status as Workflow]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
