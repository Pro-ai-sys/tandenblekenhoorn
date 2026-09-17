import { site } from "@/lib/site";

export function UspList() {
  return (
    <section className="container-page py-16">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {site.usps.map((usp) => (
          <li
            key={usp}
            className="flex items-start gap-3 rounded-2xl border border-gold-200/60 bg-white p-5 shadow-sm"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
              ✓
            </span>
            <span className="text-sm text-ink-700">{usp}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
