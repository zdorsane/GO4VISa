"use client";

import { Suspense, useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { site, whatsappHref, type Dict } from "@/lib/content";
import type { Destination } from "@/lib/destinations";
import type { Locale } from "@/lib/i18n";
import { isServiceOption, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact";
import { GlobeHorizon } from "./brand/GlobeHorizon";
import { LogoSymbol } from "./brand/Logo";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";
import { buttonClasses } from "./ui/Button";

const empty: ContactInput = { name: "", email: "", phone: "", destination: "", service: "", message: "", company: "" };

/** Pre-selects the service when arriving from a "Request a quote" button (?service=cv). */
function ServicePrefill({ onService }: { onService: (s: string) => void }) {
  const params = useSearchParams();
  const service = params.get("service");
  useEffect(() => {
    if (isServiceOption(service)) onService(service);
  }, [service, onService]);
  return null;
}

const channelIcon =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold ring-1 ring-white/15 transition-colors group-hover:bg-gold group-hover:text-midnight";

const inputBase =
  "mt-2 block w-full rounded-xl border bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/40 transition-colors focus:border-gold focus:bg-white/10 focus:outline-none";

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label} {optional && <span className="font-normal text-mist">{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-gold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact({
  lang,
  t: contact,
  services,
  destinations,
}: {
  lang: Locale;
  t: Dict["contact"];
  services: Dict["services"]["items"];
  destinations: Destination[];
}) {
  const f = contact.form;
  const uid = useId();
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const prefillService = useCallback((s: string) => setValues((v) => ({ ...v, service: s })), []);
  const whatsapp = whatsappHref();

  const set = (k: keyof ContactInput) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const id = (k: string) => `${uid}-${k}`;
  const aria = (k: keyof ContactInput) => ({
    id: id(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id(k)}-error` : undefined,
  });
  const border = (k: keyof ContactInput) => (errors[k] ? "border-gold" : "border-white/15");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateContact(values, lang);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(id(first))?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, lang }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error ?? f.checkForm);
      }
      setStatus("sent");
      setValues(empty);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : f.genericError);
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-midnight pb-56 pt-24 md:pb-64 md:pt-32"
    >
      <Suspense fallback={null}>
        <ServicePrefill onService={prefillService} />
      </Suspense>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_20%_20%,rgba(3,179,226,0.22),transparent_70%)]" />
      <GlobeHorizon className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 w-full md:h-64" />

      <div className="container-brand grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="label-caps text-gold">{contact.eyebrow}</p>
          <h2 id="contact-title" className="mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">
            {contact.title}
          </h2>
          <p className="mt-5 text-lg text-mist">{contact.lead}</p>

          <ul className="mt-10 space-y-4">
            <li>
              <a href={`mailto:${site.email}`} className="group inline-flex min-w-0 max-w-full items-center gap-4 text-white">
                <span className={channelIcon}>
                  <Icon name="mail" className="h-5 w-5" />
                </span>
                <span className="break-all underline-offset-4 group-hover:underline">{site.email}</span>
              </a>
            </li>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-4 text-white">
                  <span className={channelIcon}>
                    <Icon name="chat" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wider text-mist">{contact.whatsapp}</span>
                    <span dir="ltr" className="underline-offset-4 group-hover:underline">{site.whatsappDisplay}</span>
                  </span>
                </a>
              </li>
            )}
            {/* Shown once site.phone and site.phoneHref are set in lib/content.ts */}
            {site.phoneHref && (
              <li>
                <a href={site.phoneHref} className="group inline-flex items-center gap-4 text-white">
                  <span className={channelIcon}>
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <span dir="ltr" className="underline-offset-4 group-hover:underline">{site.phone}</span>
                </a>
              </li>
            )}
            <li>
              <a href={site.url} className="group inline-flex items-center gap-4 text-white">
                <span className={channelIcon}>
                  <Icon name="web" className="h-5 w-5" />
                </span>
                <span className="underline-offset-4 group-hover:underline">www.go4visa.com</span>
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-brand-lg bg-white/[0.04] p-6 ring-1 ring-white/15 backdrop-blur-sm md:p-10">
            {/* A word from Go4Visa, above the form */}
            <figure className="relative mb-8 overflow-hidden rounded-brand bg-linear-to-br from-white/[0.09] to-white/[0.02] p-5 ring-1 ring-gold/30 md:p-6">
              <span aria-hidden className="absolute inset-y-0 start-0 w-1 bg-linear-to-b from-gold to-amber" />
              <Icon name="quote" className="absolute end-4 top-4 h-10 w-10 text-gold/15" />
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1.5 ring-2 ring-gold">
                  <LogoSymbol className="h-full w-auto" />
                </span>
                <p className="label-caps !text-[0.68rem] text-gold">{contact.welcome.title}</p>
              </div>
              <blockquote className="mt-4 text-lg font-medium leading-relaxed text-white md:text-xl">
                {contact.welcome.message}
              </blockquote>
              <figcaption className="mt-3 text-sm text-mist">— {contact.welcome.signature}</figcaption>
            </figure>
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-midnight">
                    <Icon name="plane" className="h-8 w-8" />
                  </span>
                  <p className="mt-6 text-2xl font-semibold text-white">{f.sentTitle}</p>
                  <p className="mt-2 text-mist">{f.sentText}</p>
                  <button type="button" onClick={() => setStatus("idle")} className={buttonClasses("outline-light", "mt-8")}>
                    {f.sendAnother}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" noValidate onSubmit={onSubmit} initial={false} exit={{ opacity: 0 }} className="grid gap-5 sm:grid-cols-2">
                  <Field id={id("name")} label={f.name} error={errors.name}>
                    <input {...aria("name")} name="name" autoComplete="name" required value={values.name} onChange={set("name")} className={`${inputBase} ${border("name")}`} />
                  </Field>
                  <Field id={id("email")} label={f.email} error={errors.email}>
                    <input {...aria("email")} name="email" type="email" autoComplete="email" required value={values.email} onChange={set("email")} className={`${inputBase} ${border("email")}`} dir="ltr" />
                  </Field>
                  <Field id={id("phone")} label={f.phone} error={errors.phone} optional={f.optional}>
                    <input {...aria("phone")} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} className={`${inputBase} ${border("phone")}`} placeholder="+213" dir="ltr" />
                  </Field>
                  <Field id={id("destination")} label={f.destination} optional={f.optional}>
                    <select {...aria("destination")} name="destination" value={values.destination} onChange={set("destination")} className={`${inputBase} ${border("destination")} [&>option]:text-midnight`}>
                      <option value="">{f.notSure}</option>
                      {destinations.map((d) => (
                        <option key={d.slug} value={d.country}>
                          {d.country}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id={id("service")} label={f.service} optional={f.optional}>
                      <select {...aria("service")} name="service" value={values.service} onChange={set("service")} className={`${inputBase} ${border("service")} [&>option]:text-midnight`}>
                        <option value="">{f.chooseService}</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field id={id("message")} label={f.message} error={errors.message}>
                      <textarea {...aria("message")} name="message" rows={5} required value={values.message} onChange={set("message")} className={`${inputBase} ${border("message")} resize-y`} />
                    </Field>
                  </div>
                  {/* honeypot */}
                  <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor={id("company")}>Company</label>
                    <input id={id("company")} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
                  </div>

                  <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-mist" aria-live="polite">
                      {status === "error" ? <span className="text-gold">{serverError}</span> : status === "sending" ? f.sending : ""}
                    </p>
                    <button type="submit" disabled={status === "sending"} className={buttonClasses("gold", "disabled:cursor-wait disabled:opacity-70")}>
                      {status === "sending" ? f.sending : f.send}
                      <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
