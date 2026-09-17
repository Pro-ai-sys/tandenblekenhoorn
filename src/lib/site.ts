export const site = {
  name: "Tandenblekenhoorn.nl - Golden Smile",
  tagline: "Tanden bleken in het centrum van Hoorn",
  domain: "tandenblekenhoorn.nl",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tandenblekenhoorn.nl",
  owner: "Paula",
  email: "paula@tandenblekenhoorn.nl",
  phone: "0615060684",
  phoneDisplay: "06-15060684",
  address: {
    streetAddress: "Gedempte Appelhaven 4-D",
    addressLocality: "Hoorn",
    postalCode: "1621 BN",
    addressRegion: "Noord-Holland",
    addressCountry: "NL",
  },
  areasServed: [
    "Hoorn",
    "Kersenboogerd",
    "Grote Waal",
    "Risdam",
    "Blokker",
    "Zwaag",
    "Wognum",
    "Berkhout",
    "Venhuizen",
  ],
  usps: [
    "Direct resultaat na één behandeling",
    "100% veilig, ook voor gevoelige tanden",
    "Geen peroxide-houdende bleekgels",
    "Persoonlijke aandacht en kleurbepaling vooraf",
    "Gratis parkeren — geef je kenteken door via WhatsApp",
    "Airconditioning aanwezig",
  ],
} as const;

export type Wijk = {
  slug: string;
  naam: string;
  intro: string;
};

export const wijken: Wijk[] = [
  {
    slug: "tanden-bleken-hoorn",
    naam: "Hoorn",
    intro:
      "Op zoek naar tanden bleken in Hoorn? Golden Smile zit centraal in het centrum van Hoorn, met gratis parkeren voor de deur.",
  },
  {
    slug: "tanden-bleken-kersenboogerd",
    naam: "Kersenboogerd",
    intro:
      "Woon je in Kersenboogerd en wil je je tanden laten bleken? Golden Smile ligt op slechts een paar minuten rijden, midden in het centrum van Hoorn.",
  },
  {
    slug: "tanden-bleken-grote-waal",
    naam: "Grote Waal",
    intro:
      "Vanuit Grote Waal ben je zo bij Golden Smile in het centrum van Hoorn — dichtbij en met gratis parkeren voor de deur.",
  },
  {
    slug: "tanden-bleken-risdam",
    naam: "Risdam",
    intro:
      "Voor inwoners van Risdam is Golden Smile in het centrum van Hoorn eenvoudig te bereiken, met gratis parkeren vlak voor de deur.",
  },
  {
    slug: "tanden-bleken-blokker",
    naam: "Blokker",
    intro:
      "Ook vanuit Blokker ben je binnen enkele minuten bij Golden Smile in het centrum van Hoorn voor een stralende, witte glimlach.",
  },
  {
    slug: "tanden-bleken-zwaag",
    naam: "Zwaag",
    intro:
      "Kom vanuit Zwaag naar Golden Smile in het centrum van Hoorn voor tanden bleken zonder peroxide-houdende gels.",
  },
  {
    slug: "tanden-bleken-wognum",
    naam: "Wognum",
    intro:
      "Vanuit Wognum is Golden Smile in het centrum van Hoorn goed en snel bereikbaar, met gratis parkeren voor de deur.",
  },
  {
    slug: "tanden-bleken-berkhout",
    naam: "Berkhout",
    intro:
      "Woon je in Berkhout? Golden Smile in het centrum van Hoorn helpt je graag aan een witte glimlach, zonder peroxide-houdende bleekgels.",
  },
  {
    slug: "tanden-bleken-venhuizen",
    naam: "Venhuizen",
    intro:
      "Vanuit Venhuizen ben je met de auto zo bij Golden Smile in het centrum van Hoorn, inclusief gratis parkeren voor de deur.",
  },
  {
    slug: "tanden-bleken-west-friesland",
    naam: "West-Friesland",
    intro:
      "Woon je ergens in West-Friesland en wil je je tanden laten bleken? Golden Smile in het centrum van Hoorn is voor de hele regio goed en snel bereikbaar, met gratis parkeren voor de deur.",
  },
  {
    slug: "tanden-bleken-noord-holland",
    naam: "Noord-Holland",
    intro:
      "Ook vanuit de rest van Noord-Holland ben je welkom bij Golden Smile, centraal gelegen in het centrum van Hoorn, met gratis parkeren voor de deur.",
  },
];
