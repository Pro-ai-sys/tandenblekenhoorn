export const wijkImages: { src: string; alt: string }[] = [
  {
    src: "/images/behandelkamer-tandenbleken.jpg",
    alt: "Behandelkamer voor tanden bleken bij Golden Smile",
  },
  {
    src: "/images/led-lamp-tandenbleken.jpg",
    alt: "LED-lamp voor peroxidevrij tanden bleken bij Golden Smile",
  },
  {
    src: "/images/led-lamp-detail-tandenbleken.jpg",
    alt: "Detail van de LED-bleeklamp bij Golden Smile",
  },
  {
    src: "/images/tandenkleuren-waaier-tandenbleken.jpg",
    alt: "Tandenkleuren-waaier voor kleurbepaling bij Golden Smile",
  },
];

export function getWijkImage(index: number) {
  return wijkImages[index % wijkImages.length];
}
