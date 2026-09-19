"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type GiftVoucherRow = {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  recipient_name: string | null;
  amount: number;
  occasion: string | null;
  message: string | null;
  status: "nieuw" | "betaald" | "verzonden" | "geannuleerd";
  voucher_code: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ["nieuw", "betaald", "verzonden", "geannuleerd"] as const;
const STATUS_LABELS: Record<string, string> = {
  nieuw: "Nieuw",
  betaald: "Betaald",
  verzonden: "Verzonden",
  geannuleerd: "Geannuleerd",
};

export function GiftVouchersTable({ vouchers }: { vouchers: GiftVoucherRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    await fetch(`/api/admin/gift-vouchers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function sendVoucher(id: string) {
    if (!confirm("Digitale cadeaubon versturen naar de koper?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/gift-vouchers/${id}/send`, { method: "POST" });
    setBusyId(null);
    if (!res.ok) {
      alert("Versturen is niet gelukt.");
      return;
    }
    router.refresh();
  }

  if (vouchers.length === 0) {
    return <p className="text-sm text-ink-500">Nog geen cadeaubon-aanvragen.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gold-200/60 bg-white">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-gold-200/60 bg-gold-50 text-ink-700">
          <tr>
            <th className="px-4 py-3">Datum</th>
            <th className="px-4 py-3">Koper</th>
            <th className="px-4 py-3">Voor</th>
            <th className="px-4 py-3">Bedrag</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actie</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v) => (
            <tr key={v.id} className="border-b border-gold-100 last:border-0">
              <td className="px-4 py-3">
                {new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(
                  new Date(v.created_at)
                )}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-ink-900">{v.buyer_name}</p>
                <p className="text-xs text-ink-500">
                  {v.buyer_email} · {v.buyer_phone}
                </p>
              </td>
              <td className="px-4 py-3">{v.recipient_name || "—"}</td>
              <td className="px-4 py-3 font-semibold">€{v.amount},-</td>
              <td className="px-4 py-3">
                <select
                  value={v.status}
                  disabled={busyId === v.id}
                  onChange={(e) => updateStatus(v.id, e.target.value)}
                  className="rounded-lg border border-gold-300 px-2 py-1.5 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`/api/admin/gift-vouchers/${v.id}/preview`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gold-300 px-4 py-1.5 text-xs font-semibold text-ink-700 hover:bg-gold-50"
                  >
                    Bekijk PDF
                  </a>
                  {v.status !== "verzonden" && (
                    <button
                      type="button"
                      disabled={busyId === v.id}
                      onClick={() => sendVoucher(v.id)}
                      className="rounded-full bg-gold-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gold-700 disabled:opacity-50"
                    >
                      Verstuur cadeaubon
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
