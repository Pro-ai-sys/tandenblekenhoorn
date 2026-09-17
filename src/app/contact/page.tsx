import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Neem contact op met ${site.name} in het centrum van Hoorn.`,
};

export default function ContactPage() {
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
          <a href={`mailto:${site.email}`} className="text-gold-600 hover:text-gold-700">
            {site.email}
          </a>
        </p>
        <p>
          <span className="font-semibold">Telefoon / WhatsApp: </span>
          <a href={`tel:${site.phone}`} className="text-gold-600 hover:text-gold-700">
            {site.phoneDisplay}
          </a>
        </p>
        <p>
          <span className="font-semibold">Locatie: </span>
          Centrum Hoorn — gratis parkeren voor de deur.
        </p>
      </div>
    </div>
  );
}
