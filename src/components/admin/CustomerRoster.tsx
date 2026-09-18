"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Customer = { id: string; name: string; email: string; phone: string };

export function CustomerRoster({ customers }: { customers: Customer[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gold-200/60 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          Klanten ({customers.length})
        </p>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoeken…"
          className="w-full rounded-lg border border-gold-300 px-3 py-2 text-sm text-ink-900"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map((c) => {
          const isActive = pathname === `/admin/klanten/${c.id}`;
          return (
            <Link
              key={c.id}
              href={`/admin/klanten/${c.id}`}
              className={`block rounded-lg px-3 py-2.5 transition ${
                isActive ? "bg-gold-100" : "hover:bg-gold-50"
              }`}
            >
              <p className="text-sm font-semibold text-ink-900">{c.name}</p>
              <p className="truncate text-xs text-ink-500">{c.email}</p>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="p-3 text-sm text-ink-500">Geen klanten gevonden.</p>
        )}
      </div>
    </div>
  );
}
