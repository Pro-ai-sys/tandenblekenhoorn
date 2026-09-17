import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const server = await supabaseServer();
  const {
    data: { user },
  } = await server.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const admin = supabaseAdmin();
  const { data: allowlisted } = await admin
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!allowlisted)
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const body = await req.json();
  const { notes, last_treatment_date, tooth_shade } = body;

  const { error } = await admin
    .from("customers")
    .update({ notes, last_treatment_date, tooth_shade })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
