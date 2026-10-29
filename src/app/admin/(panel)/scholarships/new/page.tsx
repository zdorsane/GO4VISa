import type { Metadata } from "next";
import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/auth";
import { ScholarshipForm } from "../../../ui/ScholarshipForm";

export const metadata: Metadata = { title: "Nouvelle bourse" };

export default async function NewScholarship() {
  const admin = await requireAdmin("edit");
  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin/scholarships" className="text-sm text-slate hover:text-midnight">
          ← Bourses
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-midnight">Nouvelle bourse</h1>
        <p className="mt-1 text-sm text-slate">
          Ne renseignez que ce qui figure sur la source officielle : un champ vide s&apos;affiche « Non précisé » sur le site.
        </p>
      </header>
      <ScholarshipForm canPublish={can(admin.role, "publish")} />
    </div>
  );
}
