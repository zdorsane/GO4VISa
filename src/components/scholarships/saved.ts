"use client";

import { useSyncExternalStore } from "react";

/** Saved opportunities live in this browser only (a per-visitor convenience, no account needed). */
const KEY = "g4v-saved-scholarships";
const EVENT = "g4v-saved-change";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Slugs of the saved opportunities (raw JSON string keeps the snapshot stable). */
export function useSaved(): string[] {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function toggleSaved(slug: string) {
  let list: string[] = [];
  try {
    list = JSON.parse(read());
  } catch {}
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug].slice(-200);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
