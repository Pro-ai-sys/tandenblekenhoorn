"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TREATMENTS, type TreatmentType } from "@/lib/booking";

export default function ManualBookingPage() {
  const router = useRouter();
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("single");
  const [datetime, setDatetime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const startsAt = new Date(datetime);
    if (Number.isNaN(startsAt.getTime())) {
      setError("Vul een geldige datum en tijd in.");
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/admin/bookings/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        treatmentType,
        startsAt: startsAt.toISOString(),
        name,
        email,
        phone,
        notes,
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Opslaan is niet gelukt.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl text-ink-900">Handmatige afspraak</h1>
      <p className="mt-2 text-sm text-ink-500">
        Voor aanvragen buiten de standaard boekingstijden (telefonisch, overdag doordeweeks,
        weekend). Deze afspraak wordt direct als bevestigd geregistreerd, zonder automatische
        mail/Tikkie-flow — regel de communicatie zelf apart.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Behandeling
          <select
            value={treatmentType}
            onChange={(e) => setTreatmentType(e.target.value as TreatmentType)}
            className="rounded-lg border border-gold-300 px-4 py-2.5"
          >
            {Object.entries(TREATMENTS).map(([key, t]) => (
              <option key={key} value={key}>
                {t.label} — {t.description}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Datum en tijd
          <input
            type="datetime-local"
            required
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Naam
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-ink-700">
            E-mailadres (optioneel)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gold-300 px-4 py-2.5"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-ink-700">
            Telefoon (optioneel)
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-gold-300 px-4 py-2.5"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Notitie (optioneel)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="rounded-lg border border-gold-300 px-4 py-2.5"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-700 disabled:opacity-60"
        >
          {submitting ? "Bezig…" : "Afspraak toevoegen"}
        </button>
      </form>
    </div>
  );
}
