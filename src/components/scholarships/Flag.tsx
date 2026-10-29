import { Icon } from "@/components/ui/Icon";

/** Flags shipped in public/flags (emoji flags do not render on Windows). */
const AVAILABLE = new Set(["ae", "at", "au", "be", "br", "ca", "ch", "cn", "cz", "de", "dk", "dz", "eg", "es", "fi", "fr", "gb", "gh", "hu", "id", "ie", "in", "it", "jo", "jp", "ke", "kr", "lb", "lu", "ma", "mx", "my", "ng", "nl", "no", "nz", "pl", "pt", "qa", "ro", "ru", "rw", "sa", "se", "sg", "sn", "th", "tn", "tr", "us", "za"]);

export function Flag({ code, className = "h-4 w-6" }: { code: string | null | undefined; className?: string }) {
  const c = code?.toLowerCase();
  if (!c || !AVAILABLE.has(c)) return <Icon name="globe" className={className.replace(/w-\S+/, "") + " text-ocean"} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs
  return <img src={`/flags/${c}.svg`} alt="" aria-hidden className={`${className} shrink-0 rounded-[3px] object-cover shadow-sm ring-1 ring-black/5`} />;
}
