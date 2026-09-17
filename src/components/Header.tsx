import Link from "next/link";
import { site } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/tanden-bleken-hoorn", label: "Tanden bleken" },
  { href: "/faq", label: "Veelgestelde vragen" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold-200/60 bg-cream-50/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide text-ink-900">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-700 transition hover:text-gold-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/boeken"
          className="rounded-full bg-gold-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-700"
        >
          Direct boeken
        </Link>
      </div>
    </header>
  );
}
