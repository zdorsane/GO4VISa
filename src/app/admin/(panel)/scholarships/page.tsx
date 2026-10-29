import type { Metadata } from "next";
import Link from "next/link";
import { listAll } from "@/lib/server/scholarships";
import { DEADLINE_STATUSES, deadlineStatus, publishWarnings, WORKFLOW } from "@/lib/scholarships";
import { countryName } from "@/lib/countries";
import { DEADLINE_LABEL, DEADLINE_STYLE, fmtDate, Pill, WORKFLOW_LABEL, WORKFLOW_STYLE } from "../../ui/labels";

export const metadata: Metadata = { title: "Bourses" };

export default async function ScholarshipsAdmin({ searchParams }: PageProps<"/admin/scholarships">) {
  const sp = await searchParams;
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
          <h1 className="text-2xl font-semibold text-midnight">Bourses et opportunités</h1>
          <p className="mt-1 text-sm text-slate">
            {rows.length} sur {all.length} · Brouillon → Relecture → Approuvée → Publiée → Archivée
          </p>
        </div>
        <Link href="/admin/scholarships/new" className="admin-btn admin-btn-gold">
          Ajouter une bourse
        </Link>
      </header>

      {one("deleted") && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">La bourse a été supprimée.</p>}

      <form className="admin-card grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]" role="search">
        <input name="q" defaultValue={one("q")} placeholder="Rechercher un titre, une université, un pays…" className="admin-input" aria-label="Recherche" />
        <select name="status" defaultValue={status} className="admin-input" aria-label="Statut">
          <option value="">Tous les statuts</option>
          {WORKFLOW.map((w) => (
            <option key={w} value={w}>
              {WORKFLOW_LABEL[w]}
            </option>
          ))}
        </select>
        <select name="deadline" defaultValue={deadline} className="admin-input" aria-label="Date limite">
          <option value="">Toutes les dates</option>
          {DEADLINE_STATUSES.map((d) => (
            <option key={d} value={d}>
              {DEADLINE_LABEL[d]}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-midnight">
          <input type="checkbox" name="verify" value="1" defaultChecked={verify} className="h-4 w-4 accent-midnight" />
          À vérifier
        </label>
        <button className="admin-btn admin-btn-primary">Filtrer</button>
      </form>

      {rows.length ? (
        <div className="admin-card overflow-x-auto p-0">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="border-b border-line bg-cloud text-start text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">Opportunité</th>
                <th className="px-4 py-3 text-start font-semibold">Pays</th>
                <th className="px-4 py-3 text-start font-semibold">Date limite</th>
                <th className="px-4 py-3 text-start font-semibold">Statut</th>
                <th className="px-4 py-3 text-start font-semibold">Vérification</th>
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
                        {s.featured && <span title="Mise en avant" className="me-1 text-gold">★</span>}
                        {s.title}
                      </Link>
                      <p className="truncate text-xs text-slate">{s.institution}</p>
                    </td>
                    <td className="px-4 py-3 text-slate">{countryName(s.country_code, "fr")}</td>
                    <td className="px-4 py-3">
                      <span className="block text-midnight">{fmtDate(s.deadline_at)}</span>
                      <Pill className={DEADLINE_STYLE[d]}>{DEADLINE_LABEL[d]}</Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill className={WORKFLOW_STYLE[s.status]}>{WORKFLOW_LABEL[s.status]}</Pill>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {s.verification === "verified" ? (
                        <span className="text-emerald-700">Vérifiée {s.verified_at ? `le ${fmtDate(s.verified_at)}` : ""}</span>
                      ) : (
                        <span className="text-amber-700">À vérifier</span>
                      )}
                      {warnings > 0 && <span className="block text-amber-700">{warnings} alerte(s)</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-card py-12 text-center">
          <p className="font-medium text-midnight">Aucune bourse ne correspond à ces filtres.</p>
          <Link href="/admin/scholarships" className="mt-3 inline-block text-sm text-ocean hover:underline">
            Effacer les filtres
          </Link>
        </div>
      )}
    </div>
  );
}
