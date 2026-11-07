import type { Metadata } from "next";
import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/auth";
import { unreadMessages } from "@/lib/server/messages";
import { dashboardStats, listAll } from "@/lib/server/scholarships";
import { refreshSiteAction, translateMissingAction } from "../actions";
import { getAdminT } from "../i18n-server";
import { deadlineStatus, publishWarnings } from "@/lib/scholarships";
import { DEADLINE_LABEL, DEADLINE_STYLE, fmtDate, Pill, WARNING_LABEL, WORKFLOW_LABEL } from "../ui/labels";
import type { Workflow } from "@/lib/scholarships";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminT();
  return { title: t("Tableau de bord") };
}

const ACTION_LABEL: Record<string, string> = {
  login: "s'est connecté",
  create: "a créé",
  update: "a modifié",
  delete: "a supprimé",
  duplicate: "a dupliqué",
  upload: "a importé une image",
  "add-source": "a ajouté une source à",
  "remove-source": "a retiré une source de",
  "refresh-cache": "a rafraîchi le site public",
  translate: "a lancé la traduction des bourses",
  "import-pdf": "a importé un PDF",
  "auto-archive": "a archivé automatiquement",
  "delete-message": "a supprimé un message",
};

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const [s, all, admin, sp, { lang, t }] = await Promise.all([dashboardStats(), listAll(), requireAdmin(), searchParams, getAdminT()]);
  const unread = await unreadMessages().catch(() => 0);
  const now = new Date();
  const closing = all
    .filter((x) => x.status === "published" && ["today", "closing"].includes(deadlineStatus(x, now)))
    .sort((a, b) => (a.deadline_at ?? "").localeCompare(b.deadline_at ?? ""));
  const toCheck = all.filter((x) => x.status !== "archived" && publishWarnings(x, now).length).slice(0, 8);
  const maxMonth = Math.max(1, ...s.deadlines.map((d) => d.n));
  const untranslated = all.filter((x) => x.status !== "archived" && !Object.keys(x.translations ?? {}).length).length;

  const cards = [
    { label: "Bourses au total", value: s.total, href: "/admin/scholarships" },
    { label: "Publiées", value: s.published, href: "/admin/scholarships?status=published" },
    { label: "Brouillons", value: s.drafts, href: "/admin/scholarships?status=draft" },
    { label: "En relecture / approuvées", value: s.in_review, href: "/admin/scholarships?status=review" },
    { label: "Candidatures ouvertes", value: s.open, href: "/admin/scholarships?deadline=open" },
    { label: "Clôture sous 7 jours", value: s.closing, href: "/admin/scholarships?deadline=closing", tone: "text-orange-600" },
    { label: "Dates dépassées", value: s.expired, href: "/admin/scholarships?deadline=closed", tone: "text-zinc-500" },
    { label: "Messages non lus", value: unread, href: "/admin/messages", tone: unread ? "text-ocean" : undefined },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-midnight">{t("Tableau de bord")}</h1>
          <p className="mt-1 text-sm text-slate">{t("Statuts calculés en direct à partir des dates, heure d'Alger.")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {can(admin.role, "publish") && (
            <form action={refreshSiteAction}>
              <button className="admin-btn admin-btn-ghost" title={t("Après un import hors back-office : les pages publiques relisent la base tout de suite")}>
                {t("Rafraîchir le site")}
              </button>
            </form>
          )}
          {untranslated > 0 && (
            <form action={translateMissingAction}>
              <button className="admin-btn admin-btn-ghost" title={t("Crée la version anglaise et arabe des bourses qui n'en ont pas encore")}>
                {t("Traduire en anglais et en arabe ({n})", { n: untranslated })}
              </button>
            </form>
          )}
          <Link href="/admin/scholarships/new" className="admin-btn admin-btn-gold">
            {t("Ajouter une bourse")}
          </Link>
        </div>
      </header>

      {sp.translating && (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t("Traduction en cours ({n} bourse(s)) : les versions anglaise et arabe apparaissent sur le site d'ici une minute environ.", {
            n: String(sp.translating),
          })}
        </p>
      )}

      {sp.refreshed && (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t("Le site public affiche maintenant les dernières données.")}
        </p>
      )}

      <section aria-label={t("Statistiques")} className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="admin-card transition-shadow hover:shadow-md">
            <p className="text-xs font-medium text-slate">{t(c.label)}</p>
            <p className={`mt-2 text-3xl font-bold ${c.tone ?? "text-midnight"}`}>{c.value}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="admin-card">
          <h2 className="font-semibold text-midnight">{t("Dates limites à venir par mois")}</h2>
          {s.deadlines.length ? (
            <ul className="mt-5 space-y-3">
              {s.deadlines.map((d) => (
                <li key={d.month} className="grid grid-cols-[6.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
                  <span className="text-slate">
                    {new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric" }).format(new Date(`${d.month}-15`))}
                  </span>
                  <span className="h-3 overflow-hidden rounded-full bg-cloud">
                    <span className="block h-full rounded-full bg-ocean" style={{ width: `${(d.n / maxMonth) * 100}%` }} />
                  </span>
                  <span className="text-end font-semibold text-midnight">{d.n}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate">{t("Aucune date limite publiée à venir.")}</p>
          )}

          <h2 className="mt-8 font-semibold text-midnight">{t("Clôture imminente")}</h2>
          {closing.length ? (
            <ul className="mt-3 divide-y divide-line">
              {closing.map((x) => {
                const st = deadlineStatus(x, now);
                return (
                  <li key={x.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <Link href={`/admin/scholarships/${x.id}`} className="min-w-0 truncate font-medium text-midnight hover:underline">
                      {x.title}
                    </Link>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-slate">{fmtDate(x.deadline_at, false, lang)}</span>
                      <Pill className={DEADLINE_STYLE[st]}>{t(DEADLINE_LABEL[st])}</Pill>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate">{t("Aucune bourse publiée ne ferme dans les 7 prochains jours.")}</p>
          )}
        </section>

        <section className="admin-card">
          <h2 className="font-semibold text-midnight">{t("À vérifier avant publication")}</h2>
          {toCheck.length ? (
            <ul className="mt-3 space-y-3">
              {toCheck.map((x) => (
                <li key={x.id} className="rounded-xl bg-cloud p-3">
                  <Link href={`/admin/scholarships/${x.id}`} className="text-sm font-medium text-midnight hover:underline">
                    {x.title}
                  </Link>
                  <ul className="mt-1 list-disc ps-5 text-xs text-amber-800">
                    {publishWarnings(x, now).map((w) => (
                      <li key={w}>{t(WARNING_LABEL[w])}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate">{t("Tout est vérifié.")}</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="admin-card">
          <h2 className="font-semibold text-midnight">{t("Activité récente")}</h2>
          {s.activity.length ? (
            <ul className="mt-3 divide-y divide-line text-sm">
              {s.activity.map((a) => (
                <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                  <span className="min-w-0">
                    <span className="font-medium text-midnight">{a.user_name ?? t("Système")}</span>{" "}
                    <span className="text-slate">
                      {a.action.startsWith("status:")
                        ? t("a changé le statut ({s}) de", { s: t(WORKFLOW_LABEL[a.action.slice(7) as Workflow] ?? a.action.slice(7)) })
                        : ACTION_LABEL[a.action]
                          ? t(ACTION_LABEL[a.action])
                          : a.action}
                    </span>{" "}
                    {a.detail?.title && <span className="text-midnight">« {a.detail.title} »</span>}
                  </span>
                  <span className="shrink-0 text-xs text-slate">{fmtDate(a.created_at, true, lang)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate">{t("Aucune activité pour l'instant.")}</p>
          )}
        </section>
        <section className="admin-card">
          <h2 className="font-semibold text-midnight">{t("Site public")}</h2>
          <dl className="mt-3 grid gap-3 text-sm">
            <div className="rounded-xl bg-cloud p-3">
              <dt className="text-slate">{t("Abonnés newsletter")}</dt>
              <dd className="mt-1 text-2xl font-bold text-midnight">{s.subscribers}</dd>
            </div>
            <Link href="/admin/messages" className="rounded-xl bg-cloud p-3 hover:bg-line/60">
              <dt className="text-slate">{t("Messages non lus")}</dt>
              <dd className="mt-1 text-2xl font-bold text-midnight">{unread}</dd>
            </Link>
          </dl>
          <p className="mt-4 text-xs text-slate">
            {t("Les visites du site s'affichent dans Vercel Analytics (onglet Analytics du projet), qui n'est pas encore activé.")}
          </p>
        </section>
      </div>
    </div>
  );
}
