"use client";

import { useState } from "react";
import { useT } from "./AdminLang";

export function CopyButton({ text, label, className = "font-medium text-ocean hover:underline" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  const { t } = useT();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          window.prompt(t("Copiez l'adresse :"), text);
        }
      }}
    >
      {done ? t("Copié ✓") : (label ?? t("Copier l'URL"))}
    </button>
  );
}
