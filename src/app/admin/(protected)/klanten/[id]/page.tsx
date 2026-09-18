import { redirect, notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CustomerDetailTabs } from "@/components/admin/CustomerDetailTabs";

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

  const { data: photos } = await admin
    .from("customer_photos")
    .select("id, url, created_at")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl">
      <CustomerDetailTabs
        customer={customer}
        bookings={bookings ?? []}
        photos={photos ?? []}
      />
    </div>
  );
}
