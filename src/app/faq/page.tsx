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
        Staat je vraag er niet bij? Neem gerust contact op via WhatsApp of e-mail.
      </p>
      <div className="mt-10 max-w-3xl">
        <FaqAccordion items={faqItems} />
      </div>
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
