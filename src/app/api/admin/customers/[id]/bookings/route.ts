import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { TREATMENTS, type TreatmentType, isTreatmentType } from "@/lib/booking";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id: customerId } = await params;
  const json = await request.json().catch(() => null);

  if (!json || typeof json.date !== "string") {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const treatmentType: TreatmentType = isTreatmentType(json.treatmentType)
    ? json.treatmentType
    : "single";
  const toothShade: string | null = json.toothShade || null;

  const startDate = new Date(`${json.date}T12:00:00`);
  if (Number.isNaN(startDate.getTime())) {
    return NextResponse.json({ error: "Ongeldige datum." }, { status: 400 });
  }
  const endsAt = new Date(
    startDate.getTime() + TREATMENTS[treatmentType].totalMinutes * 60_000
  );

  const supabase = supabaseAdmin();

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      customer_id: customerId,
      treatment_type: treatmentType,
      starts_at: startDate.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "bevestigd",
      source: "handmatig",
      tooth_shade: toothShade,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23P01") {
      return NextResponse.json(
        { error: "Dit tijdstip overlapt met een bestaande afspraak." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Opslaan is niet gelukt." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
