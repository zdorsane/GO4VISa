"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useT } from "./AdminLang";

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Tableau de bord", icon: "pulse" },
  { href: "/admin/scholarships", label: "Bourses", icon: "cap" },
  { href: "/admin/import", label: "Importer un PDF", icon: "doc" },
  { href: "/admin/messages", label: "Messages", icon: "mail" },
  { href: "/admin/media", label: "Médias", icon: "star" },
];

export function AdminNav({ unread = 0 }: { unread?: number }) {
  const path = usePathname();
  const { t } = useT();
  return (
    <nav aria-label="Back-office" className="-mx-1 flex gap-1 overflow-x-auto lg:mx-0 lg:mt-4 lg:flex-col">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-white/12 text-white ring-1 ring-white/15" : "text-mist hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name={l.icon} className={`h-4 w-4 ${active ? "text-gold" : ""}`} />
            {t(l.label)}
            {l.href === "/admin/messages" && unread > 0 && (
              <span className="ms-auto rounded-full bg-gold px-1.5 text-[0.7rem] font-bold text-midnight">{unread}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
