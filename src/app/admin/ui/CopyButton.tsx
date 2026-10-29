"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copier l'URL", className = "font-medium text-ocean hover:underline" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
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
          window.prompt("Copiez l'adresse :", text);
        }
      }}
    >
      {done ? "Copié ✓" : label}
    </button>
  );
}
