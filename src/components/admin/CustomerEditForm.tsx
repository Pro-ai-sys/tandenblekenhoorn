"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
};

export function CustomerEditForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [notes, setNotes] = useState(customer.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, notes }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Opslaan is niet gelukt.");
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Weet je zeker dat je ${customer.name} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`
      )
    ) {
      return;
    }
    setDeleting(true);
    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "DELETE",
    });
    setDeleting(false);

    if (res.ok) {
      router.push("/admin/klanten");
      router.refresh();
    } else {
      setError("Verwijderen is niet gelukt.");
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-4 rounded-2xl border border-gold-200/60 bg-white p-6"
    >
      <h2 className="font-serif text-lg text-ink-900">Klantgegevens</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
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
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Telefoonnummer
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-ink-700">
        Opmerkingen
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-gold-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold-700 disabled:opacity-60"
          >
            {saving ? "Opslaan…" : "Opslaan"}
          </button>
          {saved && (
            <span className="text-sm text-green-600">Opgeslagen ✓</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
        >
          {deleting ? "Bezig…" : "Klant verwijderen"}
        </button>
      </div>
    </form>
  );
}
