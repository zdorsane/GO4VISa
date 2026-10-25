/**
 * Results and messages shared by Go4Visa students (screenshots in
 * public/feedback/, WebP). Names, QR codes and visa details are hidden before
 * publishing — only add screenshots the students agreed to share.
 * Captions describe what each screenshot shows; they are not quotes.
 */
import type { Locale } from "./i18n";

export type FeedbackKind = "selected" | "shortlisted" | "visa";

type Source = {
  src: string;
  width: number;
  height: number;
  kind: FeedbackKind;
  caption: Record<Locale, string>;
};

const sources: Source[] = [
  {
    src: "/feedback/icyf-camp-accepted.webp",
    width: 773,
    height: 1280,
    kind: "selected",
    caption: {
      en: "Selected for the ICYF Young Climate Volunteers Camp in Istanbul",
      fr: "Sélectionné pour l'ICYF Young Climate Volunteers Camp à Istanbul",
      ar: "مقبول في مخيم ICYF للمتطوعين الشباب من أجل المناخ في إسطنبول",
    },
  },
  {
    src: "/feedback/germany-visa.webp",
    width: 1206,
    height: 1083,
    kind: "visa",
    caption: {
      en: "Schengen visa granted for Germany",
      fr: "Visa Schengen obtenu pour l'Allemagne",
      ar: "الحصول على تأشيرة شنغن إلى ألمانيا",
    },
  },
  {
    src: "/feedback/one-young-world-round-two.webp",
    width: 1133,
    height: 1280,
    kind: "shortlisted",
    caption: {
      en: "Through to round two of One Young World's NewNow Programme 2026",
      fr: "Qualifié pour le deuxième tour du NewNow Programme 2026 de One Young World",
      ar: "التأهل إلى الدور الثاني من برنامج NewNow 2026 لـ One Young World",
    },
  },
  {
    src: "/feedback/scim-accepted-thanks.webp",
    width: 746,
    height: 1280,
    kind: "selected",
    caption: {
      en: "Accepted to SCIM, with a thank-you for the sessions",
      fr: "Accepté au SCIM, avec un merci pour les séances",
      ar: "مقبول في SCIM، مع رسالة شكر على الجلسات",
    },
  },
  {
    src: "/feedback/mcw-fellowship-interview.webp",
    width: 1206,
    height: 1182,
    kind: "shortlisted",
    caption: {
      en: "Invited to the interview round of the 2026 MCW Fellowship",
      fr: "Invité à la phase d'entretien de la MCW Fellowship 2026",
      ar: "دعوة إلى مرحلة المقابلة في زمالة MCW لعام 2026",
    },
  },
  {
    src: "/feedback/germany-visa-medical-student.webp",
    width: 962,
    height: 1280,
    kind: "visa",
    caption: {
      en: "A medical student's Schengen visa for Germany",
      fr: "Le visa Schengen d'une étudiante en médecine pour l'Allemagne",
      ar: "تأشيرة شنغن لطالبة في الطب إلى ألمانيا",
    },
  },
  {
    src: "/feedback/upg-shortlisted.webp",
    width: 1206,
    height: 929,
    kind: "shortlisted",
    caption: {
      en: "Shortlisted for the UPG Sustainability Leadership Class of 2026",
      fr: "Présélectionné pour la UPG Sustainability Leadership Class 2026",
      ar: "ضمن القائمة المختصرة لدفعة UPG للقيادة المستدامة 2026",
    },
  },
];

export function getFeedback(lang: Locale) {
  return sources.map(({ caption, ...rest }) => ({ ...rest, caption: caption[lang] }));
}

export type FeedbackItem = ReturnType<typeof getFeedback>[number];
