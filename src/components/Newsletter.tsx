"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { getPlatformDict } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";

type State = "idle" | "sending" | "ok" | "already" | "invalid" | "error";

/** Newsletter sign-up band, stored in the newsletter_subscribers table. */
export function Newsletter({ lang }: { lang: Locale }) {
  const t = getPlatformDict(lang).newsletter;
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState("invalid");
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, lang, website: String(form.get("website") ?? "") }),
      });
      const data = await res.json().catch(() => ({}));
      setState(res.ok ? (data.status === "already" ? "already" : "ok") : data.error === "invalid" ? "invalid" : "error");
    } catch {
      setState("error");
    }
  }

  const message = { ok: t.ok, already: t.already, invalid: t.invalid, error: t.error }[state as "ok"];

  return (
    <section aria-labelledby="newsletter-title" className="py-16 md:py-20">
      <div className="container-brand">
        <div className="pattern-flight relative isolate overflow-hidden rounded-brand-lg px-6 py-10 md:px-12 md:py-14">
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-br from-navy via-midnight to-ocean/70" />
          <div aria-hidden className="absolute -end-16 -top-16 -z-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-midnight">
                <Icon name="mail" className="h-5 w-5" />
              </span>
              <h2 id="newsletter-title" className="mt-4 text-2xl font-bold text-white md:text-3xl">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-mist md:text-base">{t.text}</p>
            </div>
            <form onSubmit={submit} noValidate className="w-full">
              <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur sm:flex-row">
                <label className="sr-only" htmlFor="newsletter-email">
                  {t.placeholder}
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={t.placeholder}
                  aria-invalid={state === "invalid"}
                  aria-describedby="newsletter-status"
                  className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-gold"
                />
                {/* honeypot, hidden from people */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-midnight transition-colors hover:bg-amber disabled:opacity-70"
                >
                  {state === "sending" ? "…" : t.cta}
                </button>
              </div>
              <p id="newsletter-status" role="status" className={`mt-3 min-h-5 text-sm ${state === "ok" || state === "already" ? "text-emerald-300" : "text-red-200"}`}>
                {message}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
