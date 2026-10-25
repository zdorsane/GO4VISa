"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import {
  HELP_OPTIONS,
  PAYMENT_OPTIONS,
  RECEIPT_ACCEPT,
  payment,
  validateBooking,
  type BookingErrors,
  type BookingInput,
} from "@/lib/booking";
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
  payment: "",
  company: "",
};

/** Order of the questions on the page — used to focus the first error. */
const ORDER: Key[] = ["name", "email", "whatsapp", "opportunity", "reason", "help", "helpOther", "question", "payment", "receipt"];

const paymentLabels: Record<(typeof PAYMENT_OPTIONS)[number], string> = {
  baridimob: "📱 BaridiMob",
  ccp: "🏦 Algeria Post (CCP)",
  binance: "💰 Binance (USDT)",
};

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
  columns = 1,
}: {
  id: string;
  label: string;
  options: { value: string; label: ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  columns?: 1 | 3;
}) {
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={error ? `${id}-error` : undefined} className="sm:col-span-2">
      <p id={`${id}-label`} className="text-sm font-semibold text-midnight">
        {label} <span className="text-[#B42318]" aria-hidden>*</span>
      </p>
      <div className={`mt-3 grid gap-2.5 ${columns === 3 ? "sm:grid-cols-3" : ""}`}>
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

function CopyValue({ value, t }: { value: string; t: T }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard unavailable — the value stays selectable */
        }
      }}
      className="group inline-flex items-center gap-2 rounded-lg px-1.5 py-0.5 text-start font-mono text-[0.95rem] font-semibold tracking-wide text-white hover:bg-white/10"
      aria-label={`${t.copy} ${value}`}
    >
      <span dir="ltr" className="break-all">{value}</span>
      <span className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-wider ${copied ? "bg-gold text-midnight" : "bg-white/10 text-mist group-hover:text-white"}`}>
        {copied ? t.copied : t.copy}
      </span>
    </button>
  );
}

function PaymentCard({ t, selected }: { t: T; selected: string }) {
  const methods: { id: (typeof PAYMENT_OPTIONS)[number]; icon: string; name: string; rows: { label: string; value: string; copy?: boolean }[] }[] = [
    { id: "baridimob", icon: "📱", name: "BaridiMob", rows: [{ label: "RIP", value: payment.baridimob.rip, copy: true }] },
    {
      id: "ccp",
      icon: "🏦",
      name: "Algeria Post (CCP)",
      rows: [
        { label: t.holder, value: payment.ccp.holder },
        { label: "CCP", value: payment.ccp.account, copy: true },
        { label: t.key, value: payment.ccp.key },
      ],
    },
    { id: "binance", icon: "💰", name: "Binance (USDT)", rows: [{ label: "Binance ID", value: payment.binance.id, copy: true }] },
  ];

  return (
    <div className="overflow-hidden rounded-brand-lg bg-midnight text-white shadow-[0_30px_60px_-25px_rgba(11,45,91,0.5)]">
      <div className="bg-linear-to-br from-ocean/40 to-transparent p-6">
        <p className="label-caps !text-[0.68rem] text-gold">{t.paymentTitle}</p>
        <p className="mt-3 text-sm text-mist">{t.price}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-white">
          <span className="text-4xl font-bold">{payment.priceUsd}</span>
          <span className="text-lg font-semibold text-gold">{payment.priceDzd}</span>
        </p>
      </div>
      <ul className="space-y-3 p-4">
        {methods.map((m) => (
          <li
            key={m.id}
            className={`rounded-brand p-4 ring-1 transition-colors ${selected === m.id ? "bg-white/10 ring-gold" : "bg-white/[0.03] ring-white/10"}`}
          >
            <p className="flex items-center gap-2 font-semibold">
              <span aria-hidden>{m.icon}</span>
              {m.name}
              {selected === m.id && <Icon name="check" className="ms-auto h-4 w-4 text-gold" />}
            </p>
            <dl className="mt-2 space-y-1 text-sm">
              {m.rows.map((r) => (
                <div key={r.label} className="flex flex-wrap items-center justify-between gap-x-3">
                  <dt className="text-mist">{r.label}</dt>
                  <dd>{r.copy ? <CopyValue value={r.value} t={t} /> : <span dir="ltr" className="px-1.5 font-semibold">{r.value}</span>}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <p className="border-t border-white/10 px-6 py-4 text-sm text-mist">{t.paymentNote}</p>
    </div>
  );
}

export function BookingForm({ lang, t }: { lang: Locale; t: T }) {
  const uid = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<BookingInput>(empty);
  const [receipt, setReceipt] = useState<File | null>(null);
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
    const found = validateBooking(values, receipt && { name: receipt.name, type: receipt.type, size: receipt.size }, lang);
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
      body.append("receipt", receipt!);
      const res = await fetch("/api/booking", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error ?? t.checkForm);
      }
      setStatus("sent");
      setValues(empty);
      setReceipt(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : t.genericError);
    }
  }

  const kb = receipt ? Math.max(1, Math.round(receipt.size / 1024)) : 0;

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

                <Group n={3} title={t.steps[2]}>
                  <Choices
                    id={id("payment")}
                    label={t.q.payment}
                    value={values.payment}
                    error={errors.payment}
                    onChange={(v) => setValue("payment", v)}
                    columns={3}
                    options={PAYMENT_OPTIONS.map((o) => ({ value: o, label: paymentLabels[o] }))}
                  />

                  <div className="sm:col-span-2">
                    <p className="text-sm font-semibold text-midnight">
                      <label htmlFor={id("receipt")}>{t.q.receipt}</label> <span className="text-[#B42318]" aria-hidden>*</span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate">{t.q.receiptHint}</p>
                    <div
                      className={`mt-2 flex flex-col gap-3 rounded-xl border-2 border-dashed p-4 sm:flex-row sm:items-center ${
                        errors.receipt ? "border-[#B42318]/60 bg-[#B42318]/[0.03]" : receipt ? "border-ocean/50 bg-sky/5" : "border-line bg-cloud"
                      }`}
                    >
                      <input
                        ref={fileRef}
                        id={id("receipt")}
                        name="receipt"
                        type="file"
                        accept={RECEIPT_ACCEPT}
                        required
                        className="sr-only"
                        aria-invalid={errors.receipt ? true : undefined}
                        aria-describedby={errors.receipt ? `${id("receipt")}-error` : undefined}
                        onChange={(e) => {
                          setReceipt(e.target.files?.[0] ?? null);
                          clear("receipt");
                        }}
                      />
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ocean ring-1 ring-line">
                        <Icon name={receipt ? "check" : "doc"} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 text-sm">
                        {receipt ? (
                          <>
                            <span className="block truncate font-semibold text-midnight">{receipt.name}</span>
                            <span className="text-slate">{kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`}</span>
                          </>
                        ) : (
                          <span className="text-slate">{t.q.receiptHint}</span>
                        )}
                      </span>
                      <span className="flex gap-2">
                        <button type="button" onClick={() => fileRef.current?.click()} className={buttonClasses("midnight", "!px-4 !py-2.5 hover:!translate-y-0")}>
                          {receipt ? t.q.receiptChange : t.q.receiptChoose}
                        </button>
                        {receipt && (
                          <button
                            type="button"
                            onClick={() => {
                              setReceipt(null);
                              if (fileRef.current) fileRef.current.value = "";
                            }}
                            className={buttonClasses("outline-dark", "!px-4 !py-2.5 hover:!translate-y-0")}
                          >
                            {t.q.receiptRemove}
                          </button>
                        )}
                      </span>
                    </div>
                    <ErrorText id={id("receipt")} error={errors.receipt} />
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
        <PaymentCard t={t} selected={values.payment} />
      </Reveal>
    </div>
  );
}
