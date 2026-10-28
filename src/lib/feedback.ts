/**
 * Results and messages shared by Go4Visa students (screenshots in
 * public/feedback/, WebP). Names, QR codes and visa details are hidden before
 * publishing — only add screenshots the students agreed to share.
 * Captions describe what each screenshot shows; they are not quotes.
 */
import type { Locale } from "./i18n";

type Source = {
  src: string;
  width: number;
  height: number;
  caption: Record<Locale, string>;
};

/** One unified collection, in display order (no categories). */
const sources: Source[] = [
  {
    src: "/feedback/usa-departure-passports.webp",
    width: 1200,
    height: 1498,
    caption: {
      en: "Two students with their passports at the airport, flying to the USA",
      fr: "Deux étudiantes avec leurs passeports à l'aéroport, en route vers les États-Unis",
      ar: "طالبتان بجوازَي سفرهما في المطار، في طريقهما إلى الولايات المتحدة",
    },
  },
  {
    src: "/feedback/icyf-camp-selected.webp",
    width: 1200,
    height: 1985,
    caption: {
      en: "Selected for the ICYF Young Climate Volunteers Camp, with a thank-you message",
      fr: "Sélectionnés pour l'ICYF Young Climate Volunteers Camp, avec un message de remerciement",
      ar: "قبول في مخيم ICYF للمتطوعين الشباب من أجل المناخ، مع رسالة شكر",
    },
  },
  {
    src: "/feedback/medical-student-germany-visa.webp",
    width: 1200,
    height: 1596,
    caption: {
      en: "A medical student shares her visa and a thank-you message",
      fr: "Une étudiante en médecine partage son visa et un message de remerciement",
      ar: "طالبة في الطب تشارك تأشيرتها ورسالة شكر",
    },
  },
  {
    src: "/feedback/one-young-world-shortlisted.webp",
    width: 1200,
    height: 1355,
    caption: {
      en: "Shortlisted for the second round of One Young World's NewNow Programme 2026",
      fr: "Présélectionné pour le deuxième tour du NewNow Programme 2026 de One Young World",
      ar: "التأهل إلى الدور الثاني من برنامج NewNow 2026 لـ One Young World",
    },
  },
  {
    src: "/feedback/usa-j1-visa.webp",
    width: 1200,
    height: 1368,
    caption: {
      en: "A US J-1 visa shared by a student",
      fr: "Un visa américain J-1 partagé par un étudiant",
      ar: "تأشيرة أمريكية J-1 شاركها أحد الطلبة",
    },
  },
  {
    src: "/feedback/scim-accepted-message.webp",
    width: 1021,
    height: 1751,
    caption: {
      en: "Accepted to SCIM, with a thank-you for the sessions",
      fr: "Accepté au SCIM, avec un merci pour les séances",
      ar: "قبول في SCIM، مع رسالة شكر على الجلسات",
    },
  },
  {
    src: "/feedback/germany-visa-brother.webp",
    width: 1200,
    height: 1078,
    caption: {
      en: "A student's visa for Germany",
      fr: "Le visa d'un étudiant pour l'Allemagne",
      ar: "تأشيرة أحد الطلبة إلى ألمانيا",
    },
  },
  {
    src: "/feedback/mcw-fellowship-interview-email.webp",
    width: 1200,
    height: 1176,
    caption: {
      en: "Through to the interview round of the 2026 MCW Fellowship",
      fr: "Qualifié pour la phase d'entretien de la MCW Fellowship 2026",
      ar: "التأهل إلى مرحلة المقابلة في زمالة MCW لعام 2026",
    },
  },
  {
    src: "/feedback/usa-departure-airport.webp",
    width: 1200,
    height: 1444,
    caption: {
      en: "Saying goodbye at the airport to a student leaving for the USA",
      fr: "Au revoir à l'aéroport à un étudiant qui part aux États-Unis",
      ar: "وداع في المطار لطالب مسافر إلى الولايات المتحدة",
    },
  },
  {
    src: "/feedback/germany-visa-message.webp",
    width: 1200,
    height: 1314,
    caption: {
      en: "A student's message announcing their German visa",
      fr: "Le message d'un étudiant annonçant son visa allemand",
      ar: "رسالة طالب يعلن حصوله على التأشيرة الألمانية",
    },
  },
  {
    src: "/feedback/upg-shortlisted-email.webp",
    width: 1200,
    height: 924,
    caption: {
      en: "Shortlisted for the UPG Sustainability Leadership Class of 2026",
      fr: "Présélectionné pour la UPG Sustainability Leadership Class 2026",
      ar: "ضمن القائمة المختصرة لدفعة UPG للقيادة المستدامة 2026",
    },
  },
  {
    src: "/feedback/germany-visa-friend.webp",
    width: 1200,
    height: 1210,
    caption: {
      en: "Another student's visa for Germany",
      fr: "Le visa d'un autre étudiant pour l'Allemagne",
      ar: "تأشيرة طالب آخر إلى ألمانيا",
    },
  },
];

/**
 * Visa stickers shared by students (the visa wall under the diagram). Photos,
 * dates, QR codes, birth dates and consular officers' names are hidden, and the
 * wall shows no countries or places.
 */
export type VisaItem = { src: string; width: number; height: number };

const visas: VisaItem[] = [
  { src: "/feedback/usa-visa.webp", width: 1206, height: 810 },
  { src: "/feedback/netherlands-visa.webp", width: 1103, height: 807 },
  { src: "/feedback/norway-visa.webp", width: 941, height: 682 },
  { src: "/feedback/germany-visa-tu-ilmenau.webp", width: 889, height: 611 },
  { src: "/feedback/germany-visa-2024.webp", width: 909, height: 647 },
  { src: "/feedback/germany-visa-2025.webp", width: 950, height: 665 },
  { src: "/feedback/germany-visa-2026.webp", width: 1280, height: 849 },
];

export function getVisas() {
  return visas;
}

export function getFeedback(lang: Locale) {
  return sources.map(({ caption, ...rest }) => ({ ...rest, caption: caption[lang] }));
}

export type FeedbackItem = ReturnType<typeof getFeedback>[number];
