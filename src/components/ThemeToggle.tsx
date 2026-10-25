"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./ui/Icon";

/**
 * Light / dark theme. The choice is stored in localStorage and applied as
 * <html data-theme="dark"> by THEME_SCRIPT before the page paints (no flash);
 * globals.css holds the dark palette. Light stays the default brand look.
 */
export const THEME_KEY = "g4v-theme";
const EVENT = "g4v-theme";

export const THEME_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** True while the dark theme is on. */
export function useIsDark() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );
}

function setTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) root.dataset.theme = "dark";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    // private mode: the choice simply isn't remembered
  }
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle({
  toDark,
  toLight,
  tone,
  className = "",
}: {
  toDark: string;
  toLight: string;
  tone: "light" | "dark";
  className?: string;
}) {
  const dark = useIsDark();
  const label = dark ? toLight : toDark;
  return (
    <button
      type="button"
      onClick={() => setTheme(!dark)}
      aria-label={label}
      aria-pressed={dark}
      title={label}
      className={`group relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 transition-colors ${
        tone === "dark" ? "text-midnight ring-midnight/15 hover:bg-midnight/5" : "text-white ring-white/30 hover:bg-white/10"
      } ${className}`}
    >
      <Icon
        name="sun"
        className={`absolute h-4.5 w-4.5 transition-all duration-500 ${dark ? "rotate-0 scale-100 opacity-100 text-gold" : "-rotate-90 scale-50 opacity-0"}`}
      />
      <Icon
        name="moon"
        className={`absolute h-4 w-4 transition-all duration-500 ${dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
    </button>
  );
}
