import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { BookingsTable, type BookingRow } from "@/components/admin/BookingsTable";

export default async function AdminDashboardPage() {
  const server = await supabaseServer();
  const {
    data: { user },
  } = await server.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = supabaseAdmin();
  const { data: allowlisted } = await admin
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!allowlisted) redirect("/admin/login");

  const { data } = await admin
    .from("bookings")
    .select(
      "id, treatment_type, starts_at, status, source, notes, customer:customers(name, email, phone)"
    )
    .order("starts_at", { ascending: true });

  const bookings = (data ?? []) as unknown as BookingRow[];
  const upcoming = bookings.filter((b) => new Date(b.starts_at).getTime() >= Date.now() - 60 * 60_000);
  const past = bookings.filter((b) => new Date(b.starts_at).getTime() < Date.now() - 60 * 60_000);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-ink-900">Boekingen</h1>
        <p className="mt-1 text-sm text-ink-500">Ingelogd als {user.email}</p>
      </div>

      <section>
        <h2 className="mb-4 font-serif text-xl text-ink-900">Aankomend</h2>
        <BookingsTable bookings={upcoming} />
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl text-ink-900">Verleden</h2>
        <BookingsTable bookings={past.slice(0, 50)} />
      </section>
    </div>
  );
}
