import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { GiftVouchersTable } from "@/components/admin/GiftVouchersTable";

export default async function CadeaubonnenPage() {
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

  const { data: vouchers } = await admin
    .from("gift_vouchers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-ink-900">Cadeaubonnen</h1>
      <GiftVouchersTable vouchers={vouchers ?? []} />
    </div>
  );
}
