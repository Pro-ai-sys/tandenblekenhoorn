import { createBrowserClient } from "@supabase/ssr";

/** Browser-side Supabase client, used only for the admin login form. */
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase is niet geconfigureerd.");
  }

  return createBrowserClient(url, anonKey);
}
