import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { manualBookingSchema } from "@/lib/validation";
import { TREATMENTS } from "@/lib/booking";
import { findOrCreateCustomer } from "@/lib/customers";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * POST — Paula plant zelf een afspraak buiten de standaard boekingstijden in
 * (hoofdstuk 5). Besluit: geen automatische mail/Tikkie-flow hiervoor — de
 * afspraak wordt direct als 'bevestigd' aangemaakt en Paula regelt contact
 * apart (telefonisch/WhatsApp).
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const json = await request.json().catch(() => null);
  const parsed = manualBookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ongeldige aanvraag." },
      { status: 400 }
    );
  }

  const { treatmentType, startsAt, name, email, phone, notes } = parsed.data;
  const startDate = new Date(startsAt);
  if (Number.isNaN(startDate.getTime())) {
    return NextResponse.json({ error: "Ongeldige datum/tijd." }, { status: 400 });
  }
  const endsAt = new Date(startDate.getTime() + TREATMENTS[treatmentType].totalMinutes * 60_000);

  const supabase = supabaseAdmin();

  let customerId: string | null = null;
  if (email || phone) {
    try {
      const customer = await findOrCreateCustomer(supabase, {
        name,
        email: email || "onbekend@onbekend.invalid",
        phone: phone || "",
      });
      customerId = customer.id;
    } catch (err) {
      console.error("findOrCreateCustomer (manual) failed", err);
    }
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      customer_id: customerId,
      treatment_type: treatmentType,
      starts_at: startDate.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "bevestigd",
      source: "handmatig",
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23P01") {
      return NextResponse.json({ error: "Dit tijdslot overlapt met een bestaande afspraak." }, { status: 409 });
    }
    console.error("manual booking insert failed", error);
    return NextResponse.json({ error: "Opslaan is niet gelukt." }, { status: 500 });
  }

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
