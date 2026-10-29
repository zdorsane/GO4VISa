"use client";

import { useActionState, useMemo, useState } from "react";
import { CATEGORIES, FUNDING, LEVELS, publishWarnings, type Scholarship, WORKFLOW } from "@/lib/scholarships";
import { COMMON_COUNTRIES, countryName } from "@/lib/countries";
import { saveScholarshipAction } from "../actions";
import { ImageField } from "./ImageField";
import { CATEGORY_LABEL, FUNDING_LABEL, LEVEL_LABEL, WARNING_LABEL, WORKFLOW_LABEL } from "./labels";

/** ISO instant → value for <input type="datetime-local"> in Algiers time (UTC+1, no DST). */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

const FIELD_ERRORS: Record<string, string> = {
  taken: "Cette adresse (slug) est déjà utilisée par une autre bourse.",
  "invalid-url": "Adresse invalide : elle doit commencer par https://",
  "invalid-date": "Date invalide.",
  "before-opening": "La date limite doit être après la date d'ouverture.",
  "required-to-publish": "Une source officielle est obligatoire pour publier.",
  required: "Champ obligatoire.",
};
const errorText = (codes?: string[]) => codes?.map((c) => FIELD_ERRORS[c] ?? "Valeur invalide.").join(" ");

type Props = { scholarship?: Scholarship | null; canPublish: boolean };

