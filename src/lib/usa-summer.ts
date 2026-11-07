import type { Locale } from "./i18n";

/** Copy of the USA Summer Experience page (the client's English text, translated to French and Arabic). */
const en = {
  metaTitle: "USA Summer Experience 2026/2027",
  metaDescription:
    "Spend your summer in the United States: improve your English, gain international work experience, earn money and travel. Go4Visa guides you every step of the way.",
  hero: {
    label: "USA Summer Experience 2026/2027",
    title: ["Your summer.", "Your adventure.", "Your USA!"],
    lead: "One summer can open the door to a whole new world!",
    primary: "Start your USA journey",
    secondary: "Discover the experience",
    scroll: "Scroll",
  },
  experience: {
    eyebrow: "The experience",
    title: "Why spend your summer in the USA?",
    paragraphs: [
      "Imagine spending your summer in the United States, meeting people from all over the world, improving your English, gaining international work experience, earning money, and discovering a completely different lifestyle!",
      "From exciting work experiences to unforgettable summer adventures, you have the chance to explore new opportunities, develop valuable skills, make international friendships, and even travel across the USA!",
      "It's more than just a summer abroad. It's an experience that helps you grow, discover yourself, and create memories for a lifetime!",
    ],
    benefits: {
      english: "Improve your English",
      work: "Gain international work experience",
      money: "Earn money",
      people: "Meet people from around the world",
      culture: "Explore American culture",
      travel: "Travel across the USA",
    },
  },
  gallery: {
    eyebrow: "Summer in the USA",
    title: "The American summer, in pictures",
    lead: "Las Vegas, Beverly Hills, Hollywood, New York… a summer that takes you to places you have only seen on screen.",
  },
  guide: {
    eyebrow: "Go4Visa",
    title: "We're here to guide you every step of the way!",
    paragraphs: [
      "As an international opportunities consulting agency, our role is to make your journey easier, clearer, and better prepared.",
      "With our experience and knowledge, we help you explore the right opportunities and make informed decisions based on your profile, interests, and goals.",
    ],
    tags: ["Your profile", "Your interests", "Your goals"],
  },
  services: {
    eyebrow: "Our services",
    title: "How we help you",
    items: [
      {
        title: "Find the right program for you",
        text: "We recommend reliable official websites and trusted organizations and sponsors where you can explore and apply for the program that matches your profile.",
      },
      {
        title: "Personalized guidance",
        text: "We help you understand the different options, requirements, procedures, and costs before making your decision.",
      },
      {
        title: "Application assistance",
        text: "We walk you through the application process, explaining each step and helping you avoid common mistakes.",
      },
      {
        title: "Interview preparation",
        text: "We prepare you for interviews with sponsors and potential employers, depending on the program/job offer you choose.",
      },
      {
        title: "Documentation support",
        text: "We help you understand and organize the documents required throughout the process.",
      },
      {
        title: "Visa preparation",
        text: "We guide you through the visa application procedures, appointment preparation, and interview expectations.",
      },
    ],
  },
  commitment: {
    eyebrow: "Our commitment",
    rateLabel: "Visa success rate",
    rateNote: "Among the students we've assisted.",
    trust: "We believe that the right information and proper preparation can make all the difference!",
    disclaimerTitle: "Good to know",
    disclaimer:
      "We don't promise visas. We provide the knowledge, guidance, and preparation to help you find and pursue the right international opportunity.",
  },
  cta: {
    title: "Ready to make this summer different?",
    paragraphs: [
      "Your American adventure could be closer than you think!",
      "Discover your options, get the right guidance, and take the first step towards an experience you'll never forget.",
    ],
    button: "Book your consultation",
    note: "Let's start planning your American summer!",
  },
  credits: "Photos",
};

export type UsaSummerDict = typeof en;

