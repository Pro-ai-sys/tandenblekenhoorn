import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Confirms the current request is signed in via Supabase Auth AND listed
 * in the admins allowlist table. Used by every admin-only API route
 * before touching bookings/customers with the service-role client.
 */
export async function requireAdmin() {
  try {
    const server = await supabaseServer();
    const {
      data: { user },
    } = await server.auth.getUser();

    if (!user) {
      return { ok: false as const, status: 401 as const, message: "Niet ingelogd." };
    }

    const admin = supabaseAdmin();
    const { data: allowlisted } = await admin
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!allowlisted) {
      return { ok: false as const, status: 403 as const, message: "Geen toegang." };
    }

    return { ok: true as const, user };
  } catch (err) {
    console.error("requireAdmin failed", err);
    return { ok: false as const, status: 500 as const, message: "Supabase is niet geconfigureerd." };
  }
}
