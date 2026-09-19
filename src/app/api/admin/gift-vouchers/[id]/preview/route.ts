import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateGiftVoucherPdf } from "@/lib/giftVoucherPdf";

export async function GET(
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

  const pdfBytes = await generateGiftVoucherPdf({
    amount: voucher.amount,
    recipientName: voucher.recipient_name,
    occasion: voucher.occasion,
    message: voucher.message,
    voucherCode: voucher.voucher_code ?? "-",
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
