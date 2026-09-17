import Link from "next/link";
import { wijken } from "@/lib/site";

export function WijkLinks() {
  return (
    <section className="container-page py-16">
      <h2 className="font-serif text-3xl text-ink-900">Ook dichtbij jou</h2>
      <p className="mt-2 max-w-2xl text-ink-700">
        Golden Smile is goed bereikbaar vanuit Hoorn en de omliggende wijken en plaatsen.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {wijken.map((w) => (
          <Link
            key={w.slug}
            href={`/${w.slug}`}
            className="rounded-full border border-gold-300 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition hover:border-gold-500 hover:text-gold-700"
          >
            Tanden bleken {w.naam}
          </Link>
        ))}
      </div>
    </section>
  );
}
