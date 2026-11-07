import type { Metadata } from "next";
import { can, requireAdmin } from "@/lib/server/auth";
import { PdfImport } from "../../ui/PdfImport";
import { getAdminT } from "../../i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminT();
  return { title: t("Importer un PDF") };
}

// Gemini reads the whole PDF inside the import action: give it the platform's longest run.
export const maxDuration = 300;

export default async function ImportPage() {
  const [admin, { t }] = await Promise.all([requireAdmin("edit"), getAdminT()]);
  const publish = can(admin.role, "publish");
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-midnight">{t("Importer un PDF")}</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate">
          {t("Déposez la liste de bourses au format PDF. L'IA lit le document et crée les nouvelles bourses. Celles qui sont déjà sur le site sont refusées, et celles dont la date limite est passée sont ignorées.")}
        </p>
      </header>
      <PdfImport publish={publish} />
      <section className="admin-card space-y-2 text-sm text-slate">
        <h2 className="font-semibold text-midnight">{t("Comment ça marche")}</h2>
        <ul className="list-disc space-y-1 ps-5">
          <li>
            {publish
              ? t("Les bourses qui ont un lien officiel sont publiées directement ; les autres attendent dans « Relecture ».")
              : t("Les bourses importées attendent dans « Relecture » : un administrateur les publie.")}
          </li>
          <li>{t("Seules les informations écrites dans le PDF sont reprises ; le reste s'affiche « Non précisé ».")}</li>
          <li>{t("Les bourses importées portent la mention « Informations à confirmer » tant qu'elles n'ont pas été vérifiées.")}</li>
          <li>{t("Une photo peut être ajoutée ensuite depuis la fiche de la bourse ; sans photo, le drapeau du pays s'affiche.")}</li>
          <li>{t("Chaque jour, les bourses dont la date limite est passée sont archivées automatiquement.")}</li>
          <li>{t("Les bourses importées sont traduites automatiquement en anglais et en arabe.")}</li>
        </ul>
      </section>
    </div>
  );
}
