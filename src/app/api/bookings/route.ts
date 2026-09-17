import { NextRequest, NextResponse } from "next/server";
import { TREATMENTS } from "@/lib/booking";
import { bookingRequestSchema } from "@/lib/validation";
import { findOrCreateCustomer } from "@/lib/customers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendBookingEmails } from "@/lib/email";

/**
 * POST /api/bookings — hoofdstuk 4, stappen 3-5.
 * Inserting the booking row IS the "tijdelijk op slot zetten": the
 * exclusion constraint in the database (see supabase/migrations/0001_init.sql)
 * atomically rejects a conflicting insert, so two visitors can never claim
 * the same slot even if they submit at the same moment.
 */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ongeldige aanvraag." },
      { status: 400 }
    );
  }

  const { treatmentType, startsAt, name, email, phone, marketingConsent } = parsed.data;
  const startDate = new Date(startsAt);
  if (Number.isNaN(startDate.getTime()) || startDate.getTime() < Date.now()) {
    return NextResponse.json({ error: "Dit tijdslot ligt in het verleden." }, { status: 400 });
  }

  const endsAt = new Date(startDate.getTime() + TREATMENTS[treatmentType].totalMinutes * 60_000);

  let supabase: ReturnType<typeof supabaseAdmin>;
  try {
    supabase = supabaseAdmin();
  } catch (err) {
    console.error("supabaseAdmin unavailable", err);
    return NextResponse.json({ error: "Boeken is momenteel niet beschikbaar." }, { status: 503 });
  }

  let customerId: string;
  try {
    const customer = await findOrCreateCustomer(supabase, { name, email, phone });
    customerId = customer.id;
  } catch (err) {
    console.error("findOrCreateCustomer failed", err);
    return NextResponse.json({ error: "Kon klantgegevens niet opslaan." }, { status: 500 });
  }

  if (marketingConsent) {
    await supabase.from("customers").update({ marketing_consent: true }).eq("id", customerId);
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      customer_id: customerId,
      treatment_type: treatmentType,
      starts_at: startDate.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "nieuw",
      source: "online",
    })
    .select("id")
    .single();

  if (error) {
    // Postgres exclusion-constraint violation => the slot was just taken.
    if (error.code === "23P01") {
      return NextResponse.json(
        { error: "Dit tijdslot is helaas net door iemand anders geboekt. Kies een ander moment." },
        { status: 409 }
      );
    }
    console.error("booking insert failed", error);
    return NextResponse.json({ error: "Boeken is niet gelukt. Probeer het opnieuw." }, { status: 500 });
  }

  try {
    await sendBookingEmails({ treatmentType, startsAt: startDate.toISOString(), name, email, phone });
  } catch (err) {
    console.error("sendBookingEmails failed", err);
    // De boeking staat al vast; een mislukte mail mag de aanvraag niet blokkeren.
  }

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
