"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { uploadMediaAction } from "../actions";
import { useT } from "./AdminLang";

const ERRORS: Record<string, string> = {
  empty: "Choisissez une image.",
  "too-large": "Image trop lourde (4 Mo maximum).",
  "bad-type": "Format refusé : PNG, JPEG, WebP ou GIF uniquement.",
  "storage-missing": "Le stockage d'images n'est pas configuré.",
};

export function MediaUploader() {
  const [state, action, pending] = useActionState(uploadMediaAction, undefined);
  const router = useRouter();
  const { t } = useT();
  useEffect(() => {
    if (state?.url) router.refresh();
  }, [state, router]);
  return (
    <form action={action} className="admin-card grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
      <label className="block">
        <span className="admin-label">{t("Image")}</span>
        <input type="file" name="file" required accept="image/png,image/jpeg,image/webp,image/gif" className="admin-input mt-1 file:me-3 file:rounded-lg file:border-0 file:bg-cloud file:px-3 file:py-1 file:text-sm" />
      </label>
      <label className="block">
        <span className="admin-label">{t("Texte alternatif")}</span>
        <input name="alt" placeholder={t("ex. Logo de l'Université de Cambridge")} className="admin-input mt-1" />
      </label>
      <button disabled={pending} className="admin-btn admin-btn-primary">
        {pending ? t("Envoi…") : t("Importer")}
      </button>
      {state?.error && <p role="alert" className="text-sm text-red-700 sm:col-span-3">{t(ERRORS[state.error] ?? "Échec de l'envoi.")}</p>}
      {state?.url && <p role="status" className="text-sm text-emerald-700 sm:col-span-3">{t("Image importée.")}</p>}
    </form>
  );
}
