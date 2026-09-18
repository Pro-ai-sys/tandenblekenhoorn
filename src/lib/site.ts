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
    "Enkhuizen",
    "Medemblik",
    "Hoogkarspel",
    "Bovenkarspel",
    "Andijk",
    "Wervershoof",
  ],
  usps: [
    "Direct resultaat na één behandeling",
    "100% veilig, ook voor gevoelige tanden",
    "Peroxidevrije behandeling, zonder peroxide-houdende gels",
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
      "Golden Smile zit midden in het centrum van Hoorn, aan de Gedempte Appelhaven. Loop of fiets er zo naartoe, en parkeer gratis voor de deur voor je bleekbehandeling.",
  },
  {
    slug: "tanden-bleken-kersenboogerd",
    naam: "Kersenboogerd",
    intro:
      "Vanuit de wijk Kersenboogerd fiets je in een paar minuten naar het centrum van Hoorn, waar Golden Smile je klaarstaat voor een stralende glimlach — met gratis parkeren voor wie liever met de auto komt.",
  },
  {
    slug: "tanden-bleken-grote-waal",
    naam: "Grote Waal",
    intro:
      "Grote Waal ligt praktisch om de hoek bij het centrum van Hoorn. Golden Smile is dan ook snel te bereiken, met gratis parkeren pal voor de deur.",
  },
  {
    slug: "tanden-bleken-risdam",
    naam: "Risdam",
    intro:
      "Ook als je in Risdam woont, ben je binnen een paar minuten bij Golden Smile in het centrum van Hoorn. Gratis parkeren maakt een bezoek extra makkelijk.",
  },
  {
    slug: "tanden-bleken-blokker",
    naam: "Blokker",
    intro:
      "Blokker grenst direct aan Hoorn, dus Golden Smile ligt praktisch naast de deur. Kom langs voor een peroxidevrije bleekbehandeling, met gratis parkeren voor de salon.",
  },
  {
    slug: "tanden-bleken-zwaag",
    naam: "Zwaag",
    intro:
      "Vanuit Zwaag ben je zo het centrum van Hoorn in. Golden Smile werkt uitsluitend met bleekgels zonder peroxide, voor een veilige en pijnvrije behandeling.",
  },
  {
    slug: "tanden-bleken-wognum",
    naam: "Wognum",
    intro:
      "Wognum ligt op een klein stukje rijden van Hoorn. Bij Golden Smile in het centrum kun je eenvoudig online een tijdslot boeken, met gratis parkeren voor de deur.",
  },
  {
    slug: "tanden-bleken-berkhout",
    naam: "Berkhout",
    intro:
      "Kom je uit Berkhout? Dan is Golden Smile in het centrum van Hoorn een fijn, dichtbij gelegen adres voor een witte, stralende glimlach.",
  },
  {
    slug: "tanden-bleken-venhuizen",
    naam: "Venhuizen",
    intro:
      "Vanuit Venhuizen rijd je zo naar Golden Smile in het centrum van Hoorn. Gratis parkeren voor de deur maakt het bezoek extra eenvoudig.",
  },
  {
    slug: "tanden-bleken-west-friesland",
    naam: "West-Friesland",
    intro:
      "Waar je ook woont in West-Friesland, Golden Smile in het centrum van Hoorn is voor de hele regio goed bereikbaar — met gratis parkeren en online een tijdslot boeken.",
  },
  {
    slug: "tanden-bleken-noord-holland",
    naam: "Noord-Holland",
    intro:
      "Kom je van iets verder uit Noord-Holland? Golden Smile in het centrum van Hoorn is de moeite van de rit waard: tanden bleken zonder peroxide, in een persoonlijke setting.",
  },
  {
    slug: "tanden-bleken-enkhuizen",
    naam: "Enkhuizen",
    intro:
      "Enkhuizen ligt op zo'n twintig minuten rijden van Hoorn. Golden Smile in het centrum is voor Enkhuizers een geliefd adres voor een gratis, vrijblijvend advies over tanden bleken.",
  },
  {
    slug: "tanden-bleken-medemblik",
    naam: "Medemblik",
    intro:
      "Vanuit Medemblik ben je met de auto zo bij Golden Smile in het centrum van Hoorn, voor een peroxidevrije bleekbehandeling met gratis parkeren voor de deur.",
  },
  {
    slug: "tanden-bleken-hoogkarspel",
    naam: "Hoogkarspel",
    intro:
      "Woon je in Hoogkarspel? Dan hoef je niet ver te reizen: Golden Smile in het centrum van Hoorn helpt je graag aan een stralende, witte glimlach.",
  },
  {
    slug: "tanden-bleken-bovenkarspel",
    naam: "Bovenkarspel",
    intro:
      "Vanuit Bovenkarspel is Golden Smile in het centrum van Hoorn zo bereikbaar, met gratis parkeren vlak voor de deur en online eenvoudig een tijdslot boeken.",
  },
  {
    slug: "tanden-bleken-andijk",
    naam: "Andijk",
    intro:
      "Kom je uit Andijk en wil je je tanden laten bleken zonder peroxide-houdende gels? Golden Smile in het centrum van Hoorn staat voor je klaar, met een gratis en vrijblijvend advies vooraf.",
  },
  {
    slug: "tanden-bleken-wervershoof",
    naam: "Wervershoof",
    intro:
      "Vanuit Wervershoof ben je met de auto zo bij Golden Smile in het centrum van Hoorn. Gratis parkeren voor de deur maakt het bezoek extra makkelijk.",
  },
];
