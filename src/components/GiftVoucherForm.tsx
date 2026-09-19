"use client";

import { useState } from "react";

const AMOUNTS = [25, 50, 75, 100];

export function GiftVoucherForm() {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const finalAmount = customAmount ? Number(customAmount) : amount;

    const res = await fetch("/api/gift-vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: finalAmount,
        buyerName,
        buyerEmail,
        buyerPhone,
        recipientName,
        message,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Aanvraag versturen is niet gelukt.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-gold-200 bg-white p-8 text-center">
        <h2 className="font-serif text-2xl text-ink-900">
          Aanvraag ontvangen!
        </h2>
        <p className="mt-3 text-ink-700">
          Bedankt voor je aanvraag. Paula neemt via WhatsApp of e-mail contact
          met je op om de betaling en levering van de cadeaubon te regelen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-ink-900">Kies een bedrag</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a);
                setCustomAmount("");
              }}
              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                !customAmount && amount === a
                  ? "border-gold-600 bg-gold-50 text-ink-900"
                  : "border-gold-200 bg-white text-ink-700 hover:border-gold-400"
              }`}
            >
              €{a}
            </button>
          ))}
        </div>
        <label className="mt-3 flex flex-col gap-1.5 text-sm text-ink-700">
          Of vul een ander bedrag in
          <input
            type="number"
            min={5}
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="bijv. 60"
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-ink-700">
        Naam ontvanger (optioneel)
        <input
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-ink-700">
        Persoonlijk bericht (optioneel)
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-ink-700 sm:col-span-2">
          Jouw naam
          <input
            required
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          E-mailadres
          <input
            required
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-ink-700">
          Telefoonnummer
          <input
            required
            type="tel"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gold-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-gold-700 disabled:opacity-60"
      >
        {submitting ? "Bezig…" : "Cadeaubon aanvragen"}
      </button>
    </form>
  );
}
