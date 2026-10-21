import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "gold" | "outline-light" | "outline-dark" | "midnight";

const styles: Record<Variant, string> = {
  // Gold is reserved for CTAs — midnight text keeps AA contrast on gold.
  gold: "bg-gold text-midnight hover:bg-amber shadow-[0_10px_30px_-10px_rgba(245,179,1,0.7)]",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white/10",
  "outline-dark": "border border-midnight/25 text-midnight hover:border-midnight hover:bg-midnight/5",
  midnight: "bg-midnight text-white hover:bg-navy",
};

export function buttonClasses(variant: Variant = "gold", extra = "") {
  return `group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${styles[variant]} ${extra}`;
}

export function ButtonLink({
  variant = "gold",
  arrow = false,
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean; children: ReactNode }) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      {children}
      {arrow && (
        <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      )}
    </Link>
  );
}
