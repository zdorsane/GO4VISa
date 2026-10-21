/**
 * All site copy lives here, in English and French, so it can be edited in one
 * place.
 *
 * Text comes from the brief and the Go4Visa brand book. Anything the brand
 * hasn't supplied yet is a visible placeholder in [square brackets] and is
 * marked `// TODO(content)` — nothing has been invented.
 */
import type { Locale } from "./i18n";

/** Language-independent details. */
export const site = {
  name: "Go4Visa",
  url: "https://www.go4visa.com",
  email: "go4visa.consultation@gmail.com",
  // Contact channels below are hidden on the site until they are filled in.
  phone: "", // TODO(content): display format, e.g. "+213 XX XX XX XX"
  phoneHref: "", // TODO(content): e.g. "tel:+213XXXXXXXXX"
  // WhatsApp number in international format (digits only, no "+").
  whatsapp: "213672106714",
  whatsappDisplay: "+213 672 10 67 14",
  tagline: "Dream · Study · Go Further", // brand tagline, kept in English
  // TODO(content): real profile URLs — an icon is only shown once its URL is set
  socials: [
    { name: "Instagram", href: "" },
    { name: "Facebook", href: "" },
    { name: "LinkedIn", href: "" },
  ],
};

/**
 * WhatsApp click-to-chat link, or "" when no valid phone number is configured
 * (anything that isn't 8–15 digits, such as an email address, is ignored).
 */
export function whatsappHref(): string {
  const digits = site.whatsapp.replace(/[\s+().-]/g, "");
  return /^\d{8,15}$/.test(digits) ? `https://wa.me/${digits}` : "";
}

/** A number is animated as a counter; a string is shown as written. */
export type Stat = { label: string; value: number | string; suffix?: string };

export type FaqItem = {
  q: string;
  /** Answer (for the process question: the sentence before the steps). */
  a: string;
  cat: "opportunities" | "services" | "process";
  icon: string;
  steps?: string[];
  outro?: string;
};

/** Full plain-text answer, e.g. for structured data. */
export function faqAnswerText(f: FaqItem): string {
  return [f.a, f.steps?.join(" → "), f.outro].filter(Boolean).join(" ");
}

export type Service = {
  /** Matches SERVICE_OPTIONS in lib/contact.ts (sent with the contact form). */
  id: string;
  icon: string;
  title: string;
  text: string;
  writing: string;
  review: string;
  note?: string;
};

