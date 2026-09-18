"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TREATMENTS, type TreatmentType } from "@/lib/booking";

export function QuickAddTreatment({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [treatmentType, setTreatmentType] = useState<TreatmentType>("single");
  const [toothShade, setToothShade] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/customers/${customerId}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, treatmentType, toothShade }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Opslaan is niet gelukt.");
      return;
    }

    setOpen(false);
    setDate("");
    setToothShade("");
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-gold-600 px-5 py-2 text-sm font-semibold text-white hover:bg-gold-700"
      >
        + Behandeling toevoegen
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gold-200/60 bg-white p-5"
    >
      <h3 className="font-serif text-lg text-ink-900">Behandeling toevoegen</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Datum
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-gold-300 px-3 py-2 text-ink-900"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Behandeling
          <select
            value={treatmentType}
            onChange={(e) => setTreatmentType(e.target.value as TreatmentType)}
            className="rounded-lg border border-gold-300 px-3 py-2 text-ink-900"
          >
            {Object.entries(TREATMENTS).map(([key, t]) => (
              <option key={key} value={key}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Tandkleur
          <input
            type="text"
            value={toothShade}
            onChange={(e) => setToothShade(e.target.value)}
            placeholder="bijv. A2"
            className="rounded-lg border border-gold-300 px-3 py-2 text-ink-900"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gold-600 px-5 py-2 text-sm font-semibold text-white hover:bg-gold-700 disabled:opacity-60"
        >
          {saving ? "Opslaan…" : "Opslaan"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-gold-300 px-5 py-2 text-sm font-semibold text-ink-700 hover:bg-gold-50"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
