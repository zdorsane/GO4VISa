import type { Metadata } from "next";
import Link from "next/link";
import { listAllNews } from "@/lib/server/news";
import { newsLabels } from "@/lib/news";
import { fmtDate, NEWS_CATEGORY_LABEL, NEWS_LABEL_LABEL, Pill } from "../../ui/labels";

export const metadata: Metadata = { title: "Actualités" };

export default async function NewsAdmin({ searchParams }: PageProps<"/admin/news">) {
  const [items, sp] = await Promise.all([listAllNews(), searchParams]);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-midnight">Actualités et annonces</h1>
          <p className="mt-1 text-sm text-slate">{items.length} article(s)</p>
        </div>
        <Link href="/admin/news/new" className="admin-btn admin-btn-gold">
          Nouvel article
        </Link>
      </header>
      {sp.deleted && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">L&apos;article a été supprimé.</p>}
      {items.length ? (
        <ul className="admin-card divide-y divide-line p-0">
          {items.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <Link href={`/admin/news/${a.id}`} className="font-medium text-midnight hover:underline">
                  {a.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate">
                  <span>{NEWS_CATEGORY_LABEL[a.category]}</span>
                  {newsLabels(a).map((l) => (
                    <Pill key={l} className="bg-cloud text-midnight ring-line">
                      {NEWS_LABEL_LABEL[l]}
                    </Pill>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate">{a.status === "published" ? `Publié le ${fmtDate(a.published_at)}` : "Brouillon"}</span>
                <Pill className={a.status === "published" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-700 ring-slate-200"}>
                  {a.status === "published" ? "Publié" : "Brouillon"}
                </Pill>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card py-12 text-center">
          <p className="font-medium text-midnight">Aucun article pour l&apos;instant.</p>
          <p className="mt-1 text-sm text-slate">Les articles publiés apparaissent sur l&apos;accueil et dans la page Actualités.</p>
          <Link href="/admin/news/new" className="admin-btn admin-btn-gold mt-4">
            Rédiger le premier article
          </Link>
        </div>
      )}
    </div>
  );
}
