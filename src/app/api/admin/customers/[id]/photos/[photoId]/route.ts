import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { photoId } = await params;
  const supabase = supabaseAdmin();

  const { data: photo, error: fetchError } = await supabase
    .from("customer_photos")
    .select("url")
    .eq("id", photoId)
    .maybeSingle();

  if (fetchError || !photo) {
    return NextResponse.json({ error: "Foto niet gevonden." }, { status: 404 });
  }

  // Extraheer het pad binnen de bucket uit de public URL
  const urlParts = photo.url.split("/gebit-fotos/");
  const filePath = urlParts[1];

  if (filePath) {
    await supabase.storage.from("gebit-fotos").remove([filePath]);
  }

  const { error: deleteError } = await supabase
    .from("customer_photos")
    .delete()
    .eq("id", photoId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