export function ScholarshipForm({ scholarship: s, canPublish }: Props) {
  const [state, action, pending] = useActionState(saveScholarshipAction, undefined);
  const [draft, setDraft] = useState({
    source_url: s?.source_url ?? "",
    application_url: s?.application_url ?? "",
    deadline_at: toLocalInput(s?.deadline_at ?? null),
    eligible_nationalities: s?.eligible_nationalities ?? "",
    qualifications: s?.qualifications ?? "",
    verified_at: s?.verified_at ?? "",
    verification: s?.verification ?? "needs_verification",
    algeria_eligible: s?.algeria_eligible ?? "unknown",
    levels: s?.levels ?? [],
  });
  const warnings = useMemo(
    () =>
      publishWarnings({
        ...draft,
        deadline_at: draft.deadline_at ? new Date(`${draft.deadline_at}:00+01:00`).toISOString() : null,
        application_url: draft.application_url || null,
        source_url: draft.source_url || null,
        verified_at: draft.verified_at || null,
      } as Partial<Scholarship>),
    [draft],
  );
  const err = (k: string) => errorText(state?.fields?.[k]);
  const set = (k: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }));
  const statuses = canPublish ? WORKFLOW : WORKFLOW.filter((w) => w === "draft" || w === "review" || w === s?.status);

  const text = (name: keyof Scholarship, label: string, opts: { rows?: number; hint?: string; required?: boolean; placeholder?: string } = {}) => {
    const value = (s?.[name] as string | null | undefined) ?? "";
    const controlled = name in draft;
    const common = {
      id: name,
      name,
      required: opts.required,
      placeholder: opts.placeholder ?? (opts.required ? undefined : "Non précisé"),
      "aria-invalid": !!state?.fields?.[name],
      className: "admin-input mt-1",
      ...(controlled
        ? { value: draft[name as keyof typeof draft] as string, onChange: set(name as keyof typeof draft) }
        : { defaultValue: value }),
    };
    return (
      <label className="block">
        <span className="admin-label">
          {label}
          {opts.required && <span className="text-red-600"> *</span>}
        </span>
        {opts.rows ? <textarea rows={opts.rows} {...common} /> : <input {...common} />}
        {opts.hint && <p className="admin-hint">{opts.hint}</p>}
        {err(name) && <p className="mt-1 text-xs text-red-700">{err(name)}</p>}
      </label>
    );
  };

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]" noValidate>
      {s && <input type="hidden" name="id" value={s.id} />}

      <div className="min-w-0 space-y-6">
        <fieldset className="admin-card space-y-4">
          <legend className="sr-only">Identité</legend>
          <h2 className="font-semibold text-midnight">1. Identité de l&apos;opportunité</h2>
          {text("title", "Titre", { required: true })}
          <div className="grid gap-4 sm:grid-cols-2">
            {text("institution", "Université ou institution hôte", { required: true })}
            {text("slug", "Adresse de la page (slug)", { hint: "Générée depuis le titre si vide.", placeholder: "ex. gates-cambridge-2027" })}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="admin-label">
                Pays (code ISO) <span className="text-red-600">*</span>
              </span>
              <input
                name="country_code"
                list="countries"
                defaultValue={s?.country_code ?? ""}
                maxLength={2}
                required
                aria-invalid={!!state?.fields?.country_code}
                className="admin-input mt-1 uppercase"
                placeholder="ex. FR"
              />
              <datalist id="countries">
                {COMMON_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {countryName(c, "fr")}
                  </option>
                ))}
              </datalist>
              {err("country_code") && <p className="mt-1 text-xs text-red-700">Code pays à 2 lettres (ex. FR, DE, GB).</p>}
            </label>
            {text("city", "Ville")}
            <label className="block">
              <span className="admin-label">Langue du contenu</span>
              <select name="content_lang" defaultValue={s?.content_lang ?? "fr"} className="admin-input mt-1">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </label>
          </div>
          <ImageField name="logo_url" label="Logo de l'institution" defaultValue={s?.logo_url} hint="Sinon, le drapeau du pays est affiché." />
          {text("summary", "Résumé court (cartes)", { rows: 2, hint: "2 phrases maximum, affichées sur les cartes." })}
          {text("description", "Description détaillée", { rows: 6 })}
        </fieldset>

        <fieldset className="admin-card space-y-4">
          <legend className="sr-only">Classement</legend>
          <h2 className="font-semibold text-midnight">2. Niveau et catégories</h2>
          <div>
            <span className="admin-label">Niveau académique</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <label key={l} className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm has-[:checked]:border-midnight has-[:checked]:bg-midnight/5">
                  <input
                    type="checkbox"
                    name="levels"
                    value={l}
                    checked={draft.levels.includes(l)}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, levels: e.target.checked ? [...d.levels, l] : d.levels.filter((x) => x !== l) }))
                    }
                    className="accent-midnight"
                  />
                  {LEVEL_LABEL[l]}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="admin-label">Catégories</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm has-[:checked]:border-midnight has-[:checked]:bg-midnight/5">
                  <input type="checkbox" name="categories" value={c} defaultChecked={s?.categories.includes(c)} className="accent-midnight" />
                  {CATEGORY_LABEL[c]}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label">Domaines d&apos;études</span>
              <input name="fields" defaultValue={s?.fields.join(", ")} className="admin-input mt-1" placeholder="Droit, Informatique…" />
              <p className="admin-hint">Séparés par des virgules.</p>
            </label>
            <label className="block">
              <span className="admin-label">Étiquettes (tags)</span>
              <input name="tags" defaultValue={s?.tags.join(", ")} className="admin-input mt-1" placeholder="afrique, sans-ielts…" />
              <p className="admin-hint">Séparées par des virgules.</p>
            </label>
          </div>
        </fieldset>

        <fieldset className="admin-card space-y-4">
          <legend className="sr-only">Éligibilité</legend>
          <h2 className="font-semibold text-midnight">3. Éligibilité</h2>
          {text("eligible_nationalities", "Nationalités éligibles", { rows: 2 })}
          <label className="block">
            <span className="admin-label">Ouvert aux candidats algériens ?</span>
            <select name="algeria_eligible" value={draft.algeria_eligible} onChange={set("algeria_eligible")} className="admin-input mt-1 sm:max-w-xs">
              <option value="unknown">Non confirmé</option>
              <option value="yes">Oui, confirmé sur la source officielle</option>
              <option value="no">Non</option>
            </select>
          </label>
          {text("qualifications", "Diplômes et conditions académiques requis", { rows: 3 })}
          <div className="grid gap-4 sm:grid-cols-2">
            {text("age_limit", "Limite d'âge")}
            {text("language_requirements", "Exigences linguistiques")}
          </div>
        </fieldset>

        <fieldset className="admin-card space-y-4">
          <legend className="sr-only">Financement</legend>
          <h2 className="font-semibold text-midnight">4. Financement et avantages</h2>
          <label className="block">
            <span className="admin-label">Type de financement</span>
            <select name="funding_type" defaultValue={s?.funding_type ?? "unknown"} className="admin-input mt-1 sm:max-w-xs">
              {FUNDING.map((f) => (
                <option key={f} value={f}>
                  {FUNDING_LABEL[f]}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {text("tuition", "Frais de scolarité")}
            {text("stipend", "Allocation mensuelle")}
            {text("accommodation", "Logement")}
            {text("travel", "Billet d'avion / voyage")}
            {text("insurance", "Assurance")}
            {text("duration", "Durée du programme")}
          </div>
        </fieldset>

        <fieldset className="admin-card space-y-4">
          <legend className="sr-only">Dates et liens</legend>
          <h2 className="font-semibold text-midnight">5. Dates, liens et vérification</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label">Ouverture des candidatures</span>
              <input type="datetime-local" name="opens_at" defaultValue={toLocalInput(s?.opens_at ?? null)} className="admin-input mt-1" />
            </label>
            <label className="block">
              <span className="admin-label">Date limite officielle</span>
              <input
                type="datetime-local"
                name="deadline_at"
                value={draft.deadline_at}
                onChange={set("deadline_at")}
                aria-invalid={!!state?.fields?.deadline_at}
                className="admin-input mt-1"
              />
              <p className="admin-hint">Heure d&apos;Alger. Convertissez depuis le fuseau officiel (ex. 23:59 UK = 00:59 Alger en hiver).</p>
              {err("deadline_at") && <p className="mt-1 text-xs text-red-700">{err("deadline_at")}</p>}
            </label>
          </div>
          {text("deadline_note", "Précisions sur la date limite", {
            rows: 2,
            hint: "Fuseau officiel, dates différentes selon le cursus, etc.",
          })}
          {text("application_url", "Lien officiel de candidature", { placeholder: "https://" })}
          {text("source_url", "Source officielle (page consultée)", { placeholder: "https://", hint: "Obligatoire pour publier." })}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label">Dernière vérification</span>
              <input type="date" name="verified_at" value={draft.verified_at} onChange={set("verified_at")} className="admin-input mt-1" />
            </label>
            <label className="block">
              <span className="admin-label">État de vérification</span>
              <select name="verification" value={draft.verification} onChange={set("verification")} className="admin-input mt-1">
                <option value="needs_verification">À vérifier</option>
                <option value="verified">Vérifiée sur la source officielle</option>
              </select>
            </label>
          </div>
          {text("documents", "Documents requis", { rows: 3, hint: "Un document par ligne." })}
          {text("instructions", "Instructions de candidature", { rows: 3 })}
        </fieldset>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div className="admin-card space-y-4">
          <label className="block">
            <span className="admin-label">Statut</span>
            <select name="status" defaultValue={s?.status ?? "draft"} className="admin-input mt-1">
              {statuses.map((w) => (
                <option key={w} value={w}>
                  {WORKFLOW_LABEL[w]}
                </option>
              ))}
            </select>
            {!canPublish && <p className="admin-hint">Un administrateur approuve et publie.</p>}
          </label>
          <label className="flex items-center gap-2 text-sm text-midnight">
            <input type="checkbox" name="featured" defaultChecked={s?.featured} className="h-4 w-4 accent-midnight" />
            Mettre en avant sur l&apos;accueil
          </label>
          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full">
            {pending ? "Enregistrement…" : s ? "Enregistrer" : "Créer la bourse"}
          </button>
          {state?.ok && (
            <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Modifications enregistrées.
            </p>
          )}
          {state?.error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error === "forbidden-status"
                ? "Votre rôle ne permet pas d'approuver, publier ou archiver."
                : "Certains champs sont à corriger (en rouge)."}
            </p>
          )}
        </div>

        <div className={`admin-card ${warnings.length ? "border-amber-200 bg-amber-50/60" : "border-emerald-200 bg-emerald-50/60"}`}>
          <h2 className="text-sm font-semibold text-midnight">Contrôles avant publication</h2>
          {warnings.length ? (
            <ul className="mt-2 list-disc space-y-1 ps-5 text-xs text-amber-900">
              {warnings.map((w) => (
                <li key={w}>{WARNING_LABEL[w]}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-emerald-800">Source, lien, date et éligibilité sont renseignés et vérifiés.</p>
          )}
        </div>
      </aside>
    </form>
  );
}
