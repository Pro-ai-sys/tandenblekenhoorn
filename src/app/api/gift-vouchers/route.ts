import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

function resendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function generateVoucherCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);

  if (
    !json ||
    typeof json.buyerName !== "string" ||
    typeof json.buyerEmail !== "string" ||
    typeof json.buyerPhone !== "string" ||
    typeof json.amount !== "number" ||
    json.amount < 5
  ) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data: voucher, error } = await supabase
    .from("gift_vouchers")
    .insert({
      buyer_name: json.buyerName,
      buyer_email: json.buyerEmail,
      buyer_phone: json.buyerPhone,
      recipient_name: json.recipientName || null,
      amount: json.amount,
      occasion: json.occasion || null,
      message: json.message || null,
      voucher_code: generateVoucherCode(),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Opslaan is niet gelukt." },
      { status: 500 }
    );
  }

  const resend = resendClient();
  if (resend) {
    const from =
      process.env.EMAIL_FROM ?? `${site.name} <boekingen@${site.domain}>`;
    const adminTo = (process.env.EMAIL_ADMIN_TO ?? site.email)
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    await resend.emails.send({
      from,
      to: json.buyerEmail,
      subject: `Je cadeaubon-aanvraag bij ${site.name}`,
      text: [
        `Beste ${json.buyerName},`,
        "",
        `We hebben je aanvraag ontvangen voor een cadeaubon van €${json.amount},-.`,
        `Paula neemt via WhatsApp of e-mail contact met je op om de betaling te regelen. Zodra deze is voldaan, ontvang je de digitale cadeaubon per e-mail.`,
        "",
        `Tot snel bij ${site.name}!`,
        site.owner,
      ].join("\n"),
    });

    await resend.emails.send({
      from,
      to: adminTo,
      subject: `Nieuwe cadeaubon-aanvraag: €${json.amount},-`,
      text: [
        `Nieuwe cadeaubon-aanvraag:`,
        "",
        `Bedrag: €${json.amount},-`,
        `Voor: ${json.recipientName || "(niet opgegeven)"}`,
        `Bericht: ${json.message || "(geen)"}`,
        "",
        `Koper: ${json.buyerName}`,
        `E-mail: ${json.buyerEmail}`,
        `Telefoon: ${json.buyerPhone}`,
        "",
        `Ga naar het admin-scherm om de cadeaubon te versturen zodra deze betaald is.`,
      ].join("\n"),
    });
  }

  return NextResponse.json({ id: voucher.id }, { status: 201 });
}
