"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BOOKING_STATUS_LABELS,
  TREATMENTS,
  type BookingStatus,
} from "@/lib/booking";

export type BookingRow = {
  id: string;
  treatment_type: "single" | "double" | "triple";
  starts_at: string;
  status: BookingStatus;
  source: "online" | "handmatig";
  notes: string | null;
  customer: { id: string; name: string; email: string; phone: string } | null;
};

const STATUS_OPTIONS: BookingStatus[] = [
  "nieuw",
  "wacht_op_betaling",
  "bevestigd",
  "verlopen",
  "geannuleerd",
];

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(id: string, status: BookingStatus) {
    setBusyId(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function releaseSlot(id: string) {
    if (!confirm("Dit tijdslot vrijgeven en de boeking annuleren?")) return;
    setBusyId(id);
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  if (bookings.length === 0) {
    return <p className="text-sm text-ink-500">Nog geen boekingen.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gold-200/60 bg-white">
      <table className="w-full min-w-[840px] text-left text-sm">
        <thead className="border-b border-gold-200/60 bg-gold-50 text-ink-700">
          <tr>
            <th className="px-4 py-3">Wanneer</th>
            <th className="px-4 py-3">Behandeling</th>
            <th className="px-4 py-3">Klant</th>
            <th className="px-4 py-3">Bron</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actie</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-gold-100 last:border-0">
              <td className="px-4 py-3">{formatWhen(b.starts_at)}</td>
              <td className="px-4 py-3">
                {TREATMENTS[b.treatment_type].label}
              </td>
              <td className="px-4 py-3">
                {b.customer ? (
                  <Link
                    href={`/admin/klanten/${b.customer.id}`}
                    className="block hover:text-gold-600"
                  >
                    <p className="font-medium text-ink-900">
                      {b.customer.name}
                    </p>
                    <p className="text-xs text-ink-500">
                      {b.customer.email} · {b.customer.phone}
                    </p>
                  </Link>
                ) : (
                  <span className="text-ink-500">—</span>
                )}
              </td>
              <td className="px-4 py-3 capitalize">{b.source}</td>
              <td className="px-4 py-3">
                <select
                  value={b.status}
                  disabled={busyId === b.id}
                  onChange={(e) =>
                    updateStatus(b.id, e.target.value as BookingStatus)
                  }
                  className="rounded-lg border border-gold-300 px-2 py-1.5 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {BOOKING_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                {b.status !== "geannuleerd" && (
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => releaseSlot(b.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    Slot vrijgeven
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
