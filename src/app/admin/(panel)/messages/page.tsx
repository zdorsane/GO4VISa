import type { Metadata } from "next";
import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/auth";
import { listMessages, type MessageKind } from "@/lib/server/messages";
import { deleteMessageAction, markMessageAction } from "../../actions";
import { getAdminT } from "../../i18n-server";
import { ConfirmButton } from "../../ui/ConfirmButton";
import { fmtDate, Pill } from "../../ui/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminT();
  return { title: t("Messages") };
}

const KINDS: { value: MessageKind | ""; label: string }[] = [
  { value: "", label: "Tous" },
  { value: "contact", label: "Contact" },
  { value: "feedback", label: "Avis" },
];

/** Messages sent from the site: the contact form and the student feedback box. */
export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  const [admin, sp, { lang, t }] = await Promise.all([requireAdmin("edit"), searchParams, getAdminT()]);
  const kind = sp.kind === "contact" || sp.kind === "feedback" ? sp.kind : undefined;
  let messages: Awaited<ReturnType<typeof listMessages>> = [];
  let ready = true;
  try {
    messages = await listMessages(kind);
  } catch {
    // the messages table is created by migration 005
    ready = false;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-midnight">{t("Messages")}</h1>
        <p className="mt-1 text-sm text-slate">{t("Messages reçus par le formulaire de contact et avis laissés par les étudiants.")}</p>
      </header>

      {sp.deleted && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{t("Le message a été supprimé.")}</p>}

      <nav className="flex flex-wrap gap-2" aria-label={t("Filtrer")}>
        {KINDS.map((k) => (
          <Link
            key={k.value}
            href={k.value ? `/admin/messages?kind=${k.value}` : "/admin/messages"}
            aria-current={(kind ?? "") === k.value ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${
              (kind ?? "") === k.value ? "bg-midnight text-white ring-midnight" : "text-midnight ring-line hover:bg-cloud"
            }`}
          >
            {t(k.label)}
          </Link>
        ))}
      </nav>

      {!ready ? (
        <div className="admin-card py-12 text-center text-sm text-slate">{t("La boîte de réception n'est pas encore activée (migration 005).")}</div>
      ) : messages.length ? (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`admin-card ${m.read_at ? "" : "border-ocean/40 bg-sky-50/40"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-midnight">{m.name}</p>
                    <Pill className={m.kind === "feedback" ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-sky-50 text-sky-800 ring-sky-200"}>
                      {t(m.kind === "feedback" ? "Avis" : "Contact")}
                    </Pill>
                    {!m.read_at && <Pill className="bg-ocean text-white ring-ocean">{t("Nouveau")}</Pill>}
                    {m.rating && (
                      <span className="text-sm text-gold" aria-label={t("{n} sur 5", { n: m.rating })}>
                        {"★".repeat(m.rating)}
                        <span className="text-line">{"★".repeat(5 - m.rating)}</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate">
                    {fmtDate(m.created_at, true, lang)}
                    {m.lang && ` · ${m.lang.toUpperCase()}`}
                    {m.subject && ` · ${m.subject}`}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <form action={markMessageAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={m.read_at ? "0" : "1"} />
                    {kind && <input type="hidden" name="kind" value={kind} />}
                    <button className="admin-btn admin-btn-ghost !py-1.5 text-xs">{m.read_at ? t("Marquer comme non lu") : t("Marquer comme lu")}</button>
                  </form>
                  {can(admin.role, "delete") && (
                    <form action={deleteMessageAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton message={t("Supprimer ce message ?")} className="text-xs text-slate hover:text-red-700">
                        {t("Supprimer")}
                      </ConfirmButton>
                    </form>
                  )}
                </div>
              </div>
              <p dir="auto" className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">
                {m.message}
              </p>
              {(m.email || m.phone) && (
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="font-medium text-ocean hover:underline">
                      {m.email}
                    </a>
                  )}
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="font-medium text-ocean hover:underline" dir="ltr">
                      {m.phone}
                    </a>
                  )}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card py-12 text-center text-sm text-slate">{t("Aucun message pour l'instant.")}</div>
      )}
    </div>
  );
}
