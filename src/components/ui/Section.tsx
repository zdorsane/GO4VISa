import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Tone = "light" | "dark";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "start",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
  align?: "start" | "center";
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className={`label-caps ${dark ? "text-gold" : "text-ocean"}`}>{eyebrow}</p>
      <h2
        id={id}
        className={`mt-3 text-3xl font-semibold leading-tight md:text-[2.5rem] ${dark ? "text-white" : "text-midnight"}`}
      >
        {title}
      </h2>
      {lead && <p className={`mt-4 text-base md:text-lg ${dark ? "text-mist" : "text-slate"}`}>{lead}</p>}
    </Reveal>
  );
}
