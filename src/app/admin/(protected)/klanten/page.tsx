import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function KlantenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const server = await supabaseServer();
  const {
    data: { user },
  } = await server.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = supabaseAdmin();
  const { data: allowlisted } = await admin
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!allowlisted) redirect("/admin/login");

  let query = admin
    .from("customers")
    .select("id, name, email, phone, last_treatment_date, tooth_shade")
    .order("name", { ascending: true });

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  const { data: customers } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ink-900">Klanten</h1>
        <p className="mt-1 text-sm text-ink-500">
          {customers?.length ?? 0} klanten
        </p>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Zoek op naam, e-mail of telefoon…"
          className="w-full max-w-sm rounded-lg border border-gold-300 px-4 py-2.5 text-sm text-ink-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-700"
        >
          Zoeken
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gold-200/60 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-gold-200/60 bg-gold-50 text-ink-700">
            <tr>
              <th className="px-4 py-3">Naam</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Telefoon</th>
              <th className="px-4 py-3">Laatste behandeling</th>
              <th className="px-4 py-3">Tandkleur</th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((c) => (
              <tr
                key={c.id}
                className="border-b border-gold-100 last:border-0 hover:bg-gold-50/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/klanten/${c.id}`}
                    className="font-medium text-ink-900 hover:text-gold-600"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-700">{c.email}</td>
                <td className="px-4 py-3 text-ink-700">{c.phone}</td>
                <td className="px-4 py-3 text-ink-700">
                  {c.last_treatment_date
                    ? new Intl.DateTimeFormat("nl-NL").format(
                        new Date(c.last_treatment_date)
                      )
                    : "—"}
                </td>
                <td className="px-4 py-3 text-ink-700">
                  {c.tooth_shade || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
