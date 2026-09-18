import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { UspList } from "@/components/UspList";
import { TreatmentGrid } from "@/components/TreatmentGrid";
import { WijkLinks } from "@/components/WijkLinks";
import { wijken } from "@/lib/site";

/**
 * SEO (hoofdstuk 8.3): losse landingspagina's per wijk/plaats, bijv.
 * /tanden-bleken-hoorn, /tanden-bleken-zwaag — één sjabloon, lichte
 * tekstvariatie per wijk. Alleen bekende wijk-slugs renderen; alles
 * anders geeft een normale 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return wijken.map((w) => ({ wijkSlug: w.slug }));
}

function findWijk(slug: string) {
  return wijken.find((w) => w.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ wijkSlug: string }>;
}): Promise<Metadata> {
  const { wijkSlug } = await params;
  const wijk = findWijk(wijkSlug);
  if (!wijk) return {};

  return {
    title: `Tanden bleken ${wijk.naam}`,
    description: `${wijk.intro} Boek eenvoudig online een tijdslot, zonder peroxide-houdende bleekgels.`,
    alternates: { canonical: `/${wijk.slug}` },
  };
}

export default async function WijkPage({
  params,
}: {
  params: Promise<{ wijkSlug: string }>;
}) {
  const { wijkSlug } = await params;
  const wijk = findWijk(wijkSlug);
  if (!wijk) notFound();

  return (
    <>
      <Hero
        eyebrow="Golden Smile — Tandenblekenhoorn.nl"
        title={`Tanden bleken in ${wijk.naam}`}
        subtitle={wijk.intro}
      />
      <UspList />
      <TreatmentGrid />
      <WijkLinks />
    </>
  );
}
