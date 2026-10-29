import type { Category, DeadlineStatus, Funding, Level, Warning, Workflow } from "@/lib/scholarships";
import type { NewsCategory, NewsLabel } from "@/lib/news";

export const WORKFLOW_LABEL: Record<Workflow, string> = {
  draft: "Brouillon",
  review: "En relecture",
  approved: "Approuvée",
  published: "Publiée",
  archived: "Archivée",
};
export const WORKFLOW_STYLE: Record<Workflow, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  review: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-sky-50 text-sky-800 ring-sky-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export const DEADLINE_LABEL: Record<DeadlineStatus, string> = {
  open: "Ouverte",
  closing: "Clôture proche",
  today: "Dernier jour",
  upcoming: "À venir",
  closed: "Clôturée",
  rolling: "Sans date limite",
};
export const DEADLINE_STYLE: Record<DeadlineStatus, string> = {
  open: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  closing: "bg-orange-50 text-orange-800 ring-orange-200",
  today: "bg-red-600 text-white ring-red-600",
  upcoming: "bg-sky-50 text-sky-800 ring-sky-200",
  closed: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  rolling: "bg-violet-50 text-violet-800 ring-violet-200",
};

export const WARNING_LABEL: Record<Warning, string> = {
  "no-source": "Source officielle manquante",
  "bad-link": "Lien de candidature manquant ou invalide",
  "deadline-passed": "La date limite est dépassée",
  "eligibility-missing": "Informations d'éligibilité incomplètes (nationalités, diplômes ou niveau)",
  stale: "Pas vérifiée depuis plus de 30 jours",
  unverified: "Non vérifiée sur la source officielle",
  "algeria-unknown": "Éligibilité des candidats algériens non confirmée",
};

export const LEVEL_LABEL: Record<Level, string> = {
  highschool: "Lycée / bac",
  bachelor: "Licence",
  master: "Master",
  phd: "Doctorat",
  postdoc: "Post-doctorat",
  professional: "Professionnel",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  undergraduate: "Bourse de licence",
  masters: "Bourse de master",
  phd: "Bourse de doctorat",
  postdoc: "Post-doctorat",
  "research-fellowship": "Fellowship de recherche",
  "summer-school": "École d'été / d'hiver",
  internship: "Stage international",
  leadership: "Programme de leadership",
  exchange: "Programme d'échange",
  volunteering: "Volontariat",
};

export const FUNDING_LABEL: Record<Funding, string> = {
  full: "Entièrement financée",
  partial: "Partiellement financée",
  stipend: "Allocation / stage rémunéré",
  unpaid: "Non rémunéré",
  unknown: "Non précisé",
};

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  announcement: "Annonce",
  scholarship: "Bourse",
  deadline: "Date limite",
  results: "Résultats",
  event: "Événement",
  guide: "Guide",
};

export const NEWS_LABEL_LABEL: Record<NewsLabel, string> = {
  new: "Nouveau",
  important: "Important",
  "applications-open": "Candidatures ouvertes",
  "deadline-alert": "Alerte date limite",
  announcement: "Annonce",
  "results-released": "Résultats publiés",
};

export function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}>{children}</span>;
}

export const fmtDate = (iso: string | Date | null, withTime = false) =>
  iso
    ? new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Africa/Algiers",
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      }).format(new Date(iso))
    : "—";
