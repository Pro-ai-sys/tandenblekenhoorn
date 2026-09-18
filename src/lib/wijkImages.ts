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
    src: "/images/tandenkleuren-waaier-tandenbleken.jpg",
    alt: "Tandenkleuren-waaier voor kleurbepaling bij Golden Smile",
  },
  {
    src: "/images/golden-smile-tandpasta.jpg",
    alt: "Golden Smile tandpasta voor onderhoud na het bleken",
  },
  {
    src: "/images/golden-smile-tandpasta-verpakking.jpg",
    alt: "Verpakking van de Golden Smile tandpasta",
  },
  {
    src: "/images/golden-smile-sfeerfoto.jpg",
    alt: "Sfeerbeeld bij Golden Smile in Hoorn",
  },
];

export function getWijkImage(index: number) {
  return wijkImages[index % wijkImages.length];
}
