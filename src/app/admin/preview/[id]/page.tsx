import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScholarshipDetail } from "@/components/scholarships/ScholarshipDetail";
import { requireAdmin } from "@/lib/server/auth";
import { getById, getSources } from "@/lib/server/scholarships";
import { deadlineStatus } from "@/lib/scholarships";
import { WORKFLOW_LABEL } from "../../ui/labels";

export const metadata: Metadata = { title: "Aperçu" };
export const instant = false;

/** What the public page will look like, for any workflow status (admins only). */
export default async function PreviewScholarship({ params }: PageProps<"/admin/preview/[id]">) {
  const [{ id }] = await Promise.all([params, requireAdmin("edit")]);
  const s = await getById(id);
  if (!s) notFound();
  const sources = await getSources(s.id);
  const lang = s.content_lang;
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} className="min-h-screen bg-cloud">
      <p className="sticky top-0 z-50 bg-gold px-4 py-2 text-center text-sm font-semibold text-midnight">
        Aperçu · statut : {WORKFLOW_LABEL[s.status]}
        {s.status !== "published" && " — non visible sur le site"}
      </p>
      <ScholarshipDetail s={{ ...s, deadline_status: deadlineStatus(s) }} sources={sources} lang={lang} preview />
    </div>
  );
}
