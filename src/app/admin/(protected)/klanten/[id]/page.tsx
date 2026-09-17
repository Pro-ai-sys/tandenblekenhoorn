import { redirect, notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CustomerEditForm } from "@/components/admin/CustomerEditForm";
import { BookingShadeHistory } from "@/components/admin/BookingShadeHistory";

export default async function KlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: customer } = await admin
    .from("customers")
    .select("id, name, email, phone, notes")
    .eq("id", id)
    .maybeSingle();

  if (!customer) notFound();

  const { data: bookings } = await admin
    .from("bookings")
    .select("id, treatment_type, starts_at, status, tooth_shade")
    .eq("customer_id", id)
    .order("starts_at", { ascending: false });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink-900">{customer.name}</h1>
        <p className="mt-1 text-sm text-ink-500">
          {customer.email} · {customer.phone}
        </p>
        <p className="mt-1 text-sm text-ink-500">
          Laatste behandeling:{" "}
          {bookings && bookings.length > 0
            ? new Intl.DateTimeFormat("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(bookings[0].starts_at))
            : "nog geen behandeling"}
        </p>
      </div>

      <CustomerEditForm customer={customer} />

      <section>
        <h2 className="mb-3 font-serif text-lg text-ink-900">
          Boekingsgeschiedenis &amp; tandkleur
        </h2>
        <BookingShadeHistory bookings={bookings ?? []} />
      </section>
    </div>
  );
}
