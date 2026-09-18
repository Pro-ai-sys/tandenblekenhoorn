"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Eerst checken of dit e-mailadres niet is geblokkeerd door te veel mislukte pogingen.
    const checkRes = await fetch("/api/admin/login-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "check" }),
    });

    if (!checkRes.ok) {
      const data = await checkRes.json().catch(() => ({}));
      setError(data.error ?? "Te veel pogingen. Probeer het later opnieuw.");
      setLoading(false);
      return;
    }

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Mislukte poging registreren voor de rate-limiter.
      await fetch("/api/admin/login-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "record" }),
      });
      setError("Inloggen mislukt. Controleer je e-mailadres en wachtwoord.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gold-200/60 bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-2xl text-ink-900">
          Golden Smile — beheer
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Log in om boekingen te beheren.
        </p>

        <label className="mt-6 flex flex-col gap-1.5 text-sm text-ink-700">
          E-mailadres
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>
        <label className="mt-4 flex flex-col gap-1.5 text-sm text-ink-700">
          Wachtwoord
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-gold-300 px-4 py-2.5 text-ink-900"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-700 disabled:opacity-60"
        >
          {loading ? "Bezig…" : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
