"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Customer = {
  id: string;
  notes: string | null;
};

export function CustomerEditForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [notes, setNotes] = useState(customer.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-4 rounded-2xl border border-gold-200/60 bg-white p-6"
    >
      <h2 className="font-serif text-lg text-ink-900">Opmerkingen</h2>

      <label className="flex flex-col gap-1.5 text-sm text-ink-700">
        Opmerkingen
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gold-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold-700 disabled:opacity-60"
        >
          {saving ? "Opslaan…" : "Opslaan"}
        </button>
        {saved && <span className="text-sm text-green-600">Opgeslagen ✓</span>}
      </div>
    </form>
  );
}
