import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const server = await supabaseServer();
  const {
    data: { user },
  } = await server.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const admin = supabaseAdmin();
  const { data: allowlisted } = await admin
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!allowlisted)
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const body = await req.json();
  const { name, email, phone, notes } = body;

  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (email !== undefined) update.email = email;
  if (phone !== undefined) update.phone = phone;
  if (notes !== undefined) update.notes = notes;

  if (email !== undefined)
    update.email_normalized = String(email).trim().toLowerCase();
  if (phone !== undefined) {
    const digits = String(phone).replace(/[^\d]/g, "");
    update.phone_normalized = digits.startsWith("31")
      ? `+${digits}`
      : digits.startsWith("0")
        ? `+31${digits.slice(1)}`
        : digits
          ? `+${digits}`
          : "";
  }

  const { error } = await admin.from("customers").update(update).eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const server = await supabaseServer();
  const {
    data: { user },
  } = await server.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const admin = supabaseAdmin();
  const { data: allowlisted } = await admin
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!allowlisted)
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  // Eerst de bijbehorende foto's uit Storage verwijderen (voorkomt achtergebleven bestanden).
  const { data: photos } = await admin
    .from("customer_photos")
    .select("url")
    .eq("customer_id", id);

  if (photos && photos.length > 0) {
    const paths = photos
      .map((p) => p.url.split("/gebit-fotos/")[1])
      .filter((p): p is string => Boolean(p));
    if (paths.length > 0) {
      await admin.storage.from("gebit-fotos").remove(paths);
    }
  }

  // Verwijdert de klant; customer_photos-rijen cascaden automatisch mee,
  // bookings.customer_id wordt op NULL gezet (boekingsgeschiedenis blijft bewaard).
  const { error } = await admin.from("customers").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
