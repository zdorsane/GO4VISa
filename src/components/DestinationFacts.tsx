import type { Dict } from "@/lib/content";
import type { Destination } from "@/lib/destinations";
import { Icon, type IconName } from "./ui/Icon";

const rows: { key: keyof Dict["destinations"]["facts"] & keyof Destination; icon: IconName }[] = [
  { key: "fundedBy", icon: "home" },
  { key: "levels", icon: "user" },
  { key: "covers", icon: "check" },
  { key: "howToApply", icon: "doc" },
  { key: "when", icon: "id" },
];

/** The five facts per flagship programme, laid out as in the brand book. */
export function DestinationFacts({
  d,
  t,
  tone = "light",
}: {
  d: Destination;
  t: Dict["destinations"];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div>
      <dl className="grid gap-5 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.key} className={`flex gap-4 ${r.key === "when" ? "md:col-span-2" : ""}`}>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ${
                dark ? "bg-white/5 text-sky ring-white/15" : "bg-cloud text-midnight ring-line"
              }`}
            >
              <Icon name={r.icon} className="h-5 w-5" />
            </span>
            <div>
              <dt className={`text-sm font-semibold ${dark ? "text-sky" : "text-ocean"}`}>{t.facts[r.key]}</dt>
              <dd className={`mt-1 ${dark ? "text-white/90" : "text-midnight"}`}>{d[r.key] as string}</dd>
            </div>
          </div>
        ))}
      </dl>
      <p
        className={`mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full px-5 py-3 text-sm ring-1 ${
          dark ? "bg-white/5 ring-white/15" : "bg-cloud ring-line"
        }`}
      >
        <span className={`font-semibold ${dark ? "text-white" : "text-midnight"}`}>{t.officialSite}</span>
        {d.officialSite.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 py-1.5 underline-offset-4 hover:underline ${dark ? "text-gold" : "text-ocean"}`}
          >
            {s.label}
            <Icon name="external" className="h-3.5 w-3.5" />
            <span className="sr-only">{t.newTab}</span>
          </a>
        ))}
      </p>
    </div>
  );
}
