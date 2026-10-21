import { useId } from "react";

export type LogoVariant = "color" | "white" | "black" | "mono";

/** Plane glyph (pointing +x, centred on 0,0). Shared with patterns & hero. */
export const PLANE_PATH =
  "M18 0C18-1.5 16-2 14-2L4-2-6-16H-9.5L-4-2H-12L-16.5-8H-19L-16.5-1-17 0-16.5 1-19 8H-16.5L-12 2H-4L-9.5 16H-6L4 2H14C16 2 18 1.5 18 0Z";

const G_PATH =
  "M139.9 74.5A62 62 0 1 0 160.8 110H107V134H129.7A32 32 0 1 1 120.6 97.5Z";
const SWOOSH_PATH =
  "M-2 128C30 127 90 112 181 76C150 96 110 124 68 134C36 141 8 140-2 128Z";

type SymbolProps = {
  variant?: LogoVariant;
  className?: string;
  title?: string;
};

/**
 * The Go4Visa symbol: round G (the globe), graduation cap, airplane on a golden
 * orbital path. Vector recreation of the logo so it can be recoloured for the
 * white / black / single-colour variations defined in the brand book.
 * The original raster artwork lives in /public/assets/go4visa-logo.jpg.
 */
export function LogoSymbol({ variant = "color", className, title }: SymbolProps) {
  const id = useId().replace(/:/g, "");
  const gradG = `g4v-g-${id}`;
  const gradSwoosh = `g4v-s-${id}`;

  const palette = {
    color: { g: `url(#${gradG})`, board: "#0B2D5B", boardEdge: "#0176B1", path: `url(#${gradSwoosh})`, plane: "#F5B301" },
    white: { g: "#FFFFFF", board: "#FFFFFF", boardEdge: "#CBD5E1", path: `url(#${gradSwoosh})`, plane: "#F5B301" },
    black: { g: "#000000", board: "#000000", boardEdge: "#000000", path: "#000000", plane: "#000000" },
    mono: { g: "#0B2D5B", board: "#0B2D5B", boardEdge: "#0B2D5B", path: "#0B2D5B", plane: "#0B2D5B" },
  }[variant];

  return (
    <svg
      viewBox="-6 16 234 172"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradG} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.25" stopColor="#012149" />
          <stop offset="0.7" stopColor="#0176B1" />
          <stop offset="1" stopColor="#03B3E2" />
        </linearGradient>
        <linearGradient id={gradSwoosh} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E39C2A" />
          <stop offset="1" stopColor="#F5B301" />
        </linearGradient>
      </defs>
      {/* G / globe */}
      <path d={G_PATH} fill={palette.g} />
      {/* Graduation cap */}
      <path d="M94.7 47.3H132.3L131.1 60.1Q113 62 95.7 59.3Z" fill={palette.board} />
      <path d="M70.6 41.3L115.4 21.5 158.1 34 117.1 50.4Z" fill={palette.board} />
      <path d="M70.6 41.3L117.1 50.4 158.1 34V36.5L117.1 53 70.6 43.6Z" fill={palette.boardEdge} />
      <path
        d="M114.2 35.2L150.9 35.9 152.1 52"
        fill="none"
        stroke={variant === "color" || variant === "white" ? "#F5B301" : palette.board}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M148.4 51.6H155.6L156.5 63H147.5Z"
        fill={variant === "color" || variant === "white" ? "#F5B301" : palette.board}
      />
      {/* Orbital path + plane + star */}
      <path d={SWOOSH_PATH} fill={palette.path} />
      <path d={PLANE_PATH} transform="translate(196 68) rotate(-30)" fill={palette.plane} />
      <path d="M221.5 46.5L223 51.3 227.8 52.8 223 54.3 221.5 59.1 220 54.3 215.2 52.8 220 51.3Z" fill={palette.plane} />
    </svg>
  );
}

type WordmarkProps = { variant?: LogoVariant; className?: string };

/** "Go4Visa" in Montserrat with the gold 4. */
export function Wordmark({ variant = "color", className = "" }: WordmarkProps) {
  const base =
    variant === "white" ? "text-white" : variant === "black" ? "text-black" : "text-midnight";
  const four = variant === "black" || variant === "mono" ? "" : "text-gold";
  return (
    <span className={`font-bold tracking-tight ${base} ${className}`}>
      Go<span className={four}>4</span>Visa
    </span>
  );
}

/** Horizontal lock-up used in the navbar and footer. */
export function LogoLockup({ variant = "color", className = "" }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoSymbol variant={variant} className="h-9 w-auto" />
      <Wordmark variant={variant} className="text-xl" />
    </span>
  );
}