const fr: UsaSummerDict = {
  metaTitle: "Été aux USA 2026/2027",
  metaDescription:
    "Passez votre été aux États-Unis : améliorez votre anglais, acquérez une expérience professionnelle internationale, gagnez de l'argent et voyagez. Go4Visa vous accompagne à chaque étape.",
  hero: {
    label: "Expérience d'été aux USA 2026/2027",
    title: ["Votre été.", "Votre aventure.", "Votre Amérique !"],
    lead: "Un seul été peut vous ouvrir les portes d'un tout nouveau monde !",
    primary: "Commencez votre aventure américaine",
    secondary: "Découvrir l'expérience",
    scroll: "Défiler",
  },
  experience: {
    eyebrow: "L'expérience",
    title: "Pourquoi passer votre été aux États-Unis ?",
    paragraphs: [
      "Imaginez passer votre été aux États-Unis : rencontrer des gens du monde entier, améliorer votre anglais, acquérir une expérience professionnelle internationale, gagner de l'argent et découvrir un mode de vie complètement différent !",
      "Des expériences de travail passionnantes aux aventures estivales inoubliables, vous avez la chance d'explorer de nouvelles opportunités, de développer des compétences précieuses, de nouer des amitiés internationales et même de voyager à travers les États-Unis !",
      "C'est bien plus qu'un été à l'étranger. C'est une expérience qui vous aide à grandir, à vous découvrir et à créer des souvenirs pour toute une vie !",
    ],
    benefits: {
      english: "Améliorer votre anglais",
      work: "Acquérir une expérience professionnelle internationale",
      money: "Gagner de l'argent",
      people: "Rencontrer des gens du monde entier",
      culture: "Découvrir la culture américaine",
      travel: "Voyager à travers les États-Unis",
    },
  },
  gallery: {
    eyebrow: "L'été aux États-Unis",
    title: "L'été américain en images",
    lead: "Las Vegas, Beverly Hills, Hollywood, New York… un été qui vous emmène dans des lieux que vous n'avez vus qu'à l'écran.",
  },
  guide: {
    eyebrow: "Go4Visa",
    title: "Nous vous accompagnons à chaque étape !",
    paragraphs: [
      "En tant qu'agence de conseil en opportunités internationales, notre rôle est de rendre votre parcours plus simple, plus clair et mieux préparé.",
      "Grâce à notre expérience et à nos connaissances, nous vous aidons à explorer les bonnes opportunités et à prendre des décisions éclairées selon votre profil, vos centres d'intérêt et vos objectifs.",
    ],
    tags: ["Votre profil", "Vos centres d'intérêt", "Vos objectifs"],
  },
  services: {
    eyebrow: "Nos services",
    title: "Comment nous vous aidons",
    items: [
      {
        title: "Trouver le programme qui vous correspond",
        text: "Nous vous recommandons des sites officiels fiables, des organismes et des sponsors de confiance où vous pouvez explorer le programme adapté à votre profil et y postuler.",
      },
      {
        title: "Accompagnement personnalisé",
        text: "Nous vous aidons à comprendre les différentes options, conditions, démarches et coûts avant de prendre votre décision.",
      },
      {
        title: "Aide à la candidature",
        text: "Nous vous guidons tout au long de la candidature, en expliquant chaque étape et en vous aidant à éviter les erreurs courantes.",
      },
      {
        title: "Préparation aux entretiens",
        text: "Nous vous préparons aux entretiens avec les sponsors et les employeurs potentiels, selon le programme ou l'offre d'emploi que vous choisissez.",
      },
      {
        title: "Aide pour les documents",
        text: "Nous vous aidons à comprendre et à organiser les documents demandés tout au long du processus.",
      },
      {
        title: "Préparation au visa",
        text: "Nous vous guidons dans les démarches de demande de visa, la préparation du rendez-vous et ce qui vous attend à l'entretien.",
      },
    ],
  },
  commitment: {
    eyebrow: "Notre engagement",
    rateLabel: "Taux de réussite au visa",
    rateNote: "Parmi les étudiants que nous avons accompagnés.",
    trust: "Nous sommes convaincus que la bonne information et une bonne préparation peuvent tout changer !",
    disclaimerTitle: "Bon à savoir",
    disclaimer:
      "Nous ne promettons pas de visas. Nous apportons les connaissances, l'accompagnement et la préparation pour vous aider à trouver et à saisir la bonne opportunité internationale.",
  },
  cta: {
    title: "Prêt à vivre un été différent ?",
    paragraphs: [
      "Votre aventure américaine est peut-être plus proche que vous ne le pensez !",
      "Découvrez vos options, bénéficiez du bon accompagnement et faites le premier pas vers une expérience que vous n'oublierez jamais.",
    ],
    button: "Réservez votre consultation",
    note: "Commençons à préparer votre été américain !",
  },
  credits: "Photos",
};

