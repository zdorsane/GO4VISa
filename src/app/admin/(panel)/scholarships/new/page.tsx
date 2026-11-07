import type { Metadata } from "next";
import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/auth";
import { ScholarshipForm } from "../../../ui/ScholarshipForm";
import { getAdminT } from "../../../i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminT();
  return { title: t("Nouvelle bourse") };
}

export default async function NewScholarship() {
  const [admin, { t }] = await Promise.all([requireAdmin("edit"), getAdminT()]);
  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin/scholarships" className="text-sm text-slate hover:text-midnight">
          ← {t("Bourses")}
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-midnight">{t("Nouvelle bourse")}</h1>
        <p className="mt-1 text-sm text-slate">
          {t("Ne renseignez que ce qui figure sur la source officielle : un champ vide s'affiche « Non précisé » sur le site.")}
        </p>
      </header>
      <ScholarshipForm canPublish={can(admin.role, "publish")} />
    </div>
  );
}
