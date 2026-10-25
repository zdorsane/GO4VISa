/**
 * Photos from Go4Visa students' international experiences, shown in the
 * "Experiences" gallery. Files live in public/experiences/ (WebP, max 1600px,
 * metadata stripped). Publish only photos the people shown have agreed to share.
 */
import type { Locale } from "./i18n";

export type GalleryTag = "travel" | "learning" | "community" | "milestones";

type Photo = {
  src: string;
  width: number;
  height: number;
  tag: GalleryTag;
  alt: Record<Locale, string>;
};

export const photos: Photo[] = [
  {
    src: "/experiences/celebration.webp",
    width: 1600,
    height: 878,
    tag: "community",
    alt: {
      en: "Participants celebrating together at the end of an international youth programme",
      fr: "Des participants célèbrent ensemble la fin d'un programme international pour les jeunes",
      ar: "مشاركون يحتفلون معًا في ختام برنامج دولي للشباب",
    },
  },
  {
    src: "/experiences/airport-usa.webp",
    width: 1206,
    height: 1140,
    tag: "milestones",
    alt: {
      en: "Two students at the airport, passports and boarding passes in hand, ready to fly to the USA",
      fr: "Deux étudiantes à l'aéroport, passeport et carte d'embarquement en main, prêtes à s'envoler pour les États-Unis",
      ar: "طالبتان في المطار، جواز السفر وبطاقة الصعود في اليد، مستعدتان للسفر إلى الولايات المتحدة",
    },
  },
  {
    src: "/experiences/certificates.webp",
    width: 1179,
    height: 793,
    tag: "milestones",
    alt: {
      en: "Students proudly holding their participation certificates",
      fr: "Des étudiants fiers de présenter leurs certificats de participation",
      ar: "طلاب يحملون شهادات مشاركتهم بفخر",
    },
  },
  {
    src: "/experiences/sunset.webp",
    width: 1600,
    height: 1200,
    tag: "travel",
    alt: { en: "A group selfie by the sea at sunset", fr: "Un selfie de groupe au bord de la mer au coucher du soleil", ar: "صورة سيلفي جماعية على شاطئ البحر عند غروب الشمس" },
  },
  {
    src: "/experiences/eu-flag.webp",
    width: 1206,
    height: 1475,
    tag: "community",
    alt: { en: "A participant waving the European Union flag", fr: "Un participant brandit le drapeau de l'Union européenne", ar: "مشارك يرفع علم الاتحاد الأوروبي" },
  },
  {
    src: "/experiences/celebration-close.webp",
    width: 1080,
    height: 1237,
    tag: "community",
    alt: {
      en: "Participants cheering with their arms raised at an international youth meeting",
      fr: "Des participants lèvent les bras de joie lors d'une rencontre internationale de jeunes",
      ar: "مشاركون يرفعون أيديهم فرحًا خلال لقاء دولي للشباب",
    },
  },
  {
    src: "/experiences/norway-snow.webp",
    width: 1157,
    height: 1453,
    tag: "travel",
    alt: { en: "A student celebrating in the snow in Trondheim, Norway", fr: "Un étudiant savoure la neige à Trondheim, en Norvège", ar: "طالب يحتفل وسط الثلج في تروندهايم بالنرويج" },
  },
  {
    src: "/experiences/cafe.webp",
    width: 1600,
    height: 1200,
    tag: "community",
    alt: { en: "New friends sharing coffee on a terrace", fr: "De nouveaux amis partagent un café en terrasse", ar: "أصدقاء جدد يتشاركون القهوة في مقهى" },
  },
  {
    src: "/experiences/museum.webp",
    width: 1600,
    height: 1127,
    tag: "travel",
    alt: { en: "Participants visiting a museum together", fr: "Des participants visitent un musée ensemble", ar: "مشاركون يزورون متحفًا معًا" },
  },
  {
    src: "/experiences/fjord.webp",
    width: 1201,
    height: 889,
    tag: "travel",
    alt: {
      en: "Friends posing by the water on a sunny winter day",
      fr: "Des amis posent au bord de l'eau par une journée d'hiver ensoleillée",
      ar: "أصدقاء يلتقطون صورة بجانب الماء في يوم شتوي مشمس",
    },
  },
  {
    src: "/experiences/workshop.webp",
    width: 1600,
    height: 1067,
    tag: "learning",
    alt: { en: "Students focused during a workshop session", fr: "Des étudiants concentrés pendant un atelier", ar: "طلاب منهمكون خلال ورشة عمل" },
  },
  {
    src: "/experiences/winter-group.webp",
    width: 1160,
    height: 865,
    tag: "community",
    alt: { en: "A large group of participants by the sea in winter", fr: "Un grand groupe de participants au bord de la mer en hiver", ar: "مجموعة كبيرة من المشاركين على شاطئ البحر في الشتاء" },
  },
  {
    src: "/experiences/group.webp",
    width: 1068,
    height: 965,
    tag: "community",
    alt: {
      en: "Participants of an international youth meeting gathered for a group photo",
      fr: "Les participants d'une rencontre internationale de jeunes réunis pour une photo de groupe",
      ar: "المشاركون في لقاء دولي للشباب مجتمعون لالتقاط صورة جماعية",
    },
  },
  {
    src: "/experiences/teamwork.webp",
    width: 1170,
    height: 1193,
    tag: "learning",
    alt: { en: "Two participants working together on an activity", fr: "Deux participants travaillent ensemble sur une activité", ar: "مشاركان يعملان معًا على نشاط" },
  },
  {
    src: "/experiences/lake.webp",
    width: 1177,
    height: 1434,
    tag: "travel",
    alt: { en: "A participant enjoying a sunny day on the lake", fr: "Un participant profite d'une journée ensoleillée sur le lac", ar: "مشارك يستمتع بيوم مشمس على البحيرة" },
  },
  {
    src: "/experiences/stage.webp",
    width: 1135,
    height: 1600,
    tag: "learning",
    alt: {
      en: "Participants presenting on stage during a programme activity",
      fr: "Des participants présentent sur scène lors d'une activité du programme",
      ar: "مشاركون يقدّمون عرضًا على المسرح خلال أحد أنشطة البرنامج",
    },
  },
  {
    src: "/experiences/friends.webp",
    width: 1206,
    height: 1444,
    tag: "community",
    alt: { en: "Three friends taking a selfie together", fr: "Trois amis prennent un selfie ensemble", ar: "ثلاثة أصدقاء يلتقطون صورة سيلفي معًا" },
  },
  {
    src: "/experiences/terrace.webp",
    width: 1200,
    height: 1600,
    tag: "travel",
    alt: { en: "Two participants on a terrace overlooking the sea", fr: "Deux participants sur une terrasse face à la mer", ar: "مشاركان على شرفة مطلة على البحر" },
  },
];

export function getPhotos(lang: Locale) {
  return photos.map(({ alt, ...p }) => ({ ...p, alt: alt[lang] }));
}

export type GalleryPhoto = ReturnType<typeof getPhotos>[number];
