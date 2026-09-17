import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { statusUpdateSchema } from "@/lib/validation";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** PATCH — Paula wijzigt de status en/of tandkleur van een boeking. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const json = await request.json().catch(() => null);

  const update: Record<string, unknown> = {};

  if (json && typeof json === "object" && "tooth_shade" in json) {
    update.tooth_shade = json.tooth_shade;
  }

  if (json && typeof json === "object" && "status" in json) {
    const parsed = statusUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ongeldige status." }, { status: 400 });
    }
    update.status = parsed.data.status;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "Niets om bij te werken." },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("bookings").update(update).eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Bijwerken is niet gelukt." },
      { status: 500 }
    );
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
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "geannuleerd" })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Vrijgeven is niet gelukt." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
