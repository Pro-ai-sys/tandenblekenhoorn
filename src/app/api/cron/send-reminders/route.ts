import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

function resendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function GET(request: NextRequest) {
  // Beveiliging: alleen Vercel's eigen cron-systeem mag dit aanroepen.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  const resend = resendClient();
  if (!resend) {
    return NextResponse.json(
      { error: "RESEND_API_KEY ontbreekt." },
      { status: 500 }
    );
  }

  const supabase = supabaseAdmin();

  // Haal alle klanten op met hun meest recente bevestigde boeking.
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "customer_id, starts_at, customers(id, name, email, last_reminder_sent_at)"
    )
    .eq("status", "bevestigd")
    .order("starts_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Per klant alleen de meest recente boeking bewaren.
  const latestByCustomer = new Map<
    string,
    {
      name: string;
      email: string;
      startsAt: string;
      lastReminderSentAt: string | null;
    }
  >();
  for (const b of bookings ?? []) {
    const customer = Array.isArray(b.customers) ? b.customers[0] : b.customers;
    if (!customer || !b.customer_id) continue;
    if (!latestByCustomer.has(b.customer_id)) {
      latestByCustomer.set(b.customer_id, {
        name: customer.name,
        email: customer.email,
        startsAt: b.starts_at,
        lastReminderSentAt: customer.last_reminder_sent_at,
      });
    }
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

  let sent = 0;

  for (const [customerId, info] of latestByCustomer) {
    const lastTreatment = new Date(info.startsAt);
    const dueForReminder = lastTreatment <= sixMonthsAgo;

    // Voorkom dat iemand elke dag opnieuw een mail krijgt: alleen versturen
    // als er nog nooit een herinnering is gestuurd, of de vorige meer dan
    // 5 maanden geleden was (dus niet elke cron-run opnieuw).
    const alreadyReminded =
      info.lastReminderSentAt &&
      new Date(info.lastReminderSentAt) >= fiveMonthsAgo;

    if (!dueForReminder || alreadyReminded) continue;

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `${site.name} <boekingen@${site.domain}>`,
      to: info.email,
      subject: `Tijd voor een opfrisser bij ${site.name}?`,
      text: [
        `Beste ${info.name},`,
        "",
        `Het is alweer een tijdje geleden dat je bij ${site.name} bent geweest voor een tanden bleek behandeling.`,
        `Wij adviseren om dit elk half jaar te herhalen voor het beste resultaat.`,
        "",
        `Boek eenvoudig een nieuw tijdslot via ${site.url}/boeken, of neem contact op via WhatsApp.`,
        "",
        `Tot snel!`,
        site.owner,
      ].join("\n"),
    });

    await supabase
      .from("customers")
      .update({ last_reminder_sent_at: new Date().toISOString().slice(0, 10) })
      .eq("id", customerId);

    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
