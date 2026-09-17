"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabaseBrowser().auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-sm font-medium text-ink-500 hover:text-ink-900"
    >
      Uitloggen
    </button>
  );
}
