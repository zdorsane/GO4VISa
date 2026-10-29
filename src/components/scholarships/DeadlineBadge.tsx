"use client";

import { useSyncExternalStore } from "react";
import { deadlineStatus, type DeadlineStatus } from "@/lib/scholarships";
import { getPlatformDict } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";

export const STATUS_STYLE: Record<DeadlineStatus, string> = {
  open: "bg-emerald-500/12 text-emerald-700 ring-emerald-600/25",
  closing: "bg-orange-500/12 text-orange-700 ring-orange-600/30",
  today: "bg-red-600 text-white ring-red-600",
  upcoming: "bg-sky-500/12 text-sky-700 ring-sky-600/25",
  closed: "bg-zinc-500/10 text-zinc-600 ring-zinc-500/20",
  rolling: "bg-violet-500/10 text-violet-700 ring-violet-600/20",
};

const DOT: Record<DeadlineStatus, string> = {
  open: "bg-emerald-500",
  closing: "bg-orange-500 animate-pulse",
  today: "bg-white animate-pulse",
  upcoming: "bg-sky-500",
  closed: "bg-zinc-400",
  rolling: "bg-violet-500",
};

const noop = () => () => {};

/** Status from the dates and the visitor's clock; the server's value is used until hydration. */
export function useLiveStatus(opens_at: string | null, deadline_at: string | null, initial: DeadlineStatus) {
  return useSyncExternalStore(
    noop,
    () => deadlineStatus({ opens_at, deadline_at }),
    () => initial,
  );
}

export function DeadlineBadge({
  lang,
  opens_at,
  deadline_at,
  initial,
  className = "",
}: {
  lang: Locale;
  opens_at: string | null;
  deadline_at: string | null;
  initial: DeadlineStatus;
  className?: string;
}) {
  const status = useLiveStatus(opens_at, deadline_at, initial);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLE[status]} ${className}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {getPlatformDict(lang).status[status]}
    </span>
  );
}
