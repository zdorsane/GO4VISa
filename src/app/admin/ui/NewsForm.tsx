"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { NEWS_CATEGORIES, NEWS_LABELS, renderArticle, type NewsArticle } from "@/lib/news";
import { COMMON_COUNTRIES, countryName } from "@/lib/countries";
import { saveNewsAction, uploadMediaAction } from "../actions";
import { ImageField } from "./ImageField";
import { NEWS_CATEGORY_LABEL, NEWS_LABEL_LABEL } from "./labels";

const FIELD_ERRORS: Record<string, string> = {
  taken: "Cette adresse (slug) est déjà utilisée.",
  "invalid-url": "Adresse invalide : elle doit commencer par https://",
  "invalid-date": "Date invalide.",
  "invalid-country": "Code pays à 2 lettres (ex. FR).",
};

function toLocalInput(iso: string | null) {
  return iso ? new Date(new Date(iso).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : "";
}

type Option = { id: string; title: string };

type Tool = { label: string } & ({ kind: "line"; prefix: string } | { kind: "wrap"; before: string; after: string; placeholder?: string });
const TOOLS: Tool[] = [
  { label: "Titre", kind: "line", prefix: "## " },
  { label: "Sous-titre", kind: "line", prefix: "### " },
  { label: "Gras", kind: "wrap", before: "**", after: "**" },
  { label: "Italique", kind: "wrap", before: "*", after: "*" },
  { label: "Liste", kind: "line", prefix: "- " },
  { label: "Liste numérotée", kind: "line", prefix: "1. " },
  { label: "Citation", kind: "line", prefix: "> " },
  { label: "Lien", kind: "wrap", before: "[", after: "](https://)", placeholder: "texte du lien" },
];

export function NewsForm({ article: a, scholarships, canPublish }: { article?: NewsArticle | null; scholarships: Option[]; canPublish: boolean }) {
  const [state, action, pending] = useActionState(saveNewsAction, undefined);
  const [body, setBody] = useState(a?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, startUpload] = useTransition();
  const area = useRef<HTMLTextAreaElement>(null);
  const err = (k: string) => state?.fields?.[k]?.map((c) => FIELD_ERRORS[c] ?? "Valeur invalide.").join(" ");

  /** Wraps the selection (or inserts at the cursor) with Markdown markers. */
  const wrap = (before: string, after = "", placeholder = "texte") => {
    const el = area.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = body.slice(s, e) || placeholder;
    const next = body.slice(0, s) + before + sel + after + body.slice(e);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };
  const linePrefix = (prefix: string) => {
    const el = area.current;
    if (!el) return;
    const start = body.lastIndexOf("\n", el.selectionStart - 1) + 1;
    setBody(body.slice(0, start) + prefix + body.slice(start));
    requestAnimationFrame(() => el.focus());
  };
  const insertImage = (file: File) => {
    const fd = new FormData();
    fd.set("file", file);
    startUpload(async () => {
      const res = await uploadMediaAction(undefined, fd);
      if (res?.url) wrap(`\n![`, `](${res.url})\n`, "description de l'image");
    });
  };

  const applyTool = (t: Tool) => (t.kind === "line" ? linePrefix(t.prefix) : wrap(t.before, t.after, t.placeholder));

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]" noValidate>
      {a && <input type="hidden" name="id" value={a.id} />}
      <div className="min-w-0 space-y-6">
        <div className="admin-card space-y-4">
          <label className="block">
            <span className="admin-label">
              Titre <span className="text-red-600">*</span>
            </span>
            <input name="title" defaultValue={a?.title} required aria-invalid={!!state?.fields?.title} className="admin-input mt-1" />
            {state?.fields?.title && <p className="mt-1 text-xs text-red-700">Entre 3 et 200 caractères.</p>}
          </label>
          <label className="block">
            <span className="admin-label">Résumé court</span>
            <textarea name="summary" rows={2} defaultValue={a?.summary ?? ""} className="admin-input mt-1" />
          </label>
          <ImageField name="cover_url" label="Image de couverture" defaultValue={a?.cover_url} />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="admin-label">Article</span>
              <div className="flex rounded-lg border border-line p-0.5 text-xs">
                {(["write", "preview"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-md px-3 py-1 font-medium ${tab === t ? "bg-midnight text-white" : "text-slate"}`}
                  >
                    {t === "write" ? "Rédiger" : "Aperçu"}
                  </button>
                ))}
              </div>
            </div>
            <input type="hidden" name="body" value={body} />
            {tab === "write" ? (
              <div className="mt-2 overflow-hidden rounded-xl border border-line">
                <div role="toolbar" aria-label="Mise en forme" className="flex flex-wrap gap-1 border-b border-line bg-cloud p-1.5">
                  {TOOLS.map((t) => (
                    <button key={t.label} type="button" onClick={() => applyTool(t)} className="rounded-md px-2.5 py-1 text-xs font-medium text-midnight hover:bg-white">
                      {t.label}
                    </button>
                  ))}
                  <label className="cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium text-midnight hover:bg-white">
                    {uploading ? "Envoi…" : "Image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="sr-only"
                      onChange={(e) => e.target.files?.[0] && insertImage(e.target.files[0])}
                    />
                  </label>
                </div>
                <textarea
                  ref={area}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={16}
                  aria-label="Contenu de l'article"
                  className="block w-full resize-y border-0 px-3.5 py-3 font-mono text-sm leading-relaxed focus:outline-none"
                />
              </div>
            ) : (
              <div className="article-body mt-2 min-h-60 rounded-xl border border-line bg-white p-5" dangerouslySetInnerHTML={{ __html: renderArticle(body) }} />
            )}
          </div>
        </div>

        <div className="admin-card grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold text-midnight sm:col-span-2">Référencement (SEO)</h2>
          <label className="block">
            <span className="admin-label">Titre SEO</span>
            <input name="seo_title" maxLength={70} defaultValue={a?.seo_title ?? ""} className="admin-input mt-1" />
            <p className="admin-hint">70 caractères max. Sinon, le titre est utilisé.</p>
          </label>
          <label className="block">
            <span className="admin-label">Adresse (slug)</span>
            <input name="slug" defaultValue={a?.slug ?? ""} className="admin-input mt-1" placeholder="Générée depuis le titre" />
            {err("slug") && <p className="mt-1 text-xs text-red-700">{err("slug")}</p>}
          </label>
          <label className="block sm:col-span-2">
            <span className="admin-label">Description SEO</span>
            <textarea name="seo_description" maxLength={170} rows={2} defaultValue={a?.seo_description ?? ""} className="admin-input mt-1" />
          </label>
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div className="admin-card space-y-4">
          <label className="block">
            <span className="admin-label">Statut</span>
            <select name="status" defaultValue={a?.status ?? "draft"} className="admin-input mt-1">
              <option value="draft">Brouillon</option>
              {(canPublish || a?.status === "published") && <option value="published">Publié</option>}
            </select>
            {!canPublish && <p className="admin-hint">Un administrateur publie l&apos;article.</p>}
          </label>
          <label className="block">
            <span className="admin-label">Date de publication</span>
            <input type="datetime-local" name="published_at" defaultValue={toLocalInput(a?.published_at ?? null)} className="admin-input mt-1" />
            <p className="admin-hint">Vide = maintenant. Une date future programme l&apos;article.</p>
          </label>
          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full">
            {pending ? "Enregistrement…" : a ? "Enregistrer" : "Créer l'article"}
          </button>
          {state?.ok && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Modifications enregistrées.</p>}
          {state?.error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error === "forbidden-status" ? "Votre rôle ne permet pas de publier." : "Certains champs sont à corriger."}
            </p>
          )}
        </div>

        <div className="admin-card space-y-4">
          <label className="block">
            <span className="admin-label">Catégorie</span>
            <select name="category" defaultValue={a?.category ?? "announcement"} className="admin-input mt-1">
              {NEWS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {NEWS_CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="admin-label">Étiquettes</legend>
            <p className="admin-hint">« Nouveau » et « Alerte date limite » s&apos;ajoutent aussi automatiquement.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {NEWS_LABELS.map((l) => (
                <label key={l} className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs has-[:checked]:border-midnight has-[:checked]:bg-midnight/5">
                  <input type="checkbox" name="labels" value={l} defaultChecked={a?.labels.includes(l)} className="accent-midnight" />
                  {NEWS_LABEL_LABEL[l]}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="admin-label">Langue de l&apos;article</span>
            <select name="content_lang" defaultValue={a?.content_lang ?? "fr"} className="admin-input mt-1">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <label className="block">
            <span className="admin-label">Pays concerné</span>
            <input name="country_code" list="news-countries" maxLength={2} defaultValue={a?.country_code ?? ""} className="admin-input mt-1 uppercase" placeholder="ex. DE" />
            <datalist id="news-countries">
              {COMMON_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {countryName(c, "fr")}
                </option>
              ))}
            </datalist>
            {err("country_code") && <p className="mt-1 text-xs text-red-700">{err("country_code")}</p>}
          </label>
          <label className="block">
            <span className="admin-label">Université concernée</span>
            <input name="university" defaultValue={a?.university ?? ""} className="admin-input mt-1" />
          </label>
          <label className="block">
            <span className="admin-label">Bourse liée</span>
            <select name="scholarship_id" defaultValue={a?.scholarship_id ?? ""} className="admin-input mt-1">
              <option value="">Aucune</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="admin-label">Auteur</span>
            <input name="author" defaultValue={a?.author ?? ""} className="admin-input mt-1" />
          </label>
          <label className="block">
            <span className="admin-label">Source officielle</span>
            <input name="source_url" defaultValue={a?.source_url ?? ""} placeholder="https://" className="admin-input mt-1" />
            {err("source_url") && <p className="mt-1 text-xs text-red-700">{err("source_url")}</p>}
          </label>
        </div>
      </aside>
    </form>
  );
}
