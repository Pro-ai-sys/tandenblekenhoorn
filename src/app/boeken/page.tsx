import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/BookingWizard";

export const metadata: Metadata = {
  title: "Boek een tijdslot",
  description:
    "Boek eenvoudig online een tijdslot voor tanden bleken bij Golden Smile in Hoorn.",
};

export default async function BoekenPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-serif text-4xl text-ink-900">Boek je afspraak</h1>
      <p className="mt-3 text-ink-700">
        Kies je behandeling en een tijdslot dat jou uitkomt. Het slot wordt
        direct voor je gereserveerd zodra je de aanvraag verstuurt.
      </p>
      <p className="mt-2 text-sm text-ink-500">
        Andere tijden overdag zijn ook mogelijk — neem dan contact op via{" "}
        <a
          href="tel:0615060684"
          className="font-semibold text-gold-600 hover:text-gold-700"
        >
          06-15060684
        </a>{" "}
        of{" "}
        <a
          href="https://wa.me/31615060684"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gold-600 hover:text-gold-700"
        >
          WhatsApp
        </a>{" "}
        om een afspraak te maken.
      </p>
      <div className="mt-10">
        <Suspense fallback={null}>
          <BookingWizard initialType={type} />
        </Suspense>
      </div>
    </div>
  );
}
