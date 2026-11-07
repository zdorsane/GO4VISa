import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { can, requireAdmin } from "@/lib/server/auth";
import { getById, getSources } from "@/lib/server/scholarships";
import { deadlineStatus } from "@/lib/scholarships";
import {
  addSourceAction,
  deleteScholarshipAction,
  duplicateScholarshipAction,
  removeSourceAction,
  setScholarshipStatusAction,
} from "../../../actions";
import { ScholarshipForm } from "../../../ui/ScholarshipForm";
import { ConfirmButton } from "../../../ui/ConfirmButton";
import { DEADLINE_LABEL, DEADLINE_STYLE, fmtDate, Pill, WORKFLOW_LABEL, WORKFLOW_STYLE } from "../../../ui/labels";
import { getAdminT } from "../../../i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminT();
  return { title: t("Modifier une bourse") };
}

const NEXT_STEP = {
  draft: { status: "review", label: "Envoyer en relecture", perm: "edit" },
  review: { status: "approved", label: "Approuver (source et éligibilité vérifiées)", perm: "publish" },
  approved: { status: "published", label: "Publier sur le site", perm: "publish" },
  published: { status: "archived", label: "Archiver", perm: "publish" },
  archived: { status: "draft", label: "Repasser en brouillon", perm: "publish" },
} as const;

const NOTICES: Record<string, string> = {
  "no-source": "Impossible de publier : ajoutez d'abord la source officielle.",
  "source-url": "Adresse de source invalide (elle doit commencer par https://).",
};

export default async function EditScholarship({ params, searchParams }: PageProps<"/admin/scholarships/[id]">) {
  const [{ id }, sp, admin, { lang, t }] = await Promise.all([params, searchParams, requireAdmin("edit"), getAdminT()]);
  const s = await getById(id);
  if (!s) notFound();
  const sources = await getSources(s.id);
  const d = deadlineStatus(s);
  const step = NEXT_STEP[s.status];
  const canPublish = can(admin.role, "publish");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link href="/admin/scholarships" className="text-sm text-slate hover:text-midnight">
            ← {t("Bourses")}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-midnight">{s.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate">
            <Pill className={WORKFLOW_STYLE[s.status]}>{t(WORKFLOW_LABEL[s.status])}</Pill>
            <Pill className={DEADLINE_STYLE[d]}>{t(DEADLINE_LABEL[d])}</Pill>
            <span>{t("Modifiée le {d}", { d: fmtDate(s.updated_at, true, lang) })}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/preview/${s.id}`} target="_blank" className="admin-btn admin-btn-ghost">
            {t("Aperçu")}
          </Link>
          {s.status === "published" && (
            <Link href={`/${lang}/scholarships/${s.slug}`} target="_blank" className="admin-btn admin-btn-ghost">
              {t("Voir en ligne")}
            </Link>
          )}
          <form action={duplicateScholarshipAction}>
            <input type="hidden" name="id" value={s.id} />
            <button className="admin-btn admin-btn-ghost">{t("Dupliquer")}</button>
          </form>
          {(step.perm === "edit" || canPublish) && (
            <form action={setScholarshipStatusAction}>
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="status" value={step.status} />
              <button className={`admin-btn ${step.status === "published" ? "admin-btn-gold" : "admin-btn-primary"}`}>{t(step.label)}</button>
            </form>
          )}
        </div>
      </header>

      {sp.saved && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{t("Enregistré.")}</p>}
      {typeof sp.error === "string" && NOTICES[sp.error] && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t(NOTICES[sp.error])}
        </p>
      )}

      <ScholarshipForm key={s.updated_at} scholarship={s} canPublish={canPublish} />

      <section id="sources" className="admin-card scroll-mt-6">
        <h2 className="font-semibold text-midnight">{t("Sources de vérification supplémentaires")}</h2>
        <p className="mt-1 text-sm text-slate">{t("Pages officielles consultées en plus de la source principale.")}</p>
        {sources.length > 0 && (
          <ul className="mt-4 divide-y divide-line text-sm">
            {sources.map((src) => (
              <li key={src.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-ocean hover:underline">
                    {src.label || src.url}
                  </a>
                  {src.checked_at && <span className="ms-2 text-xs text-slate">{t("vérifiée le {d}", { d: fmtDate(src.checked_at, false, lang) })}</span>}
                </span>
                <form action={removeSourceAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="source_id" value={src.id} />
                  <button className="text-xs text-slate hover:text-red-700">{t("Retirer")}</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={addSourceAction} className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_10rem_auto]">
          <input type="hidden" name="id" value={s.id} />
          <input name="url" required placeholder={t("https://… (page officielle)")} className="admin-input" aria-label={t("Adresse de la source")} />
          <input name="label" placeholder={t("Libellé (ex. Éligibilité)")} className="admin-input" aria-label={t("Libellé")} />
          <input type="date" name="checked_at" defaultValue={new Date().toISOString().slice(0, 10)} className="admin-input" aria-label={t("Date de vérification")} />
          <button className="admin-btn admin-btn-ghost">{t("Ajouter")}</button>
        </form>
      </section>

      {can(admin.role, "delete") && (
        <section className="admin-card border-red-100">
          <h2 className="font-semibold text-red-800">{t("Zone sensible")}</h2>
          <p className="mt-1 text-sm text-slate">
            {t("Préférez « Archiver » : la bourse reste dans l'historique. La suppression est définitive.")}
          </p>
          <form action={deleteScholarshipAction} className="mt-3">
            <input type="hidden" name="id" value={s.id} />
            <ConfirmButton message={t("Supprimer définitivement « {title} » ?", { title: s.title })} className="admin-btn admin-btn-danger">
              {t("Supprimer définitivement")}
            </ConfirmButton>
          </form>
        </section>
      )}
    </div>
  );
}
