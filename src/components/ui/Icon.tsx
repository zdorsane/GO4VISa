import type { SVGProps } from "react";
import { PLANE_PATH } from "@/components/brand/Logo";

export type IconName =
  | "cap"
  | "plane"
  | "path"
  | "g"
  | "globe"
  | "star"
  | "doc"
  | "list"
  | "home"
  | "user"
  | "check"
  | "id"
  | "mail"
  | "phone"
  | "web"
  | "arrow"
  | "plus"
  | "close"
  | "menu"
  | "quote"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "external"
  | "pen"
  | "search"
  | "chat"
  | "wallet"
  | "pulse";

/** Line icons in the brand's icon-field style (24px grid, 1.75 stroke). */
export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  switch (name) {
    case "cap":
      return (
        <svg {...common}>
          <path d="M2 9.5 12 5l10 4.5-10 4.5z" />
          <path d="M6 11.5v4.5c3.5 2.5 8.5 2.5 12 0v-4.5M22 9.5v5" />
        </svg>
      );
    case "plane":
      return (
        <svg {...common} fill="currentColor" stroke="none" viewBox="-20 -20 40 40">
          <path d={PLANE_PATH} transform="rotate(-40)" />
        </svg>
      );
    case "path":
      return (
        <svg {...common}>
          <path d="M3 19c6-1.5 11-5 17-14" />
          <circle cx="20" cy="5" r="1.2" fill="currentColor" />
        </svg>
      );
    case "g":
      return (
        <svg {...common}>
          <path d="M17.5 6.5A8 8 0 1 0 20 12h-7" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18M4.5 7.5h15M4.5 16.5h15" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M9 6h11M9 12h11M9 18h11" />
          <path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11 12 4l9 7M5 9.5V20h14V9.5M10 20v-5h4v5" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      );
    case "id":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="2" />
          <path d="M6 16c.6-1.6 1.7-2.3 3-2.3s2.4.7 3 2.3M14 10h4M14 14h4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 6.5 8.5 7 8.5-7" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
      );
    case "web":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common} className={`rtl:-scale-x-100 ${props.className ?? ""}`}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      );
    case "pen":
      return (
        <svg {...common}>
          <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
          <path d="m13.5 6.5 4 4M13 20h7" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5M8.5 11l1.8 1.8 3.2-3.6" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...common}>
          <path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4H5a2 2 0 0 0 0 4h14a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6" />
          <path d="M16.5 14h.01" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-5 4 10 2.5-6 1.5 1h4" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "quote":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M4 18v-5.5C4 8.5 6 6 10 5l.7 1.6C8.5 7.4 7.5 9 7.4 11H10v7zm10 0v-5.5C14 8.5 16 6 20 5l.7 1.6c-2.2.8-3.2 2.4-3.3 4.4H20v7z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
        </svg>
      );
  }
}
