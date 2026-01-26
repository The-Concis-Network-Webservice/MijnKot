import { notFound } from "next/navigation";
import { PhotoGallery } from "../../../components/photo-gallery";
import { StickySummary } from "../../../components/sticky-summary";
import { DetailHeader, DetailAbout, DetailAttributes } from "../../../components/detail-components";
import { queryOne, query } from "../../../lib/db";
import type { Kot, KotPhoto, Vestiging } from "../../../types";

// Enable static generation for better performance
export const runtime = 'edge';
export const revalidate = 300; // Revalidate every 5 minutes

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
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
export async function generateMetadata({ params }: { params: { id: string } }) {
  const kot = await queryOne<Kot>("select * from koten where id = $1", [params.id]);

  if (!kot) {
    return {
      title: 'Kot niet gevonden',
    };
  }

  return {
    title: `${kot.title} - €${kot.price}/maand | Mijn-Kot`,
    description: kot.description?.substring(0, 160) || 'Studentenkamer te huur',
    openGraph: {
      title: kot.title,
      description: kot.description,
      type: 'website',
    },
  };
}
