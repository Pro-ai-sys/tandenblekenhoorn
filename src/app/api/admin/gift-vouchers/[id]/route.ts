import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const json = await request.json().catch(() => null);

  if (!json || typeof json !== "object") {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof json.status === "string") update.status = json.status;
  if (typeof json.amount === "number") update.amount = json.amount;
  if ("recipientName" in json) update.recipient_name = json.recipientName || null;
  if ("occasion" in json) update.occasion = json.occasion || null;
  if ("message" in json) update.message = json.message || null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Niets om bij te werken." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("gift_vouchers").update(update).eq("id", id);

  if (error) return NextResponse.json({ error: "Bijwerken is niet gelukt." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
