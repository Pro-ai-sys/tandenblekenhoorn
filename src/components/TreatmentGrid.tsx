import Link from "next/link";
import { TREATMENTS } from "@/lib/booking";

export function TreatmentGrid() {
  return (
    <section className="bg-cream-100 py-16">
      <div className="container-page">
        <h2 className="font-serif text-3xl text-ink-900">Behandelingen</h2>
        <p className="mt-2 max-w-2xl text-ink-700">
          Alle behandelingen zonder peroxide-houdende bleekgels. Kies hieronder wat bij je past — de
          kalender bij het boeken toont automatisch alleen tijden die bij de duur van de behandeling
          passen.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {Object.entries(TREATMENTS).map(([key, t]) => (
            <div key={key} className="rounded-2xl border border-gold-200/60 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-xl text-ink-900">{t.label}</h3>
              <p className="mt-1 text-sm text-ink-500">{t.description}</p>
              <p className="mt-4 text-sm text-ink-700">Behandelduur: ±{t.realMinutes} minuten</p>
              <Link
                href={`/boeken?type=${key}`}
                className="mt-5 inline-block text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                Boek {t.label.toLowerCase()} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
