import type { Metadata } from "next";
import { can, requireAdmin } from "@/lib/server/auth";
import { listMedia } from "@/lib/server/media";
import { deleteMediaAction } from "../../actions";
import { ConfirmButton } from "../../ui/ConfirmButton";
import { CopyButton } from "../../ui/CopyButton";
import { MediaUploader } from "../../ui/MediaUploader";
import { fmtDate } from "../../ui/labels";

export const metadata: Metadata = { title: "Médias" };

export default async function MediaPage() {
  const [admin, items] = await Promise.all([requireAdmin("media"), listMedia()]);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-midnight">Médiathèque</h1>
        <p className="mt-1 text-sm text-slate">Logos d&apos;universités et images d&apos;articles. PNG, JPEG, WebP ou GIF, 4 Mo maximum.</p>
      </header>
      <MediaUploader />
      {items.length ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <li key={m.id} className="admin-card overflow-hidden p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- thumbnails of uploaded files */}
              <img src={m.url} alt={m.alt ?? ""} loading="lazy" className="aspect-square w-full bg-cloud object-contain" />
              <div className="space-y-2 p-3 text-xs">
                <p className="truncate text-midnight" title={m.pathname}>
                  {m.pathname.replace("media/", "")}
                </p>
                <p className="text-slate">
                  {Math.round(m.size / 1024)} Ko · {fmtDate(m.created_at)}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <CopyButton text={m.url} />
                  {can(admin.role, "delete") && (
                    <form action={deleteMediaAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton message="Supprimer cette image ? Les pages qui l'utilisent ne l'afficheront plus." className="text-slate hover:text-red-700">
                        Supprimer
                      </ConfirmButton>
                    </form>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card py-12 text-center text-sm text-slate">Aucune image pour l&apos;instant.</div>
      )}
    </div>
  );
}
