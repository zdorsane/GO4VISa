import type { Metadata } from "next";
import { can, requireAdmin } from "@/lib/server/auth";
import { PdfImport } from "../../ui/PdfImport";

export const metadata: Metadata = { title: "Importer un PDF" };

// Claude reads the whole PDF inside the import action: give it the platform's longest run.
export const maxDuration = 300;

export default async function ImportPage() {
  const admin = await requireAdmin("edit");
  const publish = can(admin.role, "publish");
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-midnight">Importer un PDF</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate">
          Déposez la liste de bourses au format PDF. L&apos;IA lit le document, crée les nouvelles bourses et met à jour celles qui sont déjà
          sur le site. Les bourses dont la date limite est passée sont ignorées.
        </p>
      </header>
      <PdfImport publish={publish} />
      <section className="admin-card space-y-2 text-sm text-slate">
        <h2 className="font-semibold text-midnight">Comment ça marche</h2>
        <ul className="list-disc space-y-1 ps-5">
          <li>
            {publish
              ? "Les bourses qui ont un lien officiel sont publiées directement ; les autres attendent dans « Relecture »."
              : "Les bourses importées attendent dans « Relecture » : un administrateur les publie."}
          </li>
          <li>Seules les informations écrites dans le PDF sont reprises ; le reste s&apos;affiche « Non précisé ».</li>
          <li>Les bourses importées portent la mention « Informations à confirmer » tant qu&apos;elles n&apos;ont pas été vérifiées.</li>
          <li>Une photo peut être ajoutée ensuite depuis la fiche de la bourse ; sans photo, le drapeau du pays s&apos;affiche.</li>
          <li>Chaque jour, les bourses dont la date limite est passée sont archivées automatiquement.</li>
        </ul>
      </section>
    </div>
  );
}
