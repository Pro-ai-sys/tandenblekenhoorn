import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { statusUpdateSchema } from "@/lib/validation";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** PATCH — Paula wijzigt de status van een boeking (bijv. naar 'bevestigd' na betaalde Tikkie). */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = statusUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige status." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("bookings").update({ status: parsed.data.status }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Bijwerken is niet gelukt." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE — een tijdelijk geblokkeerd slot handmatig vrijgeven wanneer de
 * Tikkie niet (op tijd) betaald wordt (hoofdstuk 4 & 5). Zet de status op
 * 'geannuleerd' in plaats van de rij te verwijderen, zodat de historie
 * bewaard blijft.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const supabase = supabaseAdmin();
  const { error } = await supabase.from("bookings").update({ status: "geannuleerd" }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Vrijgeven is niet gelukt." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
