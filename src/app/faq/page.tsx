import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { FaqAccordion } from "@/components/FaqAccordion";
import { faqItems } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden op veelgestelde vragen over tanden bleken bij Golden Smile in Hoorn: leeftijd, prijs, losse tand bleken en meer.",
};

export default function FaqPage() {
  return (
    <div className="container-page py-16">
      <h1 className="font-serif text-4xl text-ink-900">Veelgestelde vragen</h1>
      <p className="mt-3 max-w-2xl text-ink-700">
        Staat je vraag er niet bij? Neem gerust contact op via WhatsApp of
        e-mail.
      </p>
      <div className="mt-10 max-w-3xl">
        <FaqAccordion items={faqItems} />
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink-900">
          Gele tanden? Verkleurde tanden laten witten
        </h2>
        <h3 className="mt-6 font-serif text-lg text-ink-900">
          Waarom hebben sommige mensen gele of wittere tanden?
        </h3>
        <p className="mt-3 text-ink-700">
          Je tanden zijn gemaakt van tandbeen en daar overheen glazuur. De kleur
          en dikte van je tandbeen bepalen uiteindelijk de kleur van je tanden.
          Glazuur is vrijwel doorzichtig, dus de kleur van je tanden hangt af
          van de dikte van je tandbeen. De kleur van je tanden is erfelijk
          bepaald, en de een heeft meer gele of minder gele tanden dan de ander.
          De hoektanden zijn vaak meer geel dan de rest van de tanden, vanwege
          het dikkere tandbeen. Iedereen heeft zijn eigen gedachten over gele
          tanden; sommigen vinden het niet mooi staan en zouden kunnen besluiten
          om hun tanden te laten bleken. Dit is in de meeste gevallen mogelijk.
          Enkele jaren geleden kon je hiervoor alleen terecht bij een officiële
          tandarts, maar tegenwoordig is het mogelijk om zelf thuis wittere
          tanden te bleken. Je moet dan wel alle benodigde spullen aanschaffen,
          zoals een lamp en verschillende soorten gels, kwastjes, enzovoort. Dit
          kan al snel duur worden, aangezien je de spullen maar één keer
          gebruikt en daarna moet weggooien. Bij ons kun je gewoon even
          binnenlopen, je snel laten behandelen en 30 minuten later sta je weer
          buiten, zonder gele tanden maar met een mooi stralend wit gebit.
          Iedereen is welkom bij Golden Smile. Stap gerust binnen voor een
          gratis advies; je kunt alsnog besluiten het niet te doen, het gratis
          advies is geheel vrijblijvend en verplicht tot niets.
        </p>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink-900">Mooie witte tanden</h2>
        <h3 className="mt-2 font-serif text-lg text-ink-900">
          Tips voor een gezond gebit
        </h3>
        <p className="mt-3 text-ink-700">
          Tips voor een gezond, mooi en stralend gebit met witte tanden. Een
          mooi gebit wordt door veel mensen als erg belangrijk beschouwd, het
          geeft zelfvertrouwen en zorgt voor een verzorgde en schone
          uitstraling. Het is eigenlijk een visitekaartje van je
          persoonlijkheid. Hier zijn enkele tips om je gebit gezond te houden,
          want veel mensen vragen zich af &ldquo;hoe houd ik mijn gebit
          gezond?&rdquo;. Met een gezond en mooi gebit heb je een stralende
          lach. Een goede mondgezondheid bespaart je een hoop ellende bij de
          tandarts, omdat je gaatjes en kiespijn kunt voorkomen, en minder tijd
          hoeft door te brengen in de tandartspraktijk. Zorg met liefde voor je
          gebit, zodat je er je hele leven plezier van hebt. Lees de
          onderstaande tips om je gebit gezond, stralend wit en je hele leven
          lang gezond te houden.
        </p>

        <h3 className="mt-8 font-serif text-lg text-ink-900">
          Houd je gebit schoon!
        </h3>
        <p className="mt-2 text-ink-700">
          Leer jezelf simpele gewoontes aan dan blijven je tanden langer vitaal
          en je gebit gezond.
        </p>

        <ol className="mt-4 space-y-4 text-ink-700">
          <li>
            <strong className="text-ink-900">
              1) Gebruik tandpasta met fluoride
            </strong>
            <br />
            Fluoride versterkt je glazuur en helpt beschermen tegen
            zuuraanvallen. Je tanden worden minder kwetsbaar voor aanvallen van
            bacteriën.
          </li>
          <li>
            <strong className="text-ink-900">
              2) Tweemaal per dag tandenpoetsen
            </strong>
            <br />
            Dit beschermt tegen schadelijke tandplak. Tandplak veroorzaakt
            gaatjes door grotere concentraties bacteriën, en door poetsen
            blijven je tanden lekker fris en schoon.
          </li>
          <li>
            <strong className="text-ink-900">
              3) Poets twee minuten per poetsbeurt
            </strong>
            <br />
            Door tweemaal per dag te poetsen krijgen schadelijke bacteriën geen
            kans om zich echt aan je tanden te hechten, en kan de werkende stof
            in tandpasta goed zijn werk doen.
          </li>
          <li>
            <strong className="text-ink-900">4) Tandvlees schoon houden</strong>
            <br />
            Gebruik een kleine, zachte tandenborstel om aan de binnenkant en
            buitenkant waar je tandvlees begint zachtjes te poetsen. Hier
            ontstaat meestal tandplak en tandsteen, een broeinest van bacteriën
            die zich onderaan je tanden hecht. Door goed te poetsen voorkom je
            dit en gaat het vervelende ontstekingen tegen. Ben je serieus over
            de gezondheid van je tandvlees, verdiep je dan eens in de
            verschillende tandpasta&apos;s die er te koop zijn — er zijn
            speciale tandpasta&apos;s die helpen om je tandvlees gezond te
            houden.
          </li>
          <li>
            <strong className="text-ink-900">5) Poetsen</strong>
            <br />
            Begin onderin van buiten naar binnen en als laatste de kiezen, doe
            hetzelfde met het bovengebit.
          </li>
          <li>
            <strong className="text-ink-900">
              6) Neem een elektrische tandenborstel
            </strong>
            <br />
            Door de snelle poetsbewegingen, tot wel 13.000 per minuut, kun je
            hiermee goed de moeilijk bereikbare hoekjes reinigen. Tegenwoordig
            zijn ze al te koop vanaf €15,-.
          </li>
          <li>
            <strong className="text-ink-900">
              7) Flossen en tandenstokers
            </strong>
            <br />
            Hiermee reinig je tussen je tanden en kiezen en kom je op plekken
            waar de tandenborstel niet kan komen, en verwijder je alle
            etensresten. Dit voorkomt gaatjes en tandvleesontsteking. Je gebit
            blijft langer witter en het is een kleine moeite om na het eten even
            je tanden te flossen of te stoken.
          </li>
          <li>
            <strong className="text-ink-900">8) Mondwater</strong>
            <br />
            Mondwater is antibacterieel en helpt een slechte adem te voorkomen.
          </li>
          <li>
            <strong className="text-ink-900">9) Witte tanden</strong>
            <br />
            De witheid van je tanden is genetisch bepaald en hangt af van de
            dikte van je tandbeen. Hoektanden zijn daarom vaak geler, omdat dit
            sterke tanden zijn met dikker tandbeen. Door minder kleurstoffen te
            consumeren — die zitten onder andere in koffie, kerrie, Red Bull,
            thee — en door te stoppen met roken en te poetsen met speciale
            tandpasta, kunnen je tanden witter worden.
          </li>
          <li>
            <strong className="text-ink-900">
              10) Combineer het tandartsbezoek met de mondhygiënist
            </strong>
            <br />
            Zorg dat je bij je periodieke controle bij de tandartspraktijk eerst
            een bezoek kunt brengen bij de mondhygiënist en daarna naar de
            tandarts. Omdat de mondhygiënist het tandplak verwijdert, kan de
            tandarts beter en eerder eventuele gaatjes opsporen.
          </li>
        </ol>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </div>
  );
}
