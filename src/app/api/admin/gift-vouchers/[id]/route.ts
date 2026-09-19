import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const json = await request.json().catch(() => null);

  if (!json || typeof json.status !== "string") {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("gift_vouchers")
    .update({ status: json.status })
    .eq("id", id);

  if (error)
    return NextResponse.json(
      { error: "Bijwerken is niet gelukt." },
      { status: 500 }
    );

  return NextResponse.json({ ok: true });
}
