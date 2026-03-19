import { notFound } from "next/navigation";
import { KotCard } from "@/shared/ui/kot-card";
import { query, queryOne } from "@/shared/lib/db";
import type { Kot, KotPhoto, Vestiging } from "@/types";


export const runtime = 'edge';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-text-main">
          {vestiging.name}
        </h1>
        <p className="text-text-muted mt-2">
          {vestiging.address}, {vestiging.postal_code} {vestiging.city}
        </p>
        <p className="mt-4 text-text-main max-w-3xl">
          {vestiging.description}
        </p>
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

