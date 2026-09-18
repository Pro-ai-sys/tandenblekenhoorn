import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id: customerId } = await params;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Geen bestand ontvangen." },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${customerId}/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("gebit-fotos")
    .upload(fileName, arrayBuffer, {
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from("gebit-fotos")
    .getPublicUrl(fileName);

  const { data: photo, error: insertError } = await supabase
    .from("customer_photos")
    .insert({ customer_id: customerId, url: publicUrlData.publicUrl })
    .select("id, url, created_at")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ photo }, { status: 201 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id: customerId } = await params;
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("customer_photos")
    .select("id, url, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ photos: data ?? [] });
}
