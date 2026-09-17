import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gold-200/60 bg-cream-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-ink-900">{site.name}</p>
          <p className="mt-2 text-sm text-ink-500">{site.tagline}</p>
        </div>
        <div className="text-sm text-ink-700">
          <p className="font-semibold text-ink-900">Contact</p>
          <p className="mt-2">
            <a href={`mailto:${site.email}`} className="hover:text-gold-600">
              {site.email}
            </a>
          </p>
          <p>
            <a href={`tel:${site.phone}`} className="hover:text-gold-600">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
        <div className="text-sm text-ink-700">
          <p className="font-semibold text-ink-900">Meer</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/faq" className="hover:text-gold-600">
                Veelgestelde vragen
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gold-600">
                Privacyverklaring
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-gold-600">
                Inloggen (Paula)
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold-200/60 py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} {site.name} — {site.domain}
      </div>
    </footer>
  );
}
