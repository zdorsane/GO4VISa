"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { getPlatformDict } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";

/** Native share sheet when available, otherwise WhatsApp / LinkedIn / copy; plus copying the application link. */
export function ShareActions({ lang, title, applyUrl }: { lang: Locale; title: string; applyUrl: string | null }) {
  const t = getPlatformDict(lang).detail;
  const [copied, setCopied] = useState<"page" | "apply" | null>(null);

  const copy = async (text: string, which: "page" | "apply") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt(t.copyLink, text);
    }
  };
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    copy(url, "page");
  };
  const pageUrl = () => (typeof window === "undefined" ? "" : window.location.href);

  const chip = "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-midnight ring-1 ring-line transition-colors hover:ring-midnight/40";
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={share} className={chip}>
        <Icon name="external" className="h-4 w-4" />
        {copied === "page" ? t.copied : t.share}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title)}%20`}
        onClick={(e) => {
          e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl()}`)}`;
        }}
        target="_blank"
        rel="noopener noreferrer"
        className={chip}
        aria-label="WhatsApp"
      >
        <Icon name="whatsapp" className="h-4 w-4" />
        WhatsApp
      </a>
      <a
        href="https://www.linkedin.com/sharing/share-offsite/"
        onClick={(e) => {
          e.currentTarget.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl())}`;
        }}
        target="_blank"
        rel="noopener noreferrer"
        className={chip}
        aria-label="LinkedIn"
      >
        <Icon name="linkedin" className="h-4 w-4" />
        LinkedIn
      </a>
      {applyUrl && (
        <button type="button" onClick={() => copy(applyUrl, "apply")} className={chip}>
          <Icon name="doc" className="h-4 w-4" />
          {copied === "apply" ? t.copied : t.copyLink}
        </button>
      )}
    </div>
  );
}
