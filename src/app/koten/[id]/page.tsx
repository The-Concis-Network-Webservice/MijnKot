import { notFound } from "next/navigation";
import { PhotoGallery } from "@/shared/ui/photo-gallery";
import { StickySummary } from "@/shared/ui/sticky-summary";
import { DetailHeader, DetailAbout, DetailAttributes } from "@/shared/ui/detail-components";
import { queryOne, query } from "@/shared/lib/db";
import type { Kot, KotPhoto, Vestiging } from "@/types";

// Enable static generation for better performance
export const runtime = 'edge';
export const revalidate = 0; // Revalidate immediately

import { JsonLd } from "@/shared/ui/json-ld";

export default async function KotDetailPage({
  params
}: {
  params: { id: string };
}) {
  // Optimize: Single query to get kot + vestiging in one go
  const kot = await queryOne<Kot>(
    "select * from koten where id = $1",
    [params.id]
  );

  if (!kot || kot.status !== "published" || kot.archived_at) {
    notFound();
  }

  const vestiging = await queryOne<Vestiging>(
    "select * from vestigingen where id = $1",
    [kot.vestiging_id]
  );

  const photos = await query<KotPhoto>(
    "select * from kot_photos where kot_id = $1 order by order_index asc",
    [kot.id]
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "name": kot.title,
    "description": kot.description,
    "image": photos?.map(p => p.image_url) || [],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": vestiging?.address,
      "addressLocality": vestiging?.city,
      "postalCode": vestiging?.postal_code,
      "addressCountry": "BE"
    },
    "geo": { // If we had lat/long, we'd put it here.
      "@type": "GeoCoordinates",
      "latitude": 51.05, // Placeholder or remove if strictly unknown
      "longitude": 3.73
    },
    "numberOfRooms": 1,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": 20, // Example, ideally dynamic
      "unitCode": "MTK"
    },
    "offers": {
      "@type": "Offer",
      "price": kot.price,
      "priceCurrency": "EUR",
      "availability": kot.availability_status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
      <JsonLd data={jsonLd} />
      {/* Header - Not sticky on mobile to save space */}
      <div className="mb-6 lg:mb-10">
        <DetailHeader kot={kot} vestiging={vestiging} />
      </div>

      {/* Main Layout: Photo Gallery + Content | Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
        {/* Left Column: Photo Gallery + Content */}
        <div className="lg:col-span-2 space-y-8 lg:space-y-12">
          {/* Photo Gallery */}
          <PhotoGallery photos={photos ?? []} />

          {/* About Section */}
          <DetailAbout kot={kot} />

          {/* Attributes */}
          <DetailAttributes />

          {/* Additional sections can go here */}
        </div>

        {/* Right Column: Sticky Summary (Desktop) / Bottom Bar (Mobile) */}
        <div className="lg:col-span-1">
          <StickySummary kot={kot} vestiging={vestiging} />
        </div>
      </div>

      {/* Footer spacing to ensure sticky doesn't overlap */}
      <div className="mt-12 lg:mt-24" />
    </div>
  );
}

// Metadata for SEO
// Metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const kot = await queryOne<Kot>("select * from koten where id = $1", [params.id]);

  if (!kot) {
    return {
      title: 'Kot niet gevonden',
      robots: { index: false },
    };
  }

  const vestiging = await queryOne<Vestiging>("select * from vestigingen where id = $1", [kot.vestiging_id]);
  const photos = await query<KotPhoto>("select * from kot_photos where kot_id = $1 order by order_index asc limit 1", [kot.id]);
  const mainImage = photos && photos.length > 0 ? photos[0].image_url : null;

  const locationString = vestiging ? `in ${vestiging.city}` : 'te huur';
  const streetString = vestiging ? ` - ${vestiging.address}` : '';

  const title = `Kot te huur ${locationString}${streetString} | €${kot.price}`;
  const description = `Op zoek naar een kot ${locationString}? ${kot.title}. Prijs: €${kot.price} per maand. Bekijk foto's en plan direct een bezoek via Mijn-Kot.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: mainImage ? [{ url: mainImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  };
}
