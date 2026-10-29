import type { Metadata } from "next";
import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/auth";
import { listAll } from "@/lib/server/scholarships";
import { NewsForm } from "../../../ui/NewsForm";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewNews() {
  const [admin, all] = await Promise.all([requireAdmin("edit"), listAll()]);
  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin/news" className="text-sm text-slate hover:text-midnight">
          ← Actualités
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-midnight">Nouvel article</h1>
      </header>
      <NewsForm scholarships={all.map((s) => ({ id: s.id, title: s.title }))} canPublish={can(admin.role, "publish")} />
    </div>
  );
}
