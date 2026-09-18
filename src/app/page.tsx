import { Hero } from "@/components/Hero";
import { UspList } from "@/components/UspList";
import { TreatmentGrid } from "@/components/TreatmentGrid";
import { WijkLinks } from "@/components/WijkLinks";

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Golden Smile — Centrum Hoorn"
        title="Tanden bleken in Hoorn: jouw stralende, witte glimlach"
        subtitle="Bij Golden Smile bleek je je tanden op een veilige, pijnvrije manier. Centraal gelegen in het centrum van Hoorn, met gratis parkeren voor de deur. Kies je behandeling en boek direct online een tijdslot."
      />
      <UspList />
      <TreatmentGrid />
      <WijkLinks />
    </>
  );
}
