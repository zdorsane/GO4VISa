/**
 * Flagship scholarship per destination — sourced from the Go4Visa brand book
 * ("Scholarships Worldwide"), in English, French and Arabic. Calls change every year:
 * always confirm on the official site before publishing new dates.
 */
import type { Locale } from "./i18n";

type LocalizedText = {
  country: string;
  programme: string;
  fundedBy: string;
  levels: string;
  covers: string;
  howToApply: string;
  when: string;
};

type DestinationSource = {
  slug: string;
  code: string; // display code used in the brand book (UK, not GB)
  flag: string; // ISO 3166-1 alpha-2, file in /public/flags
  officialSite: { label: string; url: string }[];
} & Record<Locale, LocalizedText>;

export type Destination = Omit<DestinationSource, Locale> & LocalizedText;

const sources: DestinationSource[] = [
  {
    slug: "italy",
    code: "IT",
    flag: "it",
    officialSite: [
      { label: "esteri.it", url: "https://www.esteri.it" },
      { label: "studyinitaly.esteri.it", url: "https://studyinitaly.esteri.it" },
    ],
    en: {
      country: "Italy",
      programme: "Invest Your Talent in Italy",
      fundedBy: "Italian Ministry of Foreign Affairs (MAECI)",
      levels:
        "Master's and postgraduate courses taught in English: engineering, architecture & design, economics & management",
      covers: "Nine-month scholarship plus an internship at an Italian company",
      howToApply: "Apply online via the MAECI portal",
      when: "The 2026–27 call closed on 11 May. Regional DSU grants (income-based) are a second route.",
    },
    fr: {
      country: "Italie",
      programme: "Invest Your Talent in Italy",
      fundedBy: "Ministère italien des Affaires étrangères (MAECI)",
      levels:
        "Masters et formations post-universitaires enseignés en anglais : ingénierie, architecture et design, économie et management",
      covers: "Bourse de neuf mois et stage dans une entreprise italienne",
      howToApply: "Candidature en ligne sur le portail du MAECI",
      when: "L'appel 2026–27 a fermé le 11 mai. Les bourses régionales DSU (selon les revenus) sont une deuxième option.",
    },
    ar: {
      country: "إيطاليا",
      programme: "Invest Your Talent in Italy",
      fundedBy: "وزارة الخارجية الإيطالية (MAECI)",
      levels: "ماستر وتكوينات ما بعد التدرج باللغة الإنجليزية: الهندسة، العمارة والتصميم، الاقتصاد والتسيير",
      covers: "منحة لمدة تسعة أشهر مع تربص في شركة إيطالية",
      howToApply: "التسجيل عبر الإنترنت على منصة MAECI",
      when: "أُغلق نداء 2026–27 في 11 ماي. منح DSU الجهوية (حسب الدخل) خيار ثانٍ.",
    },
  },
  {
    slug: "hungary",
    code: "HU",
    flag: "hu",
    officialSite: [{ label: "stipendiumhungaricum.hu", url: "https://stipendiumhungaricum.hu" }],
    en: {
      country: "Hungary",
      programme: "Stipendium Hungaricum",
      fundedBy: "Government of Hungary (Tempus Public Foundation)",
      levels: "Bachelor's, master's, one-tier master's and PhD",
      covers: "Tuition-free study, monthly stipend, accommodation support and medical insurance",
      howToApply:
        "Algerian students apply through the Ministry of Higher Education and the online SH platform",
      when: "For 2026–27 the online deadline was 15 January 2026: expect a similar window each winter",
    },
    fr: {
      country: "Hongrie",
      programme: "Stipendium Hungaricum",
      fundedBy: "Gouvernement hongrois (Tempus Public Foundation)",
      levels: "Licence, master, master intégré et doctorat",
      covers: "Études sans frais de scolarité, allocation mensuelle, aide au logement et assurance maladie",
      howToApply:
        "Les étudiants algériens postulent via le ministère de l'Enseignement supérieur et la plateforme en ligne SH",
      when: "Pour 2026–27, la date limite en ligne était le 15 janvier 2026 : prévoir une période similaire chaque hiver",
    },
    ar: {
      country: "المجر",
      programme: "Stipendium Hungaricum",
      fundedBy: "الحكومة المجرية (Tempus Public Foundation)",
      levels: "ليسانس، ماستر، ماستر متكامل ودكتوراه",
      covers: "دراسة دون رسوم، منحة شهرية، دعم للسكن وتأمين صحي",
      howToApply: "يترشح الطلبة الجزائريون عبر وزارة التعليم العالي ومنصة SH الإلكترونية",
      when: "بالنسبة لـ 2026–27 كان آخر أجل للتسجيل الإلكتروني 15 جانفي 2026: توقّع فترة مماثلة كل شتاء",
    },
  },
  {
    slug: "turkiye",
    code: "TR",
    flag: "tr",
    officialSite: [{ label: "turkiyeburslari.gov.tr", url: "https://www.turkiyeburslari.gov.tr" }],
    en: {
      country: "Türkiye",
      programme: "Türkiye Bursları",
      fundedBy: "Presidency for Turks Abroad and Related Communities (YTB)",
      levels: "Associate, bachelor's, master's, PhD and research programmes",
      covers:
        "Tuition, monthly stipend, accommodation, health insurance, a Turkish language course and a one-time flight ticket",
      howToApply: "Free online application on the official portal",
      when: "Usually opens early in the calendar year: check the official calendar",
    },
    fr: {
      country: "Türkiye",
      programme: "Türkiye Bursları",
      fundedBy: "Présidence des Turcs à l'étranger et des communautés apparentées (YTB)",
      levels: "Diplôme associé, licence, master, doctorat et programmes de recherche",
      covers:
        "Frais de scolarité, allocation mensuelle, logement, assurance maladie, cours de turc et un billet d'avion",
      howToApply: "Candidature gratuite en ligne sur le portail officiel",
      when: "Ouvre généralement en début d'année civile : consultez le calendrier officiel",
    },
    ar: {
      country: "تركيا",
      programme: "Türkiye Bursları",
      fundedBy: "رئاسة أتراك المهجر والمجتمعات ذات القربى (YTB)",
      levels: "دبلوم مشارك، ليسانس، ماستر، دكتوراه وبرامج بحثية",
      covers: "رسوم الدراسة، منحة شهرية، السكن، تأمين صحي، دورة في اللغة التركية وتذكرة طيران واحدة",
      howToApply: "ترشح مجاني عبر الإنترنت على البوابة الرسمية",
      when: "يُفتح عادة في بداية السنة الميلادية: راجع الرزنامة الرسمية",
    },
  },
  {
    slug: "united-kingdom",
    code: "UK",
    flag: "gb",
    officialSite: [{ label: "chevening.org", url: "https://www.chevening.org" }],
    en: {
      country: "United Kingdom",
      programme: "Chevening Scholarships",
      fundedBy: "UK Foreign, Commonwealth & Development Office (FCDO)",
      levels: "One-year master's degrees in the UK",
      covers: "Fully funded: tuition, living allowance and travel",
      howToApply: "Apply online; Algeria is a participating country",
      when: "2027–28 cycle: opened August 2026, closes October 2026, results from mid-June 2027",
    },
    fr: {
      country: "Royaume-Uni",
      programme: "Chevening Scholarships",
      fundedBy: "Ministère britannique des Affaires étrangères, du Commonwealth et du Développement (FCDO)",
      levels: "Masters d'un an au Royaume-Uni",
      covers: "Entièrement financée : frais de scolarité, allocation de subsistance et voyage",
      howToApply: "Candidature en ligne ; l'Algérie fait partie des pays participants",
      when: "Cycle 2027–28 : ouvert en août 2026, clôture en octobre 2026, résultats à partir de mi-juin 2027",
    },
    ar: {
      country: "المملكة المتحدة",
      programme: "Chevening Scholarships",
      fundedBy: "وزارة الخارجية والكومنولث والتنمية البريطانية (FCDO)",
      levels: "ماستر لمدة سنة واحدة في المملكة المتحدة",
      covers: "ممولة بالكامل: رسوم الدراسة، منحة معيشة والسفر",
      howToApply: "الترشح عبر الإنترنت؛ الجزائر من الدول المشاركة",
      when: "دورة 2027–28: فُتحت في أوت 2026، تُغلق في أكتوبر 2026، والنتائج ابتداءً من منتصف جوان 2027",
    },
  },
  {
    slug: "united-states",
    code: "US",
    flag: "us",
    officialSite: [{ label: "foreign.fulbrightonline.org", url: "https://foreign.fulbrightonline.org" }],
    en: {
      country: "United States",
      programme: "Fulbright Foreign Student Program",
      fundedBy: "U.S. Department of State, administered by IIE",
      levels: "Graduate study and research for students, young professionals and artists",
      covers: "Funding for study and research in the U.S.; details set by each country's programme",
      howToApply: "Apply through the U.S. Embassy in Algiers",
      when: "Announced yearly through Algerian universities and the Embassy",
    },
    fr: {
      country: "États-Unis",
      programme: "Fulbright Foreign Student Program",
      fundedBy: "Département d'État américain, programme géré par l'IIE",
      levels: "Études supérieures et recherche pour étudiants, jeunes professionnels et artistes",
      covers: "Financement des études et de la recherche aux États-Unis ; modalités fixées par le programme de chaque pays",
      howToApply: "Candidature via l'ambassade des États-Unis à Alger",
      when: "Annoncé chaque année via les universités algériennes et l'ambassade",
    },
    ar: {
      country: "الولايات المتحدة",
      programme: "Fulbright Foreign Student Program",
      fundedBy: "وزارة الخارجية الأمريكية، ويديره معهد IIE",
      levels: "دراسات عليا وبحث للطلبة والمهنيين الشباب والفنانين",
      covers: "تمويل للدراسة والبحث في الولايات المتحدة؛ تحدد التفاصيل حسب برنامج كل بلد",
      howToApply: "الترشح عبر سفارة الولايات المتحدة بالجزائر",
      when: "يُعلن عنه سنويًا عبر الجامعات الجزائرية والسفارة",
    },
  },
  {
    slug: "germany",
    code: "DE",
    flag: "de",
    officialSite: [{ label: "daad.de", url: "https://www.daad.de" }],
    en: {
      country: "Germany",
      programme: "DAAD Scholarships",
      fundedBy: "German Academic Exchange Service (DAAD)",
      levels: "Master's, PhD and research stays",
      covers: "Typically a monthly allowance, health insurance and a travel allowance",
      howToApply: "Search the DAAD scholarship database for your programme",
      when: "Deadlines vary by programme: check each listing",
    },
    fr: {
      country: "Allemagne",
      programme: "Bourses DAAD",
      fundedBy: "Office allemand d'échanges universitaires (DAAD)",
      levels: "Master, doctorat et séjours de recherche",
      covers: "En général une allocation mensuelle, une assurance maladie et une aide au voyage",
      howToApply: "Recherchez votre programme dans la base de bourses du DAAD",
      when: "Les dates limites varient selon le programme : vérifiez chaque annonce",
    },
    ar: {
      country: "ألمانيا",
      programme: "منح DAAD",
      fundedBy: "الهيئة الألمانية للتبادل الأكاديمي (DAAD)",
      levels: "ماستر، دكتوراه وإقامات بحثية",
      covers: "عادة منحة شهرية، تأمين صحي ومنحة سفر",
      howToApply: "ابحث عن برنامجك في قاعدة بيانات منح DAAD",
      when: "تختلف الآجال حسب البرنامج: راجع كل إعلان",
    },
  },
  {
    slug: "france",
    code: "FR",
    flag: "fr",
    officialSite: [{ label: "campusfrance.org", url: "https://www.campusfrance.org" }],
    en: {
      country: "France",
      programme: "Eiffel Excellence Scholarship",
      fundedBy: "French Ministry for Europe and Foreign Affairs, via Campus France",
      levels: "Master's and PhD",
      covers: "Typically a monthly allowance, return travel and health insurance",
      howToApply: "French universities apply on the student's behalf",
      when: "Usually early in the calendar year: ask your target university",
    },
    fr: {
      country: "France",
      programme: "Bourse d'excellence Eiffel",
      fundedBy: "Ministère de l'Europe et des Affaires étrangères, via Campus France",
      levels: "Master et doctorat",
      covers: "En général une allocation mensuelle, le voyage aller-retour et une assurance maladie",
      howToApply: "Ce sont les universités françaises qui présentent la candidature de l'étudiant",
      when: "Généralement en début d'année civile : renseignez-vous auprès de votre université cible",
    },
    ar: {
      country: "فرنسا",
      programme: "منحة التميز إيفل (Eiffel)",
      fundedBy: "وزارة أوروبا والشؤون الخارجية الفرنسية، عبر Campus France",
      levels: "ماستر ودكتوراه",
      covers: "عادة منحة شهرية، تذكرة ذهاب وإياب وتأمين صحي",
      howToApply: "الجامعات الفرنسية هي التي تقدّم ترشح الطالب",
      when: "عادة في بداية السنة الميلادية: استفسر لدى جامعتك المستهدفة",
    },
  },
  {
    slug: "canada",
    code: "CA",
    flag: "ca",
    officialSite: [{ label: "future.utoronto.ca", url: "https://future.utoronto.ca" }],
    en: {
      country: "Canada",
      programme: "Lester B. Pearson International Scholarship",
      fundedBy: "University of Toronto",
      levels: "Bachelor's degree",
      covers: "Tuition, books, incidental fees and full residence support for four years",
      howToApply: "Nomination by the student's school, then application",
      when: "Autumn to winter for the following year: check the university site",
    },
    fr: {
      country: "Canada",
      programme: "Bourse internationale Lester B. Pearson",
      fundedBy: "Université de Toronto",
      levels: "Licence (baccalauréat)",
      covers: "Frais de scolarité, livres, frais annexes et logement en résidence pris en charge pendant quatre ans",
      howToApply: "Nomination par l'établissement scolaire de l'élève, puis candidature",
      when: "De l'automne à l'hiver pour l'année suivante : consultez le site de l'université",
    },
    ar: {
      country: "كندا",
      programme: "منحة ليستر ب. بيرسون الدولية",
      fundedBy: "جامعة تورنتو",
      levels: "ليسانس (بكالوريوس)",
      covers: "رسوم الدراسة، الكتب، المصاريف الإضافية والسكن الجامعي كاملًا لمدة أربع سنوات",
      howToApply: "ترشيح من مؤسسة الطالب الدراسية، ثم تقديم الطلب",
      when: "من الخريف إلى الشتاء للسنة الموالية: راجع موقع الجامعة",
    },
  },
  {
    slug: "china",
    code: "CN",
    flag: "cn",
    officialSite: [{ label: "campuschina.org", url: "https://www.campuschina.org" }],
    en: {
      country: "China",
      programme: "Chinese Government Scholarship (CSC)",
      fundedBy: "China Scholarship Council",
      levels: "Bachelor's, master's, PhD and general scholars",
      covers: "Typically tuition, accommodation, monthly stipend and medical insurance",
      howToApply: "Through the Chinese Embassy or directly via host universities",
      when: "Usually opens in winter and runs into spring",
    },
    fr: {
      country: "Chine",
      programme: "Bourse du gouvernement chinois (CSC)",
      fundedBy: "China Scholarship Council",
      levels: "Licence, master, doctorat et chercheurs invités",
      covers: "En général frais de scolarité, logement, allocation mensuelle et assurance maladie",
      howToApply: "Via l'ambassade de Chine ou directement auprès des universités d'accueil",
      when: "Ouvre généralement en hiver et se poursuit jusqu'au printemps",
    },
    ar: {
      country: "الصين",
      programme: "منحة الحكومة الصينية (CSC)",
      fundedBy: "China Scholarship Council",
      levels: "ليسانس، ماستر، دكتوراه وباحثون زائرون",
      covers: "عادة رسوم الدراسة، السكن، منحة شهرية وتأمين صحي",
      howToApply: "عبر سفارة الصين أو مباشرة لدى الجامعات المستقبِلة",
      when: "يُفتح عادة في الشتاء ويستمر إلى الربيع",
    },
  },
  {
    slug: "south-korea",
    code: "KR",
    flag: "kr",
    officialSite: [{ label: "studyinkorea.go.kr", url: "https://www.studyinkorea.go.kr" }],
    en: {
      country: "South Korea",
      programme: "Global Korea Scholarship (GKS)",
      fundedBy: "NIIED, Ministry of Education of Korea",
      levels: "Undergraduate and graduate",
      covers:
        "Typically airfare, tuition, monthly allowance, a one-year Korean language course and insurance",
      howToApply: "Through the Korean Embassy or directly via universities",
      when: "Graduate and undergraduate tracks open at different times of year",
    },
    fr: {
      country: "Corée du Sud",
      programme: "Global Korea Scholarship (GKS)",
      fundedBy: "NIIED, ministère de l'Éducation de Corée",
      levels: "Licence et études supérieures",
      covers:
        "En général billet d'avion, frais de scolarité, allocation mensuelle, un an de cours de coréen et assurance",
      howToApply: "Via l'ambassade de Corée ou directement auprès des universités",
      when: "Les volets licence et études supérieures ouvrent à des périodes différentes de l'année",
    },
    ar: {
      country: "كوريا الجنوبية",
      programme: "Global Korea Scholarship (GKS)",
      fundedBy: "NIIED، وزارة التعليم الكورية",
      levels: "ليسانس ودراسات عليا",
      covers: "عادة تذكرة الطيران، رسوم الدراسة، منحة شهرية، سنة من دروس اللغة الكورية وتأمين",
      howToApply: "عبر سفارة كوريا أو مباشرة لدى الجامعات",
      when: "مسارا الليسانس والدراسات العليا يُفتحان في فترات مختلفة من السنة",
    },
  },
  {
    slug: "japan",
    code: "JP",
    flag: "jp",
    officialSite: [{ label: "studyinjapan.go.jp", url: "https://www.studyinjapan.go.jp" }],
    en: {
      country: "Japan",
      programme: "MEXT Scholarship",
      fundedBy: "Japanese Ministry of Education (MEXT)",
      levels: "Research students (master's/PhD), undergraduates and more",
      covers: "Typically tuition, a monthly allowance and round-trip airfare",
      howToApply: "Through the Embassy of Japan in Algeria (embassy recommendation)",
      when: "Usually announced in spring by the Embassy",
    },
    fr: {
      country: "Japon",
      programme: "Bourse MEXT",
      fundedBy: "Ministère japonais de l'Éducation (MEXT)",
      levels: "Étudiants-chercheurs (master/doctorat), licence et autres",
      covers: "En général frais de scolarité, allocation mensuelle et billet d'avion aller-retour",
      howToApply: "Via l'ambassade du Japon en Algérie (recommandation de l'ambassade)",
      when: "Généralement annoncé au printemps par l'ambassade",
    },
    ar: {
      country: "اليابان",
      programme: "منحة MEXT",
      fundedBy: "وزارة التعليم اليابانية (MEXT)",
      levels: "طلبة باحثون (ماستر/دكتوراه)، ليسانس وغيرها",
      covers: "عادة رسوم الدراسة، منحة شهرية وتذكرة طيران ذهاب وإياب",
      howToApply: "عبر سفارة اليابان في الجزائر (توصية السفارة)",
      when: "يُعلن عنه عادة في الربيع من طرف السفارة",
    },
  },
];

export const destinationSlugs = sources.map((s) => s.slug);

export function getDestinations(lang: Locale): Destination[] {
  return sources.map(({ en, fr, ar, ...rest }) => ({ ...rest, ...{ en, fr, ar }[lang] }));
}

export function getDestination(slug: string, lang: Locale): Destination | undefined {
  return getDestinations(lang).find((d) => d.slug === slug);
}
