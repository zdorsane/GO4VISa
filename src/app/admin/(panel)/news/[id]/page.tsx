import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { can, requireAdmin } from "@/lib/server/auth";
import { getNewsById } from "@/lib/server/news";
import { listAll } from "@/lib/server/scholarships";
import { deleteNewsAction } from "../../../actions";
import { ConfirmButton } from "../../../ui/ConfirmButton";
import { NewsForm } from "../../../ui/NewsForm";

export const metadata: Metadata = { title: "Modifier un article" };

export default async function EditNews({ params, searchParams }: PageProps<"/admin/news/[id]">) {
  const [{ id }, sp, admin, all] = await Promise.all([params, searchParams, requireAdmin("edit"), listAll()]);
  const a = await getNewsById(id);
  if (!a) notFound();
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link href="/admin/news" className="text-sm text-slate hover:text-midnight">
            ← Actualités
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-midnight">{a.title}</h1>
        </div>
        {a.status === "published" && (
          <Link href={`/${a.content_lang}/news/${a.slug}`} target="_blank" className="admin-btn admin-btn-ghost">
            Voir en ligne
          </Link>
        )}
      </header>
      {sp.saved && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Enregistré.</p>}
      <NewsForm key={a.updated_at} article={a} scholarships={all.map((s) => ({ id: s.id, title: s.title }))} canPublish={can(admin.role, "publish")} />
      {can(admin.role, "delete") && (
        <form action={deleteNewsAction} className="admin-card border-red-100">
          <input type="hidden" name="id" value={a.id} />
          <ConfirmButton message={`Supprimer « ${a.title} » ?`} className="admin-btn admin-btn-danger">
            Supprimer l&apos;article
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}
