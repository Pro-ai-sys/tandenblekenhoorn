"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingHistoryItem = {
  id: string;
  treatment_type: string;
  starts_at: string;
  status: string;
  tooth_shade: string | null;
};

export function BookingShadeHistory({
  bookings,
}: {
  bookings: BookingHistoryItem[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(bookings.map((b) => [b.id, b.tooth_shade ?? ""]))
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  async function save(id: string) {
    setSavingId(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tooth_shade: values[id] }),
    });
    setSavingId(null);
    router.refresh();
  }

  if (bookings.length === 0) {
    return <p className="text-sm text-ink-500">Geen boekingen gevonden.</p>;
  }

  return (
    <div className="space-y-2">
      {bookings.map((b) => (
        <div
          key={b.id}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-gold-200/60 bg-white p-3 text-sm"
        >
          <span className="w-32 text-ink-700">
            {new Intl.DateTimeFormat("nl-NL", {
              timeZone: "Europe/Amsterdam",
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(b.starts_at))}
          </span>
          <span className="w-20 capitalize text-ink-700">
            {b.treatment_type}
          </span>
          <span className="w-28 text-ink-500">{b.status}</span>
          <input
            type="text"
            value={values[b.id]}
            onChange={(e) =>
              setValues((v) => ({ ...v, [b.id]: e.target.value }))
            }
            placeholder="Tandkleur"
            className="w-24 rounded-lg border border-gold-300 px-2 py-1.5 text-sm text-ink-900"
          />
          <button
            type="button"
            disabled={savingId === b.id}
            onClick={() => save(b.id)}
            className="rounded-full bg-gold-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gold-700 disabled:opacity-60"
          >
            {savingId === b.id ? "..." : "Opslaan"}
          </button>
        </div>
      ))}
    </div>
  );
}
