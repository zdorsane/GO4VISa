/** Contact form schema — shared by the client form and the /api/contact route. */
import { defaultLocale, hasLocale, type Locale } from "./i18n";

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  service: string;
  message: string;
  company?: string; // honeypot — must stay empty
  lang?: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

/** Service ids sent to the server (same in every language; labels live in lib/content.ts). */
export const SERVICE_OPTIONS = [
  "essays",
  "cv",
  "motivation-letter",
  "recommendation-letter",
  "interview",
  "application-documents",
  "visa",
] as const;

export function isServiceOption(value: unknown): value is (typeof SERVICE_OPTIONS)[number] {
  return typeof value === "string" && (SERVICE_OPTIONS as readonly string[]).includes(value);
}

const messages = {
  en: {
    nameMissing: "Please enter your full name.",
    nameLong: "Name is too long.",
    emailMissing: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    phoneInvalid: "Please enter a valid phone number.",
    messageShort: "Please tell us a little more (at least 10 characters).",
    messageLong: "Message is too long (2000 characters max).",
    invalidRequest: "Invalid request.",
    serverFail: "We couldn't send your message right now. Please email us instead.",
  },
  fr: {
    nameMissing: "Veuillez indiquer votre nom complet.",
    nameLong: "Le nom est trop long.",
    emailMissing: "Veuillez indiquer votre adresse e-mail.",
    emailInvalid: "Veuillez indiquer une adresse e-mail valide.",
    phoneInvalid: "Veuillez indiquer un numéro de téléphone valide.",
    messageShort: "Merci de nous en dire un peu plus (10 caractères minimum).",
    messageLong: "Message trop long (2000 caractères maximum).",
    invalidRequest: "Requête invalide.",
    serverFail: "Impossible d'envoyer votre message pour le moment. Écrivez-nous plutôt par e-mail.",
  },
  ar: {
    nameMissing: "يرجى إدخال اسمك الكامل.",
    nameLong: "الاسم طويل جدًا.",
    emailMissing: "يرجى إدخال بريدك الإلكتروني.",
    emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
    phoneInvalid: "يرجى إدخال رقم هاتف صحيح.",
    messageShort: "يرجى إخبارنا بالمزيد (10 أحرف على الأقل).",
    messageLong: "الرسالة طويلة جدًا (2000 حرف كحد أقصى).",
    invalidRequest: "طلب غير صالح.",
    serverFail: "تعذّر إرسال رسالتك حاليًا. يرجى مراسلتنا عبر البريد الإلكتروني.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function contactMessages(lang: string | undefined) {
  return messages[lang && hasLocale(lang) ? lang : defaultLocale];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;

export function validateContact(input: Partial<ContactInput>, lang?: string): ContactErrors {
  const t = contactMessages(lang);
  const errors: ContactErrors = {};
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (name.length < 2) errors.name = t.nameMissing;
  else if (name.length > 100) errors.name = t.nameLong;

  if (!email) errors.email = t.emailMissing;
  else if (!EMAIL_RE.test(email) || email.length > 200) errors.email = t.emailInvalid;

  if (phone && !PHONE_RE.test(phone)) errors.phone = t.phoneInvalid;

  if (message.length < 10) errors.message = t.messageShort;
  else if (message.length > 2000) errors.message = t.messageLong;

  return errors;
}

export function sanitizeContact(input: Partial<ContactInput>): ContactInput {
  const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  return {
    name: clip(input.name, 100),
    email: clip(input.email, 200),
    phone: clip(input.phone, 20),
    destination: clip(input.destination, 60),
    service: isServiceOption(input.service) ? input.service : "",
    message: clip(input.message, 2000),
    lang: clip(input.lang, 5),
  };
}
