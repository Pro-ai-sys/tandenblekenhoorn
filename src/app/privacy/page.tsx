import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: `Hoe ${site.name} omgaat met persoonsgegevens bij het boeken van een afspraak.`,
};

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-serif text-4xl text-ink-900">Privacyverklaring</h1>
      <div className="prose prose-p:text-ink-700 prose-headings:font-serif prose-headings:text-ink-900 mt-8 max-w-none space-y-6 text-ink-700">
        <p>
          {site.name} verwerkt persoonsgegevens van klanten die via {site.domain} een afspraak boeken
          of hierover contact opnemen. Deze verklaring legt uit welke gegevens dat zijn, waarom ze
          worden verwerkt en hoe hiermee wordt omgegaan.
        </p>

        <h2 className="text-2xl">Welke gegevens</h2>
        <p>
          Bij het maken van een boeking worden je naam, e-mailadres en telefoonnummer opgeslagen,
          samen met de gekozen behandeling en het gekozen tijdstip.
        </p>

        <h2 className="text-2xl">Waarvoor</h2>
        <ul className="list-disc pl-6">
          <li>Het inplannen en bevestigen van je afspraak.</li>
          <li>Het versturen van een bevestigingsmail en, indien nodig, het regelen van de aanbetaling via Tikkie/WhatsApp.</li>
          <li>Het herkennen van bestaande klanten, zodat er geen dubbele klantprofielen ontstaan.</li>
          <li>
            Alleen met jouw uitdrukkelijke toestemming (een vinkje bij het boeken, nooit vooraf
            aangevinkt): het versturen van herinneringen of marketingberichten.
          </li>
        </ul>

        <h2 className="text-2xl">Bewaartermijn</h2>
        <p>
          Gegevens worden niet langer bewaard dan noodzakelijk voor de hierboven genoemde doelen en de
          wettelijke bewaarplicht.
        </p>

        <h2 className="text-2xl">Delen met derden</h2>
        <p>
          Gegevens worden niet verkocht of gedeeld met derden, behalve met partijen die noodzakelijk
          zijn om de dienstverlening te leveren (zoals de hostingpartij en de partij die
          bevestigingsmails verstuurt), en uitsluitend voor dat doel.
        </p>

        <h2 className="text-2xl">Jouw rechten</h2>
        <p>
          Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen.
          Neem hiervoor contact op via{" "}
          <a href={`mailto:${site.email}`} className="text-gold-600 hover:text-gold-700">
            {site.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
