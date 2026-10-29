import Link from "next/link";
import { LogoSymbol } from "@/components/brand/Logo";
import { requireAdmin } from "@/lib/server/auth";
import { logoutAction } from "../actions";
import { AdminNav } from "../ui/AdminNav";

// Every back-office page reads the session: render on request, never prerender.
export const instant = false;

const ROLE_LABEL = { owner: "Propriétaire", admin: "Administrateur", editor: "Éditeur" } as const;

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <div className="sticky top-0 z-30 bg-midnight lg:static">
      <aside className="border-b border-white/10 bg-midnight text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0">
        <div className="flex h-full flex-col gap-4 px-4 py-3 lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="keep-light flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1.5">
                <LogoSymbol className="h-full w-auto" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">Go4Visa</span>
                <span className="block text-[0.7rem] text-mist">Back-office</span>
              </span>
            </Link>
            <form action={logoutAction} className="lg:hidden">
              <button className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-mist ring-1 ring-white/20 hover:text-white">Déconnexion</button>
            </form>
          </div>
          <AdminNav />
          <div className="mt-auto hidden border-t border-white/10 pt-4 lg:block">
            <p className="truncate text-sm font-medium">{admin.name}</p>
            <p className="truncate text-xs text-mist">
              {ROLE_LABEL[admin.role]} · {admin.email}
            </p>
            <div className="mt-3 flex gap-2">
              <a href="/fr" target="_blank" className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-mist ring-1 ring-white/20 hover:text-white">
                Voir le site
              </a>
              <form action={logoutAction}>
                <button className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-mist ring-1 ring-white/20 hover:text-white">Déconnexion</button>
              </form>
            </div>
          </div>
        </div>
      </aside>
      </div>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
    </div>
  );
}
