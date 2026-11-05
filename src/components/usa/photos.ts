import nycSunset from "@/assets/usa/nyc-sunset.webp";
import centralPark from "@/assets/usa/central-park.webp";
import timesSquare from "@/assets/usa/times-square.webp";
import santaMonicaPier from "@/assets/usa/santa-monica-pier.webp";
import santaMonicaStairs from "@/assets/usa/santa-monica-stairs.webp";
import santaMonicaBeach from "@/assets/usa/santa-monica-beach.webp";
import goldenGate from "@/assets/usa/golden-gate.webp";
import route66 from "@/assets/usa/route-66.webp";
import washingtonSquare from "@/assets/usa/washington-square.webp";
import lifeguard from "@/assets/usa/lifeguard.webp";
import boardwalk from "@/assets/usa/boardwalk.webp";
import liberty from "@/assets/usa/liberty.webp";
import brooklynNight from "@/assets/usa/brooklyn-night.webp";

/** Photos of the USA Summer Experience page, all from Wikimedia Commons under free licences. */
export const photos = {
  nycSunset: {
    src: nycSunset,
    alt: "Lower Manhattan skyline at sunset, New York",
    credit: { author: "King of Hearts", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Lower_Manhattan_from_Jersey_City_November_2016_002.jpg" },
  },
  centralPark: {
    src: centralPark,
    alt: "People relaxing on the lawn of Central Park, New York",
    credit: { author: "LBM1948", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Nueva_York,_panor%C3%A1micas_(1997)_01.jpg" },
  },
  timesSquare: {
    src: timesSquare,
    alt: "Crowds in Times Square at night, New York",
    credit: { author: "Nielsoncaetanosalmeron", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Times_Square,_NYC_at_night_-_August_2025.jpg" },
  },
  santaMonicaPier: {
    src: santaMonicaPier,
    alt: "Santa Monica Pier and its Ferris wheel at sunset, California",
    credit: { author: "GillyBerlin", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Santa_Monica_Pier_in_Los_Angeles.jpg" },
  },
  santaMonicaStairs: {
    src: santaMonicaStairs,
    alt: "Young people sitting on the stairs of Santa Monica Pier on a summer day",
    credit: { author: "Felipe Valduga", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Santa_Monica_Pier_-_21482173155.jpg" },
  },
  santaMonicaBeach: {
    src: santaMonicaBeach,
    alt: "Summer evening on Santa Monica beach, California",
    credit: { author: "Blake Everett", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Santa_Monica,_CA_02.JPG" },
  },
  goldenGate: {
    src: goldenGate,
    alt: "Golden Gate Bridge at sunset, San Francisco",
    credit: { author: "Umer Sayyam", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Golden_Gate_Purple_Sunset._(Unsplash).jpg" },
  },
  route66: {
    src: route66,
    alt: "Historic Route 66 road marking in the California desert",
    credit: { author: "Dietmar Rabich", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Amboy_(California,_USA)_--_2012_--_5704.jpg" },
  },
  washingtonSquare: {
    src: washingtonSquare,
    alt: "Summer afternoon around the fountain of Washington Square Park, New York",
    credit: { author: "Acroterion", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Washington_Square_NY1.jpg" },
  },
  lifeguard: {
    src: lifeguard,
    alt: "Lifeguard on duty at a colourful lifeguard tower, Miami Beach",
    credit: { author: "Jorge Royan", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Miami_-_Lifeguard_tower_and_flags_-_0514.jpg" },
  },
  boardwalk: {
    src: boardwalk,
    alt: "Busy summer day on the Santa Cruz Beach Boardwalk, California",
    credit: { author: "Nick Amoscato", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Santa_Cruz_Beach_Boardwalk_2018.jpg" },
  },
  liberty: {
    src: liberty,
    alt: "Statue of Liberty at sunset, New York",
    credit: { author: "Eric Kilby", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Statue_of_Liberty_Lit_by_Sunset.jpg" },
  },
  brooklynNight: {
    src: brooklynNight,
    alt: "Lower Manhattan and the Brooklyn Bridge at night",
    credit: { author: "John Cunniff", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:NYC_Downtown_and_Brooklyn_Bridge_Panorama_(Explored)_(19610363205).jpg" },
  },
} as const;
