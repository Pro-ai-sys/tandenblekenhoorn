"use client";

import { useEffect, useMemo, useState } from "react";
import { TREATMENTS, type TreatmentType, isTreatmentType } from "@/lib/booking";

type Slot = { time: string; startsAt: string };

function todayDateStr(): string {
  const now = new Date();
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(now);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function BookingWizard({ initialType }: { initialType?: string }) {
  const [treatmentType, setTreatmentType] = useState<TreatmentType>(
    initialType && isTreatmentType(initialType) ? initialType : "single"
  );
  const [date, setDate] = useState(() => addDays(todayDateStr(), 1));
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  const minDate = useMemo(() => addDays(todayDateStr(), 0), []);
  const maxDate = useMemo(() => addDays(todayDateStr(), 60), []);

  useEffect(() => {
    setSelectedSlot(null);
    setSlots(null);
    setError(null);

    let cancelled = false;
    setLoadingSlots(true);
    fetch(`/api/availability?type=${treatmentType}&date=${date}`)
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Kon beschikbare tijden niet ophalen. Probeer het opnieuw.");
          setSlots([]);
          return;
        }
        setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Kon beschikbare tijden niet ophalen. Probeer het opnieuw.");
          setSlots([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [treatmentType, date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatmentType,
          startsAt: selectedSlot.startsAt,
          name,
          email,
          phone,
          marketingConsent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Boeken is niet gelukt.");
        if (res.status === 409) {
          setSelectedSlot(null);
          setSlots((prev) => prev?.filter((s) => s.startsAt !== selectedSlot.startsAt) ?? null);
        }
        return;
      }
      setConfirmedAt(selectedSlot.startsAt);
    } catch {
      setError("Boeken is niet gelukt. Controleer je internetverbinding en probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedAt) {
    const when = new Intl.DateTimeFormat("nl-NL", {
      timeZone: "Europe/Amsterdam",
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(confirmedAt));

    return (
      <div className="rounded-2xl border border-gold-200 bg-white p-8 text-center">
        <h2 className="font-serif text-2xl text-ink-900">Aanvraag ontvangen!</h2>
        <p className="mt-3 text-ink-700">
          Je tijdslot op <strong>{when}</strong> staat gereserveerd. Je ontvangt een bevestigingsmail,
          en Paula neemt via WhatsApp contact op om de aanbetaling van €20,- via Tikkie te regelen.
          Zodra deze betaald is, is je afspraak definitief.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <h2 className="font-serif text-xl text-ink-900">1. Kies je behandeling</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Object.entries(TREATMENTS).map(([key, t]) => (
            <button
              type="button"
              key={key}
              onClick={() => setTreatmentType(key as TreatmentType)}
              className={`rounded-xl border p-4 text-left transition ${
                treatmentType === key
                  ? "border-gold-600 bg-gold-50 ring-1 ring-gold-600"
                  : "border-gold-200 bg-white hover:border-gold-400"
              }`}
            >
              <p className="font-semibold text-ink-900">{t.label}</p>
              <p className="text-sm text-ink-500">{t.description}</p>
              <p className="mt-1 text-xs text-ink-500">±{t.realMinutes} min</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-ink-900">2. Kies een datum</h2>
        <p className="mt-1 text-sm text-ink-500">
          Online boekbaar op donderdag (hele dag) en maandag t/m donderdag in de avond. Voor overige
          tijden: neem telefonisch contact op.
        </p>
        <input
          type="date"
          value={date}
          min={minDate}
          max={maxDate}
          onChange={(e) => setDate(e.target.value)}
          className="mt-3 rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
        />
      </div>

      <div>
        <h2 className="font-serif text-xl text-ink-900">3. Kies een tijd</h2>
        <div className="mt-4">
          {loadingSlots && <p className="text-sm text-ink-500">Beschikbare tijden laden…</p>}
          {!loadingSlots && error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!loadingSlots && !error && slots && slots.length === 0 && (
            <p className="text-sm text-ink-500">
              Geen online beschikbare tijden op deze dag. Kies een andere datum, of neem telefonisch
              contact op voor overige tijden.
            </p>
          )}
          {!loadingSlots && !error && slots && slots.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot.startsAt}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    selectedSlot?.startsAt === slot.startsAt
                      ? "border-gold-600 bg-gold-600 text-white"
                      : "border-gold-300 bg-white text-ink-900 hover:border-gold-500"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedSlot && (
        <div>
          <h2 className="font-serif text-xl text-ink-900">4. Jouw gegevens</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm text-ink-700 sm:col-span-2">
              Naam
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-700">
              E-mailadres
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-700">
              Telefoonnummer
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
              />
            </label>
          </div>
          <label className="mt-4 flex items-start gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5"
            />
            Ik ontvang graag af en toe een herinnering of aanbieding per e-mail (niet verplicht).
          </label>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 rounded-full bg-gold-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-gold-700 disabled:opacity-60"
          >
            {submitting ? "Bezig met boeken…" : "Bevestig aanvraag"}
          </button>
          <p className="mt-3 text-xs text-ink-500">
            Na het versturen ontvang je een bevestigingsmail. Paula regelt de aanbetaling van €20,-
            via Tikkie persoonlijk via WhatsApp.
          </p>
        </div>
      )}
    </form>
  );
}
