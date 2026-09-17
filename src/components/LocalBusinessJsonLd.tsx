import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: site.name,
        image: `${site.url}/images/tandenblekenhoorn.jpg`,
        url: site.url,
        telephone: site.phone,
        email: site.email,
        priceRange: "€€",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.streetAddress,
          addressLocality: site.address.addressLocality,
          postalCode: site.address.postalCode,
          addressRegion: site.address.addressRegion,
          addressCountry: site.address.addressCountry,
        },
        areaServed: site.areasServed.map((name) => ({ "@type": "City", name })),
      }}
    />
  );
}
