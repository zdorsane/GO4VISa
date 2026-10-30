import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { GlobeHorizon } from "./brand/GlobeHorizon";
import { ContactPanel } from "./Contact";
import { FounderProfile } from "./Founder";

/**
 * Meet the founder + contact, one section on the shared midnight background
 * (the boarding pass's perforation cut-outs are drawn in midnight). Both
 * #founder and #contact anchors land on their own half.
 */
export function FounderContact({
  lang,
  founder,
  contact,
}: {
  lang: Locale;
  founder: Dict["founder"];
  contact: Dict["contact"];
}) {
  return (
    <section
      id="founder"
      aria-labelledby="founder-title"
      className="relative isolate overflow-hidden bg-midnight pb-24 pt-12 md:pb-32 md:pt-16"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_15%_15%,rgba(3,179,226,0.2),transparent_70%),radial-gradient(40%_40%_at_90%_60%,rgba(245,179,1,0.1),transparent_70%)]" />
      <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 w-full md:h-28" />

      <div className="container-brand grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-0">
        <div className="min-w-0 lg:pe-12">
          <FounderProfile t={founder} />
        </div>
        <div id="contact" className="min-w-0 border-t border-white/10 pt-12 lg:border-s lg:border-t-0 lg:ps-12 lg:pt-0">
          <ContactPanel lang={lang} t={contact} />
        </div>
      </div>
    </section>
  );
}
