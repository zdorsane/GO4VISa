import { GlobeHorizon } from "../brand/GlobeHorizon";
import { Reveal } from "./Reveal";

/** Dark opening band of an inner page: sits under the transparent navbar and holds the page's <h1>. */
export function PageHeader({ id, eyebrow, title, lead }: { id: string; eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="pattern-flight relative isolate overflow-hidden pb-24 pt-[calc(var(--g4v-header-h)+2.5rem)] md:pb-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-navy/80 via-midnight/40 to-midnight/90" />
      <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-16 w-full md:h-24" />
      <Reveal className="container-brand max-w-3xl text-center">
        <p className="label-caps text-gold">{eyebrow}</p>
        <h1 id={id} className="mt-3 text-3xl font-bold leading-tight text-white md:text-[2.6rem]">
          {title}
        </h1>
        {lead && <p className="mt-4 text-sm text-mist md:text-base">{lead}</p>}
      </Reveal>
    </section>
  );
}
