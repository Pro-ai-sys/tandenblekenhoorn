import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** POST met { email, action: "check" | "record" } */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  if (!json || typeof json.email !== "string" || !json.action) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const emailNormalized = normalizeEmail(json.email);
  const supabase = supabaseAdmin();
  const windowStart = new Date(
    Date.now() - WINDOW_MINUTES * 60_000
  ).toISOString();

  if (json.action === "check") {
    const { count, error } = await supabase
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("email_normalized", emailNormalized)
      .gte("attempted_at", windowStart);

    if (error) {
      // Bij een technische fout niet blokkeren, gewoon doorlaten.
      return NextResponse.json({ ok: true });
    }

    if ((count ?? 0) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error: `Te veel mislukte inlogpogingen. Probeer het over ${WINDOW_MINUTES} minuten opnieuw.`,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (json.action === "record") {
    await supabase
      .from("login_attempts")
      .insert({ email_normalized: emailNormalized });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
}
