"use client";

import { useState } from "react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gold-200/60 rounded-2xl border border-gold-200/60 bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-ink-900">{item.question}</span>
              <span className="text-gold-600">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p className="px-6 pb-5 text-sm text-ink-700">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
