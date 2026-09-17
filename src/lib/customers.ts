import type { SupabaseClient } from "@supabase/supabase-js";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Keeps only digits, and turns a leading "0" (NL trunk prefix) into "+31". */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("31")) return `+${digits}`;
  if (digits.startsWith("0")) return `+31${digits.slice(1)}`;
  return digits ? `+${digits}` : digits;
}

type CustomerInput = { name: string; email: string; phone: string };

/**
 * Besluit (hoofdstuk 6): een boeking wordt gekoppeld aan een bestaand
 * klantprofiel als e-mail of telefoonnummer al bekend is, in plaats van
 * een dubbel profiel aan te maken.
 */
export async function findOrCreateCustomer(
  supabase: SupabaseClient,
  input: CustomerInput
): Promise<{ id: string }> {
  const emailNormalized = normalizeEmail(input.email);
  const phoneNormalized = normalizePhone(input.phone);

  const { data: existing, error: lookupError } = await supabase
    .from("customers")
    .select("id")
    .or(`email_normalized.eq.${emailNormalized},phone_normalized.eq.${phoneNormalized}`)
    .limit(1)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    return { id: existing.id as string };
  }

  const { data: created, error: insertError } = await supabase
    .from("customers")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      email_normalized: emailNormalized,
      phone_normalized: phoneNormalized,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;

  return { id: created.id as string };
}
