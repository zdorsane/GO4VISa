import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion: it renders
 * like the server (motion on) during hydration, then switches to the visitor's
 * setting. framer's hook reads the setting on the first client render, so the
 * HTML no longer matched for visitors who reduce motion.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
