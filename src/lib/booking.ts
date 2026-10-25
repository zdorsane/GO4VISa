/**
 * Consultation booking form (/[lang]/apply) — shared by the client form and the
 * /api/booking route. Every question is required, like the Google Form it
 * replaces; answers end up in one Google Sheet (see google-apps-script/).
 */
import { defaultLocale, hasLocale, type Locale } from "./i18n";

/** Payment details shown above the form (language-independent). */
export const payment = {
  priceUsd: "$5.50",
  priceDzd: "1400 DA",
  baridimob: { rip: "00799999002472755343" },
  ccp: { holder: "SEDIRA MAHDI", account: "0024727553", key: "43" },
  binance: { id: "987012488" },
};

/** Option ids sent to the server and stored in the sheet (labels live in lib/content.ts). */
export const HELP_OPTIONS = ["requirements", "application", "essays", "finding", "interview", "documents", "other"] as const;
export const PAYMENT_OPTIONS = ["baridimob", "ccp", "binance"] as const;

export const RECEIPT_MAX_BYTES = 4 * 1024 * 1024; // keeps the request under hosting limits (Netlify/Vercel)
export const RECEIPT_ACCEPT = "image/*,application/pdf";

export function isReceiptType(type: string) {
  return type.startsWith("image/") || type === "application/pdf";
}

export type BookingInput = {
  name: string;
  email: string;
  whatsapp: string;
  opportunity: string;
  reason: string;
  help: string;
  helpOther: string;
  question: string;
  payment: string;
  company?: string; // honeypot — must stay empty
  lang?: string;
};

/** Receipt metadata — the File itself travels in the multipart body. */
export type ReceiptInfo = { name: string; type: string; size: number } | null;

export type BookingErrors = Partial<Record<keyof BookingInput | "receipt", string>>;

const messages = {
  en: {
    required: "This question is required.",
    nameMissing: "Please enter your full name.",
    emailInvalid: "Please enter a valid email address.",
    whatsappInvalid: "Please enter a valid WhatsApp number with its country code (e.g. +213…).",
    tooLong: "This answer is too long.",
    chooseOne: "Please choose an option.",
    otherMissing: "Please tell us what you need help with.",
    receiptMissing: "Please upload your payment receipt or screenshot.",
    receiptType: "Please upload an image or a PDF file.",
    receiptSize: "The file is too large (4 MB max). Try a screenshot instead.",
    invalidRequest: "Invalid request.",
    serverFail: "We couldn't send your booking right now. Please try again in a moment or contact us on WhatsApp.",
  },
  fr: {
    required: "Cette question est obligatoire.",
    nameMissing: "Veuillez indiquer votre nom complet.",
    emailInvalid: "Veuillez indiquer une adresse e-mail valide.",
    whatsappInvalid: "Veuillez indiquer un numéro WhatsApp valide avec l'indicatif du pays (ex. +213…).",
    tooLong: "Cette réponse est trop longue.",
    chooseOne: "Veuillez choisir une option.",
    otherMissing: "Précisez avec quoi vous avez besoin d'aide.",
    receiptMissing: "Veuillez joindre votre reçu de paiement ou une capture d'écran.",
    receiptType: "Veuillez joindre une image ou un fichier PDF.",
    receiptSize: "Le fichier est trop volumineux (4 Mo maximum). Essayez plutôt une capture d'écran.",
    invalidRequest: "Requête invalide.",
    serverFail: "Impossible d'envoyer votre réservation pour le moment. Réessayez dans un instant ou contactez-nous sur WhatsApp.",
  },
  ar: {
    required: "هذا السؤال إجباري.",
    nameMissing: "يرجى إدخال اسمك الكامل.",
    emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
    whatsappInvalid: "يرجى إدخال رقم واتساب صحيح مع رمز البلد (مثال: ‎+213…).",
    tooLong: "هذه الإجابة طويلة جدًا.",
    chooseOne: "يرجى اختيار أحد الخيارات.",
    otherMissing: "يرجى توضيح ما تحتاج إلى المساعدة فيه.",
    receiptMissing: "يرجى إرفاق وصل الدفع أو لقطة شاشة.",
    receiptType: "يرجى إرفاق صورة أو ملف PDF.",
    receiptSize: "الملف كبير جدًا (4 ميغابايت كحد أقصى). جرّب لقطة شاشة بدلًا منه.",
    invalidRequest: "طلب غير صالح.",
    serverFail: "تعذّر إرسال حجزك حاليًا. يرجى المحاولة بعد لحظات أو التواصل معنا عبر واتساب.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function bookingMessages(lang: string | undefined) {
  return messages[lang && hasLocale(lang) ? lang : defaultLocale];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_RE = /^\+?[\d\s().-]{8,20}$/;

const oneOf = (list: readonly string[], v: unknown): v is string => typeof v === "string" && list.includes(v);

export function validateBooking(input: Partial<BookingInput>, receipt: ReceiptInfo, lang?: string): BookingErrors {
  const t = bookingMessages(lang);
  const errors: BookingErrors = {};
  const v = (k: keyof BookingInput) => (typeof input[k] === "string" ? (input[k] as string).trim() : "");

  const name = v("name");
  if (name.length < 2) errors.name = t.nameMissing;
  else if (name.length > 100) errors.name = t.tooLong;

  const email = v("email");
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = t.emailInvalid;

  const whatsapp = v("whatsapp");
  if (!WHATSAPP_RE.test(whatsapp) || whatsapp.replace(/\D/g, "").length < 8) errors.whatsapp = t.whatsappInvalid;

  for (const [k, max] of [["opportunity", 200], ["reason", 2000], ["question", 2000]] as const) {
    if (!v(k)) errors[k] = t.required;
    else if (v(k).length > max) errors[k] = t.tooLong;
  }

  if (!oneOf(HELP_OPTIONS, input.help)) errors.help = t.chooseOne;
  else if (input.help === "other" && !v("helpOther")) errors.helpOther = t.otherMissing;
  else if (v("helpOther").length > 200) errors.helpOther = t.tooLong;

  if (!oneOf(PAYMENT_OPTIONS, input.payment)) errors.payment = t.chooseOne;

  if (!receipt || receipt.size === 0) errors.receipt = t.receiptMissing;
  else if (!isReceiptType(receipt.type)) errors.receipt = t.receiptType;
  else if (receipt.size > RECEIPT_MAX_BYTES) errors.receipt = t.receiptSize;

  return errors;
}

export function sanitizeBooking(input: Partial<BookingInput>): BookingInput {
  const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  const help = oneOf(HELP_OPTIONS, input.help) ? input.help : "";
  return {
    name: clip(input.name, 100),
    email: clip(input.email, 200),
    whatsapp: clip(input.whatsapp, 20),
    opportunity: clip(input.opportunity, 200),
    reason: clip(input.reason, 2000),
    help,
    helpOther: help === "other" ? clip(input.helpOther, 200) : "",
    question: clip(input.question, 2000),
    payment: oneOf(PAYMENT_OPTIONS, input.payment) ? input.payment : "",
    lang: clip(input.lang, 5),
  };
}

/** Readable English labels for the sheet, so the client never sees raw ids. */
export const sheetLabels = {
  help: {
    requirements: "Understanding the opportunity and requirements",
    application: "Application & visa process",
    essays: "Motivation letter or essays",
    finding: "Finding suitable opportunities",
    interview: "Interview preparation",
    documents: "Application documents and more",
    other: "Others",
  },
  payment: { baridimob: "BaridiMob", ccp: "Algeria Post (CCP)", binance: "Binance (USDT)" },
} satisfies Record<string, Record<string, string>>;
