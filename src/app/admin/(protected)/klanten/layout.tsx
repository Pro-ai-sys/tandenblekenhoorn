import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CustomerRoster } from "@/components/admin/CustomerRoster";

export default async function KlantenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const { data: customers } = await admin
    .from("customers")
    .select("id, name, email, phone")
    .order("name", { ascending: true });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden rounded-xl border border-gold-200/60 bg-white">
      <aside className="w-72 flex-shrink-0 border-r border-gold-200/60">
        <CustomerRoster customers={customers ?? []} />
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
