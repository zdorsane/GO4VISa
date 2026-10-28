"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { HELP_OPTIONS, price, validateBooking, type BookingErrors, type BookingInput } from "@/lib/booking";
import { useReducedMotion } from "@/lib/motion";
import { ButtonLink, buttonClasses } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";

type T = Dict["booking"];
type Key = keyof BookingErrors;

const empty: BookingInput = {
  name: "",
  email: "",
  whatsapp: "",
  opportunity: "",
  reason: "",
  help: "",
  helpOther: "",
  question: "",
  company: "",
};

/** Order of the questions on the page — used to focus the first error. */
const ORDER: Key[] = ["name", "email", "whatsapp", "opportunity", "reason", "help", "helpOther", "question"];

const inputBase =
  "mt-2 block w-full rounded-xl border bg-cloud px-4 py-3 text-midnight placeholder:text-slate/60 transition-colors focus:border-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky/30";

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#B42318]" role="alert">
      {error}
    </p>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-midnight">
        {label} <span className="text-[#B42318]" aria-hidden>*</span>
      </label>
      {hint && <p className="mt-0.5 text-xs text-slate">{hint}</p>}
      {children}
      <ErrorText id={id} error={error} />
    </div>
  );
}

function Group({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-5 border-t border-line pt-8 first:border-t-0 first:pt-0 sm:grid-cols-2">
      <legend className="contents">
        <span className="flex items-center gap-3 sm:col-span-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-midnight text-sm font-semibold text-gold">{n}</span>
          <span className="text-lg font-semibold text-midnight">{title}</span>
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

/** Radio list rendered as selectable cards. */
function Choices({
  id,
  label,
  options,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  options: { value: string; label: ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={error ? `${id}-error` : undefined} className="sm:col-span-2">
      <p id={`${id}-label`} className="text-sm font-semibold text-midnight">
        {label} <span className="text-[#B42318]" aria-hidden>*</span>
      </p>
      <div className="mt-3 grid gap-2.5">
        {options.map((o, i) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky/40 ${
                checked ? "border-ocean bg-sky/10 font-semibold text-midnight" : error ? "border-[#B42318]/50 bg-white text-ink hover:border-ocean/50" : "border-line bg-white text-ink hover:border-ocean/50"
              }`}
            >
              <input
                type="radio"
                id={i === 0 ? id : undefined}
                name={id}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="h-4 w-4 shrink-0 accent-ocean"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <ErrorText id={id} error={error} />
    </div>
  );
}

/** Consultation price — no payment is taken on the site. */
function PriceCard({ t }: { t: T }) {
  return (
    <div className="overflow-hidden rounded-brand-lg bg-midnight text-white shadow-[0_30px_60px_-25px_rgba(11,45,91,0.5)]">
      <div className="bg-linear-to-br from-ocean/40 to-transparent p-6">
        <p className="label-caps !text-[0.68rem] text-gold">{t.price}</p>
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span dir="ltr" className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight">{price.dzd}</span>
            <span className="text-xl font-semibold text-gold">DA</span>
          </span>
          <span dir="ltr" className="ms-1 text-sm text-mist">≈ {price.usd}</span>
        </p>
      </div>
      <p className="flex items-start gap-3 border-t border-white/10 px-6 py-4 text-sm text-mist">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-midnight">
          <Icon name="check" className="h-3 w-3" />
        </span>
        {t.priceNote}
      </p>
    </div>
  );
}

/** What happens after submitting: a blinking speech cloud "said" by the WhatsApp badge below it. */
function WhatsAppBubble({ t }: { t: T }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8"
    >
      {/* the cloud: puffs + body share one drop-shadow, so the glow follows the whole outline */}
      <div className="relative [filter:drop-shadow(0_14px_24px_rgba(11,45,91,0.18))] motion-safe:animate-[g4v-glow_2.8s_ease-in-out_infinite]">
        <span aria-hidden className="absolute -top-3 inset-s-8 h-9 w-9 rounded-full bg-white" />
        <span aria-hidden className="absolute -top-5 inset-s-15 h-12 w-12 rounded-full bg-white" />
        <span aria-hidden className="absolute -top-3 inset-s-25 h-8 w-8 rounded-full bg-white" />
        <span aria-hidden className="absolute -top-2 inset-e-10 h-7 w-7 rounded-full bg-white" />

        <div className="relative rounded-[2rem] bg-white px-6 py-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ocean">
            <Icon name="whatsapp" className="h-4 w-4 text-[#25D366]" strokeWidth={2} />
            {t.bubbleFrom} <span className="font-medium text-slate">· WhatsApp</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{t.nextSteps}</p>
          <p className="mt-4 flex items-center gap-2.5 font-semibold text-midnight">
            <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-gold" />
            {t.signoff}
          </p>
        </div>
      </div>

      {/* thought trail down to the WhatsApp badge */}
      <div aria-hidden className="relative h-20">
        <span className="absolute inset-s-14 top-2 h-4 w-4 rounded-full bg-white shadow-[0_4px_12px_-4px_rgba(3,179,226,0.6)] motion-safe:animate-[g4v-blink_1.8s_ease-in-out_infinite]" />
        <span className="absolute inset-s-11 top-7 h-2.5 w-2.5 rounded-full bg-white shadow-[0_4px_12px_-4px_rgba(3,179,226,0.6)] motion-safe:animate-[g4v-blink_1.8s_ease-in-out_0.3s_infinite]" />
        <span className="absolute inset-s-0 top-9 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.8)]">
          <span className="absolute inset-0 rounded-full bg-[#25D366] motion-safe:animate-[g4v-ping-soft_3.2s_ease-out_infinite]" />
          <Icon name="whatsapp" className="relative h-5 w-5" />
        </span>
      </div>
    </motion.div>
  );
}

export function BookingForm({ lang, t }: { lang: Locale; t: T }) {
  const uid = useId();
  const [values, setValues] = useState<BookingInput>(empty);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const id = (k: string) => `${uid}-${k}`;
  const clear = (k: Key) => errors[k] && setErrors((er) => ({ ...er, [k]: undefined }));
  const setValue = (k: keyof BookingInput, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    clear(k);
  };
  const bind = (k: keyof BookingInput) => ({
    id: id(k),
    name: k,
    value: values[k] ?? "",
    onChange: (e: { target: { value: string } }) => setValue(k, e.target.value),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id(k)}-error` : undefined,
    className: `${inputBase} ${errors[k] ? "border-[#B42318]/60" : "border-line"}`,
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateBooking(values, lang);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = ORDER.find((k) => found[k]);
      if (first) document.getElementById(id(first))?.focus();
      setStatus("error");
      setServerError(t.checkForm);
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const body = new FormData();
      for (const [k, v] of Object.entries(values)) body.append(k, v ?? "");
      body.append("lang", lang);
      const res = await fetch("/api/booking", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error ?? t.checkForm);
      }
      setStatus("sent");
      setValues(empty);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : t.genericError);
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
      <Reveal className="order-2 rounded-brand-lg bg-white p-6 shadow-[0_30px_60px_-25px_rgba(11,45,91,0.35)] ring-1 ring-line md:p-10 lg:order-1">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[26rem] flex-col items-center justify-center text-center" role="status">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-midnight">
                <Icon name="plane" className="h-8 w-8" />
              </span>
              <h2 id="booking-title" className="mt-6 text-2xl font-semibold text-midnight">{t.sentTitle}</h2>
              <p className="mt-3 max-w-md text-slate">{t.sentText}</p>
              <ButtonLink href={`/${lang}`} variant="outline-dark" className="mt-8">
                {t.backHome}
              </ButtonLink>
            </motion.div>
          ) : (
            <motion.form key="form" noValidate onSubmit={onSubmit} initial={false} exit={{ opacity: 0 }}>
              <h2 id="booking-title" className="text-xl font-semibold text-midnight md:text-2xl">{t.formTitle}</h2>
              <p className="mt-2 text-sm text-slate">{t.formLead}</p>
              <p className="mt-2 text-sm text-slate">
                <span className="text-[#B42318]" aria-hidden>* </span>
                {t.requiredNote}
              </p>

              <div className="mt-8 space-y-8">
                <Group n={1} title={t.steps[0]}>
                  <div className="sm:col-span-2">
                    <Field id={id("name")} label={t.q.name} error={errors.name}>
                      <input {...bind("name")} autoComplete="name" required />
                    </Field>
                  </div>
                  <Field id={id("email")} label={t.q.email} error={errors.email}>
                    <input {...bind("email")} type="email" autoComplete="email" required dir="ltr" />
                  </Field>
                  <Field id={id("whatsapp")} label={t.q.whatsapp} error={errors.whatsapp}>
                    <input {...bind("whatsapp")} type="tel" autoComplete="tel" required placeholder="+213 …" dir="ltr" />
                  </Field>
                </Group>

                <Group n={2} title={t.steps[1]}>
                  <div className="sm:col-span-2">
                    <Field id={id("opportunity")} label={t.q.opportunity} hint={t.q.opportunityHint} error={errors.opportunity}>
                      <input {...bind("opportunity")} required />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field id={id("reason")} label={t.q.reason} error={errors.reason}>
                      <textarea {...bind("reason")} rows={4} required className={`${bind("reason").className} resize-y`} />
                    </Field>
                  </div>
                  <Choices
                    id={id("help")}
                    label={t.q.help}
                    value={values.help}
                    error={errors.help}
                    onChange={(v) => {
                      setValue("help", v);
                      clear("helpOther");
                    }}
                    options={HELP_OPTIONS.map((o) => ({ value: o, label: t.helpOptions[o] }))}
                  />
                  {values.help === "other" && (
                    <div className="sm:col-span-2">
                      <Field id={id("helpOther")} label={t.q.helpOther} error={errors.helpOther}>
                        <input {...bind("helpOther")} required />
                      </Field>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <Field id={id("question")} label={t.q.question} error={errors.question}>
                      <textarea {...bind("question")} rows={4} required className={`${bind("question").className} resize-y`} />
                    </Field>
                  </div>
                </Group>

              </div>

              {/* honeypot */}
              <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor={id("company")}>Company</label>
                <input id={id("company")} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => setValue("company", e.target.value)} />
              </div>

              <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate" aria-live="polite">
                  {status === "error" ? <span className="font-medium text-[#B42318]">{serverError}</span> : status === "sending" ? t.sending : t.closing}
                </p>
                <button type="submit" disabled={status === "sending"} className={buttonClasses("gold", "shrink-0 disabled:cursor-wait disabled:opacity-70")}>
                  {status === "sending" ? t.sending : t.send}
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>

      <Reveal delay={0.1} className="order-1 lg:sticky lg:top-[calc(var(--g4v-header-h)+1.5rem)] lg:order-2">
        <PriceCard t={t} />
        <WhatsAppBubble t={t} />
      </Reveal>
    </div>
  );
}
