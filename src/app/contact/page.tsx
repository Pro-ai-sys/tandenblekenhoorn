import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Neem contact op met ${site.name} in het centrum van Hoorn.`,
};

export default function ContactPage() {
  const fullAddress = `${site.address.streetAddress}, ${site.address.postalCode} ${site.address.addressLocality}`;
  const mapQuery = encodeURIComponent(fullAddress);

  return (
    <div className="container-page max-w-2xl py-16">
      <h1 className="font-serif text-4xl text-ink-900">Contact</h1>
      <p className="mt-4 text-ink-700">
        Liever meteen een tijdslot boeken? Ga naar{" "}
        <Link href="/boeken" className="text-gold-600 hover:text-gold-700">
          de boekingspagina
        </Link>
        . Voor overige vragen kun je op de volgende manieren contact opnemen:
      </p>
      <div className="mt-8 space-y-3 text-ink-900">
        <p>
          <span className="font-semibold">E-mail: </span>
          <a
            href={`mailto:${site.email}`}
            className="text-gold-600 hover:text-gold-700"
          >
            {site.email}
          </a>
        </p>
        <p>
          <span className="font-semibold">Telefoon / WhatsApp: </span>
          <a
            href={`tel:${site.phone}`}
            className="text-gold-600 hover:text-gold-700"
          >
            {site.phoneDisplay}
          </a>
        </p>
        <p>
          <span className="font-semibold">Locatie: </span>
          {fullAddress} — gratis parkeren voor de deur.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gold-200/60 shadow-sm">
        <iframe
          title="Locatie Golden Smile op Google Maps"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          width="100%"
          height="320"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
