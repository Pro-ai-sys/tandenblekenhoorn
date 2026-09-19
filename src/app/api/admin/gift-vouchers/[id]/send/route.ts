import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";
import { generateGiftVoucherPdf } from "@/lib/giftVoucherPdf";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const supabase = supabaseAdmin();

  const { data: voucher, error } = await supabase
    .from("gift_vouchers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !voucher) {
    return NextResponse.json(
      { error: "Cadeaubon niet gevonden." },
      { status: 404 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY ontbreekt." },
      { status: 500 }
    );
  }
  const resend = new Resend(apiKey);

  const pdfBytes = await generateGiftVoucherPdf({
    amount: voucher.amount,
    recipientName: voucher.recipient_name,
    occasion: voucher.occasion,
    message: voucher.message,
    voucherCode: voucher.voucher_code ?? "-",
  });

  const from =
    process.env.EMAIL_FROM ?? `${site.name} <boekingen@${site.domain}>`;

  await resend.emails.send({
    from,
    to: voucher.buyer_email,
    subject: `Je cadeaubon van ${site.name}`,
    text: [
      `Beste ${voucher.buyer_name},`,
      "",
      `Bedankt voor je betaling! Hierbij je digitale cadeaubon als bijlage.`,
      `Je kunt deze doorsturen of printen om cadeau te geven.`,
      "",
      `Tot snel bij ${site.name}!`,
      site.owner,
    ].join("\n"),
    attachments: [
      {
        filename: `cadeaubon-${voucher.voucher_code ?? id}.pdf`,
        content: Buffer.from(pdfBytes),
      },
    ],
  });

  await supabase
    .from("gift_vouchers")
    .update({ status: "verzonden" })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
