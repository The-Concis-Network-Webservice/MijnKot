import { notFound } from "next/navigation";
import { KotCard } from "@/shared/ui/kot-card";
import { query, queryOne } from "@/shared/lib/db";
import type { Kot, KotPhoto, Vestiging } from "@/types";
import MarkdownView from "@/shared/ui/markdown-view";
import { JsonLd } from "@/shared/ui/json-ld";
import { siteConfig } from "@/shared/lib/config";
import type { Metadata } from "next";


export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const vestiging = await queryOne<Vestiging>("select * from vestigingen where id = $1", [params.id]);

  if (!vestiging) return { title: 'Vestiging niet gevonden', robots: { index: false } };

  const title = `${vestiging.name} — Studentenkoten in ${vestiging.city}`;
  const description = `Bekijk beschikbare studentenkoten op ${vestiging.address}, ${vestiging.postal_code} ${vestiging.city}. Kwalitatieve kamers via ${siteConfig.company.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/vestigingen/${vestiging.id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: vestiging.image_url ? [{ url: vestiging.image_url }] : [],
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

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ApartmentComplex",
        "name": vestiging.name,
        "description": vestiging.description,
        "image": vestiging.image_url || undefined,
        "url": `${siteConfig.company.url}/vestigingen/${vestiging.id}`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": vestiging.address,
          "addressLocality": vestiging.city,
          "postalCode": vestiging.postal_code,
          "addressCountry": "BE"
        },
        "numberOfAvailableAccommodationUnits": koten.length,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.company.url },
          { "@type": "ListItem", "position": 2, "name": "Vestigingen", "item": `${siteConfig.company.url}/vestigingen` },
          { "@type": "ListItem", "position": 3, "name": vestiging.name, "item": `${siteConfig.company.url}/vestigingen/${vestiging.id}` },
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <JsonLd data={placeJsonLd} />
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
        {vestiging.image_url ? (
          <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-surface-subtle shadow-premium">
            <img
              src={vestiging.image_url}
              alt={vestiging.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video lg:aspect-square rounded-3xl bg-surface-subtle flex items-center justify-center text-text-muted border border-border-light">
            Geen afbeelding beschikbaar
          </div>
        )}
        
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-main leading-tight">
              {vestiging.name}
            </h1>
            <p className="text-xl text-primary-600 font-medium mt-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary-300"></span>
              {vestiging.address}, {vestiging.postal_code} {vestiging.city}
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-text-main flex-grow prose-p:leading-relaxed prose-headings:text-text-main prose-strong:text-text-main prose-ul:list-disc prose-ol:list-decimal">
            <MarkdownView content={vestiging.description || ""} />
          </div>
          
          <div className="mt-10 pt-8 border-t border-border-light">
            <p className="text-text-muted text-sm uppercase tracking-widest font-bold mb-4">
              Beschikbaar aanbod
            </p>
            <div className="text-3xl font-display font-bold text-text-main">
              {koten.length} {koten.length === 1 ? 'Vrij kot' : 'Vrije koten'}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-border-light">
        <h2 className="text-3xl font-display font-bold text-text-main mb-10 text-center">
          Kies jouw kamer in {vestiging.name}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {koten.map((kot) => (
          <KotCard
            key={kot.id}
            kot={{ ...kot, kot_photos: byKot.get(kot.id) ?? [] }}
          />
        ))}
      </div>
    </div>
  </div>
);
}

