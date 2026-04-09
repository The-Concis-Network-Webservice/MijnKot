import { notFound } from "next/navigation";
import { KotCard } from "@/shared/ui/kot-card";
import { DescriptionRenderer } from "@/shared/ui/description-renderer";
import { query, queryOne } from "@/shared/lib/db";
import { JsonLd } from "@/shared/ui/json-ld";
import { siteConfig } from "@/shared/lib/config";
import type { Kot, KotPhoto, Vestiging } from "@/types";
import type { Metadata } from "next";

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const vestiging = await queryOne<Vestiging>(
    "select * from vestigingen where id = $1",
    [params.id]
  );

  if (!vestiging) return { title: 'Locatie niet gevonden', robots: { index: false } };

  const title = `${vestiging.name} | Studentenkoten in ${vestiging.city}`;
  const description = vestiging.description
    ? vestiging.description.slice(0, 155).trimEnd() + (vestiging.description.length > 155 ? '…' : '')
    : `Bekijk beschikbare studentenkoten in ${vestiging.name}, ${vestiging.city}. Grondplannen, foto's en directe huurinfo bij Mijn-Kot.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.company.url}/vestigingen/${vestiging.id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      ...(vestiging.image_url ? { images: [{ url: vestiging.image_url }] } : {}),
    },
  };
}

export default async function VestigingDetailPage({
  params
}: {
  params: { id: string };
}) {
  const vestiging = await queryOne<Vestiging>(
    "select * from vestigingen where id = $1",
    [params.id]
  );

  if (!vestiging) {
    notFound();
  }

  const koten = await query<Kot>(
    "select * from koten where vestiging_id = $1 and availability_status = 'available' and status = 'published' and archived_at is null",
    [params.id]
  );
  const ids = koten.map((kot) => kot.id);
  const photos =
    ids.length > 0
      ? await query<KotPhoto>(
        `select * from kot_photos where kot_id in (${ids
          .map((_, i) => `$${i + 1}`)
          .join(",")})`,
        ids
      )
      : [];
  const byKot = new Map<string, KotPhoto[]>();
  photos.forEach((photo) => {
    const list = byKot.get(photo.kot_id) ?? [];
    list.push(photo);
    byKot.set(photo.kot_id, list);
  });

  const vestigingUrl = `${siteConfig.company.url}/vestigingen/${vestiging.id}`;

  const apartmentComplexJsonLd = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${vestigingUrl}#complex`,
    "url": vestigingUrl,
    "name": vestiging.name,
    "description": vestiging.description ?? undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": vestiging.address,
      "addressLocality": vestiging.city,
      "postalCode": vestiging.postal_code,
      "addressCountry": "BE"
    },
    "numberOfAvailableAccommodationUnits": {
      "@type": "QuantitativeValue",
      "value": koten.length,
    },
    "containsPlace": koten.map(kot => ({
      "@type": "Apartment",
      "@id": `${siteConfig.company.url}/koten/${kot.id}#apartment`,
      "url": `${siteConfig.company.url}/koten/${kot.id}`,
      "name": kot.title,
      "offers": {
        "@type": "Offer",
        "price": kot.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
      }
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.company.url },
      { "@type": "ListItem", "position": 2, "name": "Vestigingen", "item": `${siteConfig.company.url}/vestigingen` },
      { "@type": "ListItem", "position": 3, "name": vestiging.name, "item": vestigingUrl },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <JsonLd data={apartmentComplexJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-text-main">
          {vestiging.name}
        </h1>
        <p className="text-text-muted mt-2">
          {vestiging.address}, {vestiging.postal_code} {vestiging.city}
        </p>
        <div className="mt-6 max-w-2xl">
          <DescriptionRenderer text={vestiging.description ?? ''} textEn={vestiging.description_en} />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {koten.map((kot) => (
          <KotCard
            key={kot.id}
            kot={{ ...kot, kot_photos: byKot.get(kot.id) ?? [] }}
          />
        ))}
      </div>
    </div>
  );
}
