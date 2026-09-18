import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TREATMENTS, isTreatmentType } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Boeking ontvangen",
  robots: { index: false },
};

function BevestigdContent({
  searchParams,
}: {
  searchParams: { when?: string; type?: string };
}) {
  const { when, type } = searchParams;

  const treatmentLabel =
    type && isTreatmentType(type) ? TREATMENTS[type].label : null;

  const whenLabel = when
    ? new Intl.DateTimeFormat("nl-NL", {
        timeZone: "Europe/Amsterdam",
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(when))
    : null;

  return (
    <div className="container-page max-w-2xl py-16">
      <div className="rounded-2xl border border-gold-200/60 bg-white p-8">
        <h1 className="font-serif text-3xl text-ink-900">Aanvraag ontvangen!</h1>
        <p className="mt-3 text-ink-700">
          {treatmentLabel && whenLabel ? (
            <>
              Je tijdslot voor <strong>{treatmentLabel}</strong> op{" "}
              <strong>{whenLabel}</strong> staat gereserveerd.
            </>
          ) : (
            "Je tijdslot staat gereserveerd."
          )}
        </p>

        <div className="mt-6 rounded-xl border border-gold-300 bg-gold-50 p-5">
          <p className="font-semibold text-ink-900">Aanbetaling via Tikkie</p>
          <p className="mt-2 text-sm text-ink-700">
            Paula stuurt je via WhatsApp een Tikkie van <strong>€20,-</strong>. Dit
            bedrag wordt in mindering gebracht op de kosten van je behandeling.
            Zodra de Tikkie betaald is, is je afspraak definitief bevestigd.
          </p>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            Let op: als de Tikkie niet op tijd wordt betaald, vervalt de
            gereserveerde afspraak.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-gold-200/60 bg-white p-5">
          <p className="font-semibold text-ink-900">Kenteken doorgeven</p>
          <p className="mt-2 text-sm text-ink-700">
            Geef vlak voor je behandeling je kenteken door via WhatsApp, zodat
            we deze vast kunnen zetten in de parkeer-app en je gratis kunt
            parkeren tijdens je bezoek.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-white hover:bg-gold-700"
          >
            Terug naar de homepage
          </Link>
          <a
            href="https://wa.me/31615060684"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gold-300 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-gold-50"
          >
            Open WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BevestigdPage({
  searchParams,
}: {
  searchParams: { when?: string; type?: string };
}) {
  return (
    <Suspense fallback={null}>
      <BevestigdContent searchParams={searchParams} />
    </Suspense>
  );
}
