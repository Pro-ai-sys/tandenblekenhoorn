import Link from "next/link";
import Image from "next/image";

export function Hero({
  eyebrow,
  title,
  subtitle,
  ctaLabel = "Bekijk beschikbare tijden",
  ctaHref = "/boeken",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="container-page grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div className="animate-fade-up">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink-900 md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-700">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={ctaHref}
              className="rounded-full bg-gold-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-gold-700"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/faq"
              className="rounded-full border border-gold-300 px-7 py-3.5 text-sm font-semibold text-ink-900 transition hover:bg-gold-100"
            >
              Veelgestelde vragen
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl md:aspect-square">
          <Image
            src="/images/tandenblekenhoorn.jpg"
            alt="Behandelruimte Golden Smile in Hoorn"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