const en = {
  meta: {
    title: "Go4Visa — More Than a Visa, A World of Opportunities",
    description:
      "Go4Visa helps Algerian students discover scholarships abroad, strengthen their applications and navigate every step of the journey, from preparing their documents and securing admission to obtaining their visa.",
    ogLocale: "en_US",
  },
  ui: {
    getStarted: "Start your journey",
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    homeLabel: "Go4Visa — home",
    mainNav: "Main",
    language: "Language",
    switchTo: "Version française",
  },
  nav: [
    { label: "About", hash: "about" },
    { label: "Destinations", hash: "destinations" },
    { label: "Services", hash: "services" },
    { label: "Experiences", hash: "experiences" },
    { label: "How it works", hash: "how-it-works" },
    { label: "FAQ", hash: "faq" },
  ],
  hero: {
    eyebrow: "More than a visa",
    titleA: "More Than a Visa,",
    titleB: "A World of Opportunities",
    subline:
      "Get your chance to explore the world and embark on life-changing experiences through international educational opportunities. We guide students and young people every step of the way.",
    primaryCta: "Find your scholarship opportunity",
    secondaryCta: "See our services",
    scroll: "Scroll to explore",
    symbolAlt: "Go4Visa symbol",
  },
  stats: {
    label: "Go4Visa in numbers",
    items: [
      { label: "Students placed", value: 40, suffix: "+" },
      { label: "Destinations", value: "USA, Europe, Asia & Beyond" },
    ] as Stat[],
  },
  about: {
    eyebrow: "About Go4Visa",
    title: "Opening doors to global education",
    lead: "At Go4Visa, we help students discover scholarship opportunities, strengthen their applications, and navigate every step of the journey — from preparing their documents and securing admission to obtaining their visa.",
    body: "Every student is different, so our guidance is personal. Universities, scholarship committees and embassies make the final decisions; our role is to help you present your strongest application at each stage.",
    pillars: [
      "Personalized guidance",
      "Scholarship discovery",
      "Application preparation",
      "Admission & visa support",
    ],
    cta: "See our services",
    logoAlt: "Go4Visa logo: a round G with a graduation cap and an airplane on a golden path",
    symbolTitle: "Every part of the symbol tells the story",
    symbol: [
      { icon: "cap", title: "Graduation Cap", text: "Represents education, scholarships and academic growth." },
      { icon: "plane", title: "Airplane", text: "Symbolises travel, international mobility and new horizons." },
      { icon: "path", title: "Orbit / Path", text: "Shows the journey, progress and endless opportunities." },
      { icon: "g", title: "The Letter G", text: "Stands for Go: movement, ambition and the global vision." },
      { icon: "globe", title: "The Globe", text: "The round G is the world: diversity and global access." },
    ],
  },
  founder: {
    eyebrow: "Meet the founder",
    name: "Mahdi Sedira",
    role: "Founder of Go4Visa",
    lead: "A future doctor, passionate traveler, and the founder of Go4Visa.",
    body: "After discovering firsthand how life-changing global opportunities can be, I created Go4Visa to help other students discover them too. Having traveled to over 15 countries, I want to make it easier for students to explore the world, unlock new possibilities, and create their own journeys.",
    quote: "Your next opportunity could be the beginning of something extraordinary.",
    photoAlt: "Portrait of Mahdi Sedira, founder of Go4Visa",
    badges: {
      countries: { value: "15+", label: "countries explored" },
      doctor: "Future doctor",
      traveler: "Passionate traveler",
    },
  },
  destinations: {
    eyebrow: "Scholarships worldwide",
    title: "Explore available destinations",
    select: "Select a country to see its flagship programme and how to apply.",
    disclaimer: "Deadlines change every year — always confirm on official sites.",
    footnote: "Programmes and windows reflect the official sources at the time of writing.",
    flagship: "Flagship programme",
    fullDetails: "Full details for",
    officialSite: "Official site",
    newTab: "(opens in a new tab)",
    facts: {
      fundedBy: "Funded by",
      levels: "Levels",
      covers: "What it covers",
      howToApply: "How to apply",
      when: "When",
    },
  },
  services: {
    eyebrow: "What we offer",
    title: "Our services",
    lead: "Personalized support to help you present your strongest application and pursue the opportunities that match your profile.",
    pick: "Select a service",
    modesLabel: "Two ways we can help",
    modes: {
      writing: {
        label: "Writing assistance",
        text: "We help you write the best version of your document.",
        from: "Your ideas & experience",
        to: "A polished, ready-to-submit document",
      },
      review: {
        label: "Expert review",
        text: "We review your existing document and give you professional feedback.",
        from: "Your existing document",
        to: "Clear, detailed feedback to improve it",
      },
    },
    items: [
      {
        id: "essays",
        icon: "pen",
        title: "Essays: Writing & Review",
        text: "We help you develop a compelling essay tailored to your academic background, personal experiences, strengths, and the specific opportunity you are applying for.",
        writing: "Personalized help to develop and refine your essay in your own voice.",
        review: "Detailed feedback to improve clarity, structure, relevance and overall quality.",
      },
      {
        id: "cv",
        icon: "id",
        title: "Professional CV Preparation & Review",
        text: "We help you create or improve a professional CV that highlights your education, skills, achievements, projects, and experiences in a way that aligns with your target opportunity.",
        writing: "We build a clear, well-structured CV with you.",
        review: "We review your current CV and recommend improvements.",
      },
      {
        id: "motivation-letter",
        icon: "mail",
        title: "Motivation Letters",
        text: "We help you express your academic goals, motivation, relevant experiences, and future ambitions through a clear and persuasive motivation letter tailored to your chosen opportunity.",
        writing: "Help to express your goals and motivation clearly.",
        review: "Feedback to make your letter more focused and persuasive.",
      },
      {
        id: "recommendation-letter",
        icon: "user",
        title: "Recommendation Letter Support",
        text: "We help you structure, prepare, or review recommendation-letter drafts and supporting materials, while respecting the requirements of the institution and the recommender's role.",
        writing: "Help preparing the information and materials your recommender needs.",
        review: "Feedback on existing drafts against the institution's requirements.",
        note: "The final letter is always written or approved by your recommender.",
      },
      {
        id: "application-documents",
        icon: "list",
        title: "Application Documents & More",
        text: "From document preparation and proofreading to application guidance, we help you organize and improve the materials required for your chosen opportunity.",
        writing: "Help preparing and organizing the documents your application requires.",
        review: "Proofreading and a final check before you submit.",
      },
    ] as Service[],
    requestQuote: "Request a quote",
    requestQuoteAria: "Request a quote for {name}",
    quote: {
      title: "Pricing tailored to your needs",
      text: "Prices depend on the services you choose and the documents involved. Tell us what you need and we'll send you a personalized quote.",
      cta: "Get a personalized quote",
    },
  },
  /** Step descriptions summarise the Go4Visa journey. */
  steps: {
    eyebrow: "How it works",
    stepLabel: "Step",
    items: [
      { icon: "star", title: "Dream", text: "Profile & eligibility check, and guidance on countries and programmes." },
      { icon: "list", title: "Shortlist", text: "A personal scholarship shortlist matched to your profile." },
      { icon: "doc", title: "Apply", text: "CV and motivation letter coaching, document review and follow-up until results." },
      { icon: "plane", title: "Fly", text: "Visa file and interview prep, a pre-departure briefing and accommodation guidance." },
    ],
  },
  gallery: {
    eyebrow: "Our community",
    title: "Real experiences, unforgettable memories",
    lead: "Moments from the international programmes, exchanges and adventures our students have lived around the world.",
    tags: { travel: "Travel", learning: "Learning", community: "Community", milestones: "Milestones" },
    showMore: "See more photos",
    showLess: "Show fewer photos",
    open: "Open photo",
    close: "Close",
    prev: "Previous photo",
    next: "Next photo",
    viewer: "Photo viewer",
    cta: "Your story could be next",
  },
  floatingCta: {
    label: "Find your scholarship opportunity",
    short: "Find your opportunity",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    lead: "Everything you need to know before taking the first step towards studying abroad.",
    filterLabel: "Filter questions by topic",
    cats: { all: "All", opportunities: "Opportunities", services: "Our services", process: "Pricing & process" },
    help: {
      title: "Still have questions?",
      text: "Can't find your answer? Our team is happy to guide you personally.",
      whatsapp: "Chat on WhatsApp",
      email: "Send us an email",
    },
    items: [
      {
        q: "What services do you offer?",
        cat: "services",
        icon: "list",
        a: "We help students discover and apply for international opportunities, including scholarships, internships, exchange programs, and summer schools. We also provide support with CVs, motivation letters, essays, and applications.",
      },
      {
        q: "Which countries do you cover?",
        cat: "opportunities",
        icon: "globe",
        a: "We explore opportunities worldwide, including Europe, the United States, Canada, and the United Kingdom. Available options depend on your profile, eligibility, and program requirements.",
      },
      {
        q: "Am I eligible for international opportunities?",
        cat: "opportunities",
        icon: "check",
        a: "There are opportunities for different academic backgrounds and experience levels. We help you assess your eligibility and find programs that match your profile. Every journey starts somewhere!",
      },
      {
        q: "How much do your services cost?",
        cat: "process",
        icon: "wallet",
        a: "Our prices depend on the opportunity, the complexity of your application, and the level of support you need. We offer different packages, from individual document assistance to complete application guidance. Contact us for a personalized quote.",
      },
      {
        q: "Can you help me find fully funded scholarships?",
        cat: "opportunities",
        icon: "star",
        a: "Yes! We help you explore fully funded and partially funded scholarships that match your profile. Depending on the program, funding may cover tuition, accommodation, travel, or living expenses. Your next opportunity could be out there!",
      },
      {
        q: "Can you help with my CV, motivation letter, and essays?",
        cat: "services",
        icon: "doc",
        a: "Absolutely! We provide personalized guidance to help you create professional CVs, compelling motivation letters, and authentic essays that highlight your strengths, achievements, and ambitions.",
      },
      {
        q: "Can I apply without an English language certificate?",
        cat: "opportunities",
        icon: "cap",
        a: "Yes, for some opportunities. Requirements vary by program, and some accept alternative proof of English proficiency. We'll help you identify opportunities that match your language level and qualifications.",
      },
      {
        q: "Do you help with visa applications?",
        cat: "services",
        icon: "plane",
        a: "Yes! Depending on your package, we provide guidance on visa requirements, supporting documents, and application preparation. Visa approval depends on the relevant authorities and cannot be guaranteed.",
      },
      {
        q: "How does the process work?",
        cat: "process",
        icon: "path",
        a: "Our process is simple:",
        steps: ["Profile assessment", "Opportunity search", "Package selection", "Application preparation", "Submission guidance"],
        outro: "We'll support you throughout the agreed steps so you can move forward with confidence.",
      },
      {
        q: "What if my profile isn't strong enough?",
        cat: "opportunities",
        icon: "user",
        a: "Don't underestimate your potential! We'll help you identify your strengths, improve your application, and explore suitable opportunities. You don't need a perfect profile to begin — you need the right direction and a willingness to grow.",
      },
    ] as FaqItem[],
  },
  contact: {
    eyebrow: "Contact us",
    title: "Your next chapter starts here",
    lead: "Have questions about scholarships or your application documents? Get in touch with our team for personalized guidance.",
    whatsapp: "WhatsApp",
    welcome: {
      title: "Start your journey",
      message: "Take the first step, and let us guide you along the way. We're here to help you make it happen.",
      signature: "The Go4Visa team",
    },
    form: {
      name: "Full name",
      email: "Email",
      phone: "Phone",
      destination: "Destination",
      service: "Service",
      message: "Message",
      optional: "(optional)",
      notSure: "Not sure yet",
      chooseService: "Choose a service",
      send: "Send message",
      sending: "Sending…",
      sentTitle: "Message sent",
      sentText: "Thank you — we'll get back to you at the email you provided.",
      sendAnother: "Send another message",
      checkForm: "Please check the form and try again.",
      genericError: "Something went wrong.",
    },
  },
  footer: {
    quickLinks: "Quick links",
    destinations: "Destinations",
    allDestinations: "Explore all destinations",
    contact: "Contact",
    footerNav: "Footer",
    social: "Social media",
    socialOn: "Go4Visa on",
    rights: "All rights reserved.",
    closing: "Your future has no borders.",
  },
  detail: {
    breadcrumb: "Breadcrumb",
    home: "Home",
    apply: "Apply with Go4Visa",
    seeServices: "See our services",
    others: "Other destinations",
    fundedBy: "Funded by",
  },
  notFound: {
    title: "This page has flown away",
    back: "Back to home",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  meta: {
    title: "Go4Visa — Plus qu'un visa, un monde d'opportunités",
    description:
      "Go4Visa aide les étudiants algériens à découvrir des bourses à l'étranger, à renforcer leurs candidatures et à franchir chaque étape du parcours, de la préparation des documents et de l'admission jusqu'à l'obtention du visa.",
    ogLocale: "fr_FR",
  },
  ui: {
    getStarted: "Commencez votre parcours",
    skipToContent: "Aller au contenu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    homeLabel: "Go4Visa — accueil",
    mainNav: "Principal",
    language: "Langue",
    switchTo: "English version",
  },
  nav: [
    { label: "À propos", hash: "about" },
    { label: "Destinations", hash: "destinations" },
    { label: "Services", hash: "services" },
    { label: "Expériences", hash: "experiences" },
    { label: "Comment ça marche", hash: "how-it-works" },
    { label: "FAQ", hash: "faq" },
  ],
  hero: {
    eyebrow: "Plus qu'un visa",
    titleA: "Plus qu'un visa,",
    titleB: "un monde d'opportunités",
    subline:
      "Saisissez votre chance de découvrir le monde et de vivre des expériences qui changent une vie grâce aux opportunités éducatives internationales. Nous accompagnons les étudiants et les jeunes à chaque étape.",
    primaryCta: "Trouver mon opportunité de bourse",
    secondaryCta: "Voir nos services",
    scroll: "Défilez pour découvrir",
    symbolAlt: "Symbole Go4Visa",
  },
  stats: {
    label: "Go4Visa en chiffres",
    items: [
      { label: "Étudiants accompagnés", value: 40, suffix: "+" },
      { label: "Destinations", value: "États-Unis, Europe, Asie et au-delà" },
    ],
  },
  about: {
    eyebrow: "À propos de Go4Visa",
    title: "Ouvrir les portes de l'éducation internationale",
    lead: "Chez Go4Visa, nous aidons les étudiants à découvrir des bourses, à renforcer leurs candidatures et à franchir chaque étape du parcours — de la préparation des documents et de l'admission jusqu'à l'obtention du visa.",
    body: "Chaque étudiant est unique, c'est pourquoi notre accompagnement est personnalisé. Les universités, les comités de bourses et les ambassades prennent les décisions finales ; notre rôle est de vous aider à présenter la meilleure candidature possible à chaque étape.",
    pillars: [
      "Accompagnement personnalisé",
      "Recherche de bourses",
      "Préparation des candidatures",
      "Soutien pour l'admission et le visa",
    ],
    cta: "Voir nos services",
    logoAlt: "Logo Go4Visa : un G rond avec une toque de diplômé et un avion sur une trajectoire dorée",
    symbolTitle: "Chaque élément du symbole raconte une histoire",
    symbol: [
      { icon: "cap", title: "La toque", text: "Représente l'éducation, les bourses et la réussite académique." },
      { icon: "plane", title: "L'avion", text: "Symbolise le voyage, la mobilité internationale et de nouveaux horizons." },
      { icon: "path", title: "L'orbite", text: "Illustre le parcours, la progression et des opportunités infinies." },
      { icon: "g", title: "La lettre G", text: "Pour « Go » : le mouvement, l'ambition et la vision globale." },
      { icon: "globe", title: "Le globe", text: "Le G rond représente le monde : la diversité et l'accès mondial." },
    ],
  },
  founder: {
    eyebrow: "Rencontrez le fondateur",
    name: "Mahdi Sedira",
    role: "Fondateur de Go4Visa",
    lead: "Futur médecin, voyageur passionné et fondateur de Go4Visa.",
    body: "Après avoir découvert par moi-même à quel point les opportunités internationales peuvent changer une vie, j'ai créé Go4Visa pour aider d'autres étudiants à les découvrir à leur tour. Ayant voyagé dans plus de 15 pays, je veux permettre aux étudiants d'explorer le monde plus facilement, d'ouvrir de nouvelles perspectives et de tracer leur propre parcours.",
    quote: "Votre prochaine opportunité pourrait être le début de quelque chose d'extraordinaire.",
    photoAlt: "Portrait de Mahdi Sedira, fondateur de Go4Visa",
    badges: {
      countries: { value: "15+", label: "pays explorés" },
      doctor: "Futur médecin",
      traveler: "Voyageur passionné",
    },
  },
  destinations: {
    eyebrow: "Bourses dans le monde",
    title: "Découvrez les destinations disponibles",
    select: "Sélectionnez un pays pour découvrir son programme phare et comment postuler.",
    disclaimer: "Les dates limites changent chaque année — vérifiez toujours sur les sites officiels.",
    footnote: "Les programmes et calendriers reflètent les sources officielles au moment de la rédaction.",
    flagship: "Programme phare",
    fullDetails: "Tous les détails :",
    officialSite: "Site officiel",
    newTab: "(s'ouvre dans un nouvel onglet)",
    facts: {
      fundedBy: "Financé par",
      levels: "Niveaux",
      covers: "Ce qui est couvert",
      howToApply: "Comment postuler",
      when: "Quand",
    },
  },
  services: {
    eyebrow: "Ce que nous proposons",
    title: "Nos services",
    lead: "Un accompagnement personnalisé pour vous aider à présenter votre meilleure candidature et à saisir les opportunités adaptées à votre profil.",
    pick: "Sélectionnez un service",
    modesLabel: "Deux façons de vous aider",
    modes: {
      writing: {
        label: "Aide à la rédaction",
        text: "Nous vous aidons à rédiger la meilleure version de votre document.",
        from: "Vos idées et votre parcours",
        to: "Un document abouti, prêt à être envoyé",
      },
      review: {
        label: "Relecture experte",
        text: "Nous relisons votre document existant et vous donnons un avis professionnel.",
        from: "Votre document existant",
        to: "Un retour clair et détaillé pour l'améliorer",
      },
    },
    items: [
      {
        id: "essays",
        icon: "pen",
        title: "Essais : rédaction et relecture",
        text: "Nous vous aidons à rédiger un essai convaincant, adapté à votre parcours académique, à vos expériences personnelles, à vos points forts et à l'opportunité visée.",
        writing: "Une aide personnalisée pour construire et affiner votre essai, avec vos propres mots.",
        review: "Un retour détaillé pour améliorer la clarté, la structure, la pertinence et la qualité globale.",
      },
      {
        id: "cv",
        icon: "id",
        title: "CV professionnel : préparation et relecture",
        text: "Nous vous aidons à créer ou à améliorer un CV professionnel qui met en valeur votre formation, vos compétences, vos réalisations, vos projets et vos expériences, en cohérence avec l'opportunité visée.",
        writing: "Nous construisons avec vous un CV clair et bien structuré.",
        review: "Nous relisons votre CV actuel et vous proposons des améliorations.",
      },
      {
        id: "motivation-letter",
        icon: "mail",
        title: "Lettres de motivation",
        text: "Nous vous aidons à exprimer vos objectifs académiques, votre motivation, vos expériences pertinentes et vos ambitions dans une lettre de motivation claire et convaincante, adaptée à l'opportunité choisie.",
        writing: "Une aide pour exprimer clairement vos objectifs et votre motivation.",
        review: "Un retour pour rendre votre lettre plus ciblée et plus convaincante.",
      },
      {
        id: "recommendation-letter",
        icon: "user",
        title: "Lettres de recommandation",
        text: "Nous vous aidons à structurer, préparer ou relire les brouillons de lettres de recommandation et les documents d'appui, dans le respect des exigences de l'établissement et du rôle de votre recommandant.",
        writing: "Une aide pour préparer les informations et documents dont votre recommandant a besoin.",
        review: "Un retour sur les brouillons existants au regard des exigences de l'établissement.",
        note: "La lettre finale est toujours rédigée ou validée par votre recommandant.",
      },
      {
        id: "application-documents",
        icon: "list",
        title: "Documents de candidature et plus",
        text: "De la préparation et de la relecture des documents aux conseils sur la candidature, nous vous aidons à organiser et à améliorer les pièces requises pour l'opportunité choisie.",
        writing: "Une aide pour préparer et organiser les documents exigés par votre candidature.",
        review: "Une relecture et une vérification finale avant l'envoi.",
      },
    ],
    requestQuote: "Demander un devis",
    requestQuoteAria: "Demander un devis pour {name}",
    quote: {
      title: "Des tarifs adaptés à vos besoins",
      text: "Les tarifs dépendent des services choisis et des documents concernés. Dites-nous ce dont vous avez besoin et nous vous enverrons un devis personnalisé.",
      cta: "Obtenir un devis personnalisé",
    },
  },
  steps: {
    eyebrow: "Comment ça marche",
    stepLabel: "Étape",
    items: [
      { icon: "star", title: "Rêver", text: "Vérification du profil et de l'éligibilité, et conseils sur les pays et les programmes." },
      { icon: "list", title: "Sélectionner", text: "Une liste personnalisée de bourses adaptée à votre profil." },
      { icon: "doc", title: "Postuler", text: "Accompagnement CV et lettre de motivation, vérification des documents et suivi jusqu'aux résultats." },
      { icon: "plane", title: "S'envoler", text: "Préparation du dossier visa et de l'entretien, séance avant le départ et aide au logement." },
    ],
  },
  gallery: {
    eyebrow: "Notre communauté",
    title: "Des expériences réelles, des souvenirs inoubliables",
    lead: "Des moments vécus par nos étudiants lors de programmes internationaux, d'échanges et d'aventures à travers le monde.",
    tags: { travel: "Voyages", learning: "Apprentissage", community: "Communauté", milestones: "Réussites" },
    showMore: "Voir plus de photos",
    showLess: "Voir moins de photos",
    open: "Agrandir la photo",
    close: "Fermer",
    prev: "Photo précédente",
    next: "Photo suivante",
    viewer: "Visionneuse de photos",
    cta: "Votre histoire pourrait être la prochaine",
  },
  floatingCta: {
    label: "Trouver mon opportunité de bourse",
    short: "Trouver mon opportunité",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    lead: "Tout ce qu'il faut savoir avant de faire le premier pas vers vos études à l'étranger.",
    filterLabel: "Filtrer les questions par thème",
    cats: { all: "Toutes", opportunities: "Opportunités", services: "Nos services", process: "Tarifs et démarche" },
    help: {
      title: "Encore des questions ?",
      text: "Vous ne trouvez pas votre réponse ? Notre équipe se fera un plaisir de vous guider personnellement.",
      whatsapp: "Discuter sur WhatsApp",
      email: "Nous écrire un e-mail",
    },
    items: [
      {
        q: "Quels services proposez-vous ?",
        cat: "services",
        icon: "list",
        a: "Nous aidons les étudiants à découvrir des opportunités internationales et à y postuler : bourses, stages, programmes d'échange et écoles d'été. Nous les accompagnons aussi pour leurs CV, lettres de motivation, essais et candidatures.",
      },
      {
        q: "Quels pays couvrez-vous ?",
        cat: "opportunities",
        icon: "globe",
        a: "Nous explorons des opportunités dans le monde entier, notamment en Europe, aux États-Unis, au Canada et au Royaume-Uni. Les options disponibles dépendent de votre profil, de votre éligibilité et des exigences des programmes.",
      },
      {
        q: "Suis-je éligible aux opportunités internationales ?",
        cat: "opportunities",
        icon: "check",
        a: "Il existe des opportunités pour des parcours académiques et des niveaux d'expérience très variés. Nous vous aidons à évaluer votre éligibilité et à trouver les programmes adaptés à votre profil. Chaque parcours commence quelque part !",
      },
      {
        q: "Combien coûtent vos services ?",
        cat: "process",
        icon: "wallet",
        a: "Nos tarifs dépendent de l'opportunité visée, de la complexité de votre candidature et du niveau d'accompagnement dont vous avez besoin. Nous proposons différentes formules, de l'aide sur un seul document à l'accompagnement complet de votre candidature. Contactez-nous pour obtenir un devis personnalisé.",
      },
      {
        q: "Pouvez-vous m'aider à trouver des bourses entièrement financées ?",
        cat: "opportunities",
        icon: "star",
        a: "Oui ! Nous vous aidons à explorer les bourses entièrement ou partiellement financées qui correspondent à votre profil. Selon le programme, le financement peut couvrir les frais de scolarité, le logement, le voyage ou les frais de vie. Votre prochaine opportunité vous attend peut-être !",
      },
      {
        q: "Pouvez-vous m'aider pour mon CV, ma lettre de motivation et mes essais ?",
        cat: "services",
        icon: "doc",
        a: "Absolument ! Nous vous accompagnons de façon personnalisée pour créer un CV professionnel, une lettre de motivation convaincante et des essais authentiques qui mettent en valeur vos points forts, vos réalisations et vos ambitions.",
      },
      {
        q: "Puis-je postuler sans certificat de langue anglaise ?",
        cat: "opportunities",
        icon: "cap",
        a: "Oui, pour certaines opportunités. Les exigences varient selon les programmes, et certains acceptent d'autres justificatifs de votre niveau d'anglais. Nous vous aidons à repérer les opportunités adaptées à votre niveau de langue et à vos qualifications.",
      },
      {
        q: "Vous occupez-vous des demandes de visa ?",
        cat: "services",
        icon: "plane",
        a: "Oui ! Selon votre formule, nous vous conseillons sur les conditions du visa, les pièces justificatives et la préparation de votre demande. L'obtention du visa dépend des autorités compétentes et ne peut pas être garantie.",
      },
      {
        q: "Comment se déroule l'accompagnement ?",
        cat: "process",
        icon: "path",
        a: "Notre démarche est simple :",
        steps: ["Évaluation du profil", "Recherche d'opportunités", "Choix de la formule", "Préparation de la candidature", "Accompagnement jusqu'au dépôt"],
        outro: "Nous vous suivons tout au long des étapes convenues pour que vous avanciez en toute confiance.",
      },
      {
        q: "Et si mon profil n'est pas assez solide ?",
        cat: "opportunities",
        icon: "user",
        a: "Ne sous-estimez pas votre potentiel ! Nous vous aidons à identifier vos points forts, à améliorer votre candidature et à explorer les opportunités qui vous conviennent. Pas besoin d'un profil parfait pour commencer : il vous faut la bonne direction et l'envie de progresser.",
      },
    ],
  },
  contact: {
    eyebrow: "Contactez-nous",
    title: "Votre nouveau chapitre commence ici",
    lead: "Des questions sur les bourses ou vos documents de candidature ? Contactez notre équipe pour un accompagnement personnalisé.",
    whatsapp: "WhatsApp",
    welcome: {
      title: "Commencez votre parcours",
      message: "Faites le premier pas, et laissez-nous vous guider tout au long du chemin. Nous sommes là pour vous aider à concrétiser votre projet.",
      signature: "L'équipe Go4Visa",
    },
    form: {
      name: "Nom complet",
      email: "E-mail",
      phone: "Téléphone",
      destination: "Destination",
      service: "Service",
      message: "Message",
      optional: "(facultatif)",
      notSure: "Je ne sais pas encore",
      chooseService: "Choisir un service",
      send: "Envoyer le message",
      sending: "Envoi…",
      sentTitle: "Message envoyé",
      sentText: "Merci — nous vous répondrons à l'adresse e-mail indiquée.",
      sendAnother: "Envoyer un autre message",
      checkForm: "Veuillez vérifier le formulaire et réessayer.",
      genericError: "Une erreur est survenue.",
    },
  },
  footer: {
    quickLinks: "Liens rapides",
    destinations: "Destinations",
    allDestinations: "Voir toutes les destinations",
    contact: "Contact",
    footerNav: "Pied de page",
    social: "Réseaux sociaux",
    socialOn: "Go4Visa sur",
    rights: "Tous droits réservés.",
    closing: "Votre avenir n'a pas de frontières.",
  },
  detail: {
    breadcrumb: "Fil d'Ariane",
    home: "Accueil",
    apply: "Postuler avec Go4Visa",
    seeServices: "Voir nos services",
    others: "Autres destinations",
    fundedBy: "Financé par",
  },
  notFound: {
    title: "Cette page s'est envolée",
    back: "Retour à l'accueil",
  },
};

const dictionaries: Record<Locale, Dict> = { en, fr };

export function getDictionary(lang: Locale): Dict {
  return dictionaries[lang];
}
