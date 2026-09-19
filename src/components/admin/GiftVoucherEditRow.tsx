"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const OCCASIONS = ["Verjaardag", "Trouwen", "Bedankt", "Omdat ik van je hou", "Zomaar", "Anders"];

type Voucher = {
  id: string;
  amount: number;
  recipient_name: string | null;
  occasion: string | null;
  message: string | null;
};

export function GiftVoucherEditRow({ voucher }: { voucher: Voucher }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(voucher.amount);
  const [recipientName, setRecipientName] = useState(voucher.recipient_name ?? "");
  const [occasion, setOccasion] = useState(voucher.occasion ?? OCCASIONS[0]);
  const [message, setMessage] = useState(voucher.message ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/gift-vouchers/${voucher.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, recipientName, occasion, message }),
    });
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-gold-300 px-4 py-1.5 text-xs font-semibold text-ink-700 hover:bg-gold-50"
      >
        Bewerken
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="font-serif text-lg text-ink-900">Cadeaubon bewerken</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-ink-700">
            Bedrag
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="rounded-lg border border-gold-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-700">
            Naam ontvanger
            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="rounded-lg border border-gold-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-700 sm:col-span-2">
            Gelegenheid
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="rounded-lg border border-gold-300 px-3 py-2 text-sm"
            >
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-700 sm:col-span-2">
            Tekst op de cadeaubon
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="rounded-lg border border-gold-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-full bg-gold-600 px-5 py-2 text-sm font-semibold text-white hover:bg-gold-700 disabled:opacity-50"
          >
            {saving ? "Opslaan…" : "Opslaan"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-gold-300 px-5 py-2 text-sm font-semibold text-ink-700 hover:bg-gold-100"
          >
            Annuleren
          </button>
        </div>
      </div>
    </div>
  );
}