const ar: UsaSummerDict = {
  metaTitle: "USA Summer Experience 2026/2027",
  metaDescription:
    "اقضِ صيفك في الولايات المتحدة: حسّن لغتك الإنجليزية، واكتسب خبرة عمل دولية، واكسب المال، وسافر. ترافقك Go4Visa في كل خطوة.",
  hero: {
    label: "USA Summer Experience 2026/2027",
    title: ["صيفك.", "مغامرتك.", "أمريكا في انتظارك!"],
    lead: "صيف واحد قد يفتح لك الباب على عالم جديد تمامًا!",
    primary: "ابدأ رحلتك إلى أمريكا",
    secondary: "اكتشف التجربة",
    scroll: "مرّر",
  },
  experience: {
    eyebrow: "التجربة",
    title: "لماذا تقضي صيفك في الولايات المتحدة؟",
    paragraphs: [
      "تخيّل أن تقضي صيفك في الولايات المتحدة، تتعرّف على أشخاص من كل أنحاء العالم، وتحسّن لغتك الإنجليزية، وتكتسب خبرة عمل دولية، وتكسب المال، وتكتشف نمط حياة مختلفًا تمامًا!",
      "من تجارب عمل مثيرة إلى مغامرات صيفية لا تُنسى، أمامك فرصة لاستكشاف آفاق جديدة، وتطوير مهارات قيّمة، وبناء صداقات دولية، بل وحتى السفر عبر الولايات المتحدة!",
      "إنها أكثر من مجرد صيف في الخارج. إنها تجربة تساعدك على النمو واكتشاف ذاتك وصنع ذكريات تدوم مدى الحياة!",
    ],
    benefits: {
      english: "حسّن لغتك الإنجليزية",
      work: "اكتسب خبرة عمل دولية",
      money: "اكسب المال",
      people: "تعرّف على أشخاص من كل أنحاء العالم",
      culture: "اكتشف الثقافة الأمريكية",
      travel: "سافر عبر الولايات المتحدة",
    },
  },
  gallery: {
    eyebrow: "الصيف في الولايات المتحدة",
    title: "الصيف الأمريكي بالصور",
    lead: "لاس فيغاس، بيفرلي هيلز، هوليوود، نيويورك… صيف يأخذك إلى أماكن لم ترها إلا على الشاشة.",
  },
  guide: {
    eyebrow: "Go4Visa",
    title: "نحن هنا لنرافقك في كل خطوة!",
    paragraphs: [
      "بصفتنا وكالة استشارات في الفرص الدولية، دورنا هو أن نجعل رحلتك أسهل وأوضح وأفضل تحضيرًا.",
      "بفضل خبرتنا ومعرفتنا، نساعدك على استكشاف الفرص المناسبة واتخاذ قرارات مدروسة وفق ملفك واهتماماتك وأهدافك.",
    ],
    tags: ["ملفك", "اهتماماتك", "أهدافك"],
  },
  services: {
    eyebrow: "خدماتنا",
    title: "كيف نساعدك",
    items: [
      {
        title: "إيجاد البرنامج المناسب لك",
        text: "نرشدك إلى مواقع رسمية موثوقة وهيئات وجهات راعية معتمدة يمكنك من خلالها استكشاف البرنامج المناسب لملفك والتقديم عليه.",
      },
      {
        title: "مرافقة شخصية",
        text: "نساعدك على فهم مختلف الخيارات والشروط والإجراءات والتكاليف قبل اتخاذ قرارك.",
      },
      {
        title: "المساعدة في الترشح",
        text: "نرافقك خلال عملية الترشح، ونشرح لك كل خطوة ونساعدك على تجنّب الأخطاء الشائعة.",
      },
      {
        title: "التحضير للمقابلات",
        text: "نحضّرك للمقابلات مع الجهات الراعية وأصحاب العمل المحتملين، حسب البرنامج أو عرض العمل الذي تختاره.",
      },
      {
        title: "الدعم في الوثائق",
        text: "نساعدك على فهم الوثائق المطلوبة وتنظيمها طوال مراحل العملية.",
      },
      {
        title: "التحضير للتأشيرة",
        text: "نرشدك في إجراءات طلب التأشيرة، والتحضير للموعد، وما ينتظرك في المقابلة.",
      },
    ],
  },
  commitment: {
    eyebrow: "التزامنا",
    rateLabel: "نسبة النجاح في التأشيرة",
    rateNote: "من بين الطلبة الذين رافقناهم.",
    trust: "نؤمن بأن المعلومة الصحيحة والتحضير الجيد يمكن أن يصنعا الفرق!",
    disclaimerTitle: "معلومة مهمة",
    disclaimer:
      "لا نَعِد بالتأشيرات. نقدّم المعرفة والمرافقة والتحضير لمساعدتك على إيجاد الفرصة الدولية المناسبة والسعي إليها.",
  },
  cta: {
    title: "مستعد لتجعل هذا الصيف مختلفًا؟",
    paragraphs: [
      "قد تكون مغامرتك الأمريكية أقرب مما تتصوّر!",
      "اكتشف خياراتك، واحصل على المرافقة المناسبة، واخطُ الخطوة الأولى نحو تجربة لن تنساها أبدًا.",
    ],
    button: "احجز استشارتك",
    note: "لنبدأ التخطيط لصيفك الأمريكي!",
  },
  credits: "الصور",
};

const dicts: Record<Locale, UsaSummerDict> = { en, fr, ar };

export function getUsaSummerDict(lang: Locale) {
  return dicts[lang];
}
