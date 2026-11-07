"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./ui/Icon";
import type { Locale } from "@/lib/i18n";

const T = {
  en: {
    title: "Share your experience",
    lead: "Did Go4Visa help you? Leave us a few words.",
    rating: "Your rating",
    star: (n: number) => `${n} star${n > 1 ? "s" : ""}`,
    name: "Your name",
    message: "Your message",
    placeholder: "Tell us about your experience with Go4Visa…",
    send: "Send my feedback",
    sending: "Sending…",
    thanks: "Thank you! Your message has been sent to the Go4Visa team.",
    another: "Write another message",
    errName: "Please enter your name.",
    errMessage: "Please write at least 10 characters.",
    errServer: "We could not send your message. Please try again in a moment.",
  },
  fr: {
    title: "Partagez votre expérience",
    lead: "Go4Visa vous a aidé ? Laissez-nous quelques mots.",
    rating: "Votre note",
    star: (n: number) => `${n} étoile${n > 1 ? "s" : ""}`,
    name: "Votre nom",
    message: "Votre message",
    placeholder: "Racontez-nous votre expérience avec Go4Visa…",
    send: "Envoyer mon avis",
    sending: "Envoi…",
    thanks: "Merci ! Votre message a bien été envoyé à l'équipe Go4Visa.",
    another: "Écrire un autre message",
    errName: "Indiquez votre nom.",
    errMessage: "Écrivez au moins 10 caractères.",
    errServer: "Votre message n'a pas pu être envoyé. Réessayez dans un instant.",
  },
  ar: {
    title: "شاركنا تجربتك",
    lead: "هل ساعدتك Go4Visa؟ اترك لنا بضع كلمات.",
    rating: "تقييمك",
    star: (n: number) => `${n} من 5`,
    name: "اسمك",
    message: "رسالتك",
    placeholder: "حدّثنا عن تجربتك مع Go4Visa…",
    send: "أرسل رأيي",
    sending: "جارٍ الإرسال…",
    thanks: "شكرًا! تم إرسال رسالتك إلى فريق Go4Visa.",
    another: "اكتب رسالة أخرى",
    errName: "يرجى كتابة اسمك.",
    errMessage: "يرجى كتابة 10 أحرف على الأقل.",
    errServer: "تعذّر إرسال رسالتك. حاول مرة أخرى بعد قليل.",
  },
} satisfies Record<Locale, unknown>;

/** Small glass card where a student leaves a rating and a message (read in the back-office). */
export function FeedbackBox({ lang }: { lang: Locale }) {
  const t = T[lang];
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (name.length < 2) return setError(t.errName);
    if (message.length < 10) return setError(t.errMessage);
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, message, rating: rating || null, lang, website: String(form.get("website") ?? "") }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
    } catch {
      setState("idle");
      setError(t.errServer);
    }
  }

  return (
    <div className="relative mx-auto mt-10 max-w-xl">
      <div aria-hidden className="absolute -inset-px rounded-[1.75rem] bg-linear-to-br from-gold/60 via-white/10 to-sky/40" />
      <div className="relative overflow-hidden rounded-[1.7rem] bg-midnight/80 p-6 backdrop-blur-md md:p-7">
        <div aria-hidden className="absolute -end-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <AnimatePresence mode="wait" initial={false}>
          {state === "sent" ? (
            <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative py-6 text-center" role="status">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold text-midnight">
                <Icon name="check" className="h-6 w-6" />
              </span>
              <p className="mt-4 font-semibold text-white">{t.thanks}</p>
              <button
                type="button"
                onClick={() => {
                  setState("idle");
                  setRating(0);
                }}
                className="mt-4 text-sm font-semibold text-gold hover:underline"
              >
                {t.another}
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={submit} noValidate className="relative">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Icon name="chat" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.title}</h3>
                  <p className="text-sm text-mist">{t.lead}</p>
                </div>
              </div>

              <fieldset className="mt-5">
                <legend className="sr-only">{t.rating}</legend>
                <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={t.star(n)}
                      aria-pressed={rating === n}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      <Icon name="star" className={`h-6 w-6 transition-colors ${n <= (hover || rating) ? "fill-gold text-gold" : "text-white/35"}`} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-4 grid gap-3">
                <label className="block">
                  <span className="sr-only">{t.name}</span>
                  <input
                    name="name"
                    maxLength={80}
                    placeholder={t.name}
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">{t.message}</span>
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={1000}
                    placeholder={t.placeholder}
                    className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </label>
                {/* honeypot, hidden from people */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              </div>

              {error && (
                <p role="alert" className="mt-3 text-sm text-orange-300">
                  {error}
                </p>
              )}

              <button
                disabled={state === "sending"}
                className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-midnight transition-all hover:-translate-y-0.5 hover:bg-amber disabled:opacity-60"
              >
                {state === "sending" ? t.sending : t.send}
                <Icon name="plane" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
