import type { Metadata } from "next";
import Link from "next/link";
import { listAll } from "@/lib/server/scholarships";
import { DEADLINE_STATUSES, deadlineStatus, publishWarnings, WORKFLOW } from "@/lib/scholarships";
import { countryName } from "@/lib/countries";
import { DEADLINE_LABEL, DEADLINE_STYLE, fmtDate, Pill, WORKFLOW_LABEL, WORKFLOW_STYLE } from "../../ui/labels";
import { getAdminT } from "../../i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminT();
  return { title: t("Bourses") };
}

export default async function ScholarshipsAdmin({ searchParams }: PageProps<"/admin/scholarships">) {
  const [sp, { lang, t }] = await Promise.all([searchParams, getAdminT()]);
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const q = one("q").toLowerCase();
  const status = one("status");
  const deadline = one("deadline");
  const verify = one("verify") === "1";
  const now = new Date();

  const all = await listAll();
  const rows = all.filter((s) => {
    if (q && !`${s.title} ${s.institution} ${s.country_code} ${s.city ?? ""}`.toLowerCase().includes(q)) return false;
    if (status === "review" ? !["review", "approved"].includes(s.status) : status && s.status !== status) return false;
    if (deadline && deadlineStatus(s, now) !== deadline && !(deadline === "closing" && deadlineStatus(s, now) === "today")) return false;
    if (verify && !publishWarnings(s, now).some((w) => w === "unverified" || w === "stale")) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-midnight">{t("Bourses et opportunités")}</h1>
          <p className="mt-1 text-sm text-slate">
            {t("{n} sur {total} · Brouillon → Relecture → Approuvée → Publiée → Archivée", { n: rows.length, total: all.length })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/import" className="admin-btn admin-btn-gold">
            {t("Importer un PDF")}
          </Link>
          <Link href="/admin/scholarships/new" className="admin-btn admin-btn-ghost">
            {t("Ajouter une bourse")}
          </Link>
        </div>
      </header>

      {one("deleted") && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{t("La bourse a été supprimée.")}</p>}

      <form className="admin-card grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]" role="search">
        <input name="q" defaultValue={one("q")} placeholder={t("Rechercher un titre, une université, un pays…")} className="admin-input" aria-label={t("Recherche")} />
        <select name="status" defaultValue={status} className="admin-input" aria-label={t("Statut")}>
          <option value="">{t("Tous les statuts")}</option>
          {WORKFLOW.map((w) => (
            <option key={w} value={w}>
              {t(WORKFLOW_LABEL[w])}
            </option>
          ))}
        </select>
        <select name="deadline" defaultValue={deadline} className="admin-input" aria-label={t("Date limite")}>
          <option value="">{t("Toutes les dates")}</option>
          {DEADLINE_STATUSES.map((d) => (
            <option key={d} value={d}>
              {t(DEADLINE_LABEL[d])}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-midnight">
          <input type="checkbox" name="verify" value="1" defaultChecked={verify} className="h-4 w-4 accent-midnight" />
          {t("À vérifier")}
        </label>
        <button className="admin-btn admin-btn-primary">{t("Filtrer")}</button>
      </form>

      {rows.length ? (
        <div className="admin-card overflow-x-auto p-0">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="border-b border-line bg-cloud text-start text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t("Opportunité")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("Pays")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("Date limite")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("Statut")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("Vérification")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((s) => {
                const d = deadlineStatus(s, now);
                const warnings = publishWarnings(s, now).length;
                return (
                  <tr key={s.id} className="hover:bg-cloud/60">
                    <td className="max-w-[22rem] px-4 py-3">
                      <Link href={`/admin/scholarships/${s.id}`} className="font-medium text-midnight hover:underline">
                        {s.featured && <span title={t("Mise en avant")} className="me-1 text-gold">★</span>}
                        {s.title}
                      </Link>
                      <p className="truncate text-xs text-slate">{s.institution}</p>
                    </td>
                    <td className="px-4 py-3 text-slate">{countryName(s.country_code, lang)}</td>
                    <td className="px-4 py-3">
                      <span className="block text-midnight">{fmtDate(s.deadline_at, false, lang)}</span>
                      <Pill className={DEADLINE_STYLE[d]}>{t(DEADLINE_LABEL[d])}</Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill className={WORKFLOW_STYLE[s.status]}>{t(WORKFLOW_LABEL[s.status])}</Pill>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {s.verification === "verified" ? (
                        <span className="text-emerald-700">{s.verified_at ? t("Vérifiée le {d}", { d: fmtDate(s.verified_at, false, lang) }) : t("Vérifiée")}</span>
                      ) : (
                        <span className="text-amber-700">{t("À vérifier")}</span>
                      )}
                      {warnings > 0 && <span className="block text-amber-700">{t("{n} alerte(s)", { n: warnings })}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-card py-12 text-center">
          <p className="font-medium text-midnight">{t("Aucune bourse ne correspond à ces filtres.")}</p>
          <Link href="/admin/scholarships" className="mt-3 inline-block text-sm text-ocean hover:underline">
            {t("Effacer les filtres")}
          </Link>
        </div>
      )}
    </div>
  );
}
