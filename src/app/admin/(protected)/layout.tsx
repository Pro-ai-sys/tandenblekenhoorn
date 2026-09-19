import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="border-b border-gold-200/60 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <nav className="flex items-center gap-6 text-sm font-medium text-ink-700">
            <Link href="/admin" className="font-serif text-lg text-ink-900">
              Golden Smile — beheer
            </Link>
            <Link href="/admin" className="hover:text-gold-600">
              Boekingen
            </Link>
            <Link href="/admin/nieuw" className="hover:text-gold-600">
              Handmatige afspraak
            </Link>
            <Link href="/admin/klanten" className="hover:text-gold-600">
              Klanten
            </Link>
            <Link href="/admin/cadeaubonnen" className="hover:text-gold-600">
              Cadeaubonnen
            </Link>
          </nav>
          <SignOutButton />
        </div>
      </div>
      <div className="container-page py-10">{children}</div>
    </div>
  );
}
