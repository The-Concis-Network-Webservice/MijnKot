import { query, queryOne } from "./db";
import type { Kot, KotPhoto, SiteSettings, Vestiging, FaqItem } from "../types";

export async function getSiteSettings() {
  return queryOne<SiteSettings>("select * from site_settings limit 1");
}

export async function getFaqItems() {
  return query<FaqItem>(
    "select * from faq_items order by category asc, order_index asc"
  );
}

export async function getVestigingen() {
  return query<Vestiging>("select * from vestigingen where archived_at is null");
}

export async function getLatestKoten(limit = 6) {
  const koten = await query<Kot>(
    "select * from koten where availability_status = 'available' and status = 'published' and archived_at is null order by created_at desc limit $1",
    [limit]
  );
  if (koten.length === 0) return [];
  const ids = koten.map((k) => k.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
  const photos = await query<KotPhoto>(
    `select * from kot_photos where kot_id in (${placeholders})`,
    ids
  );
  const byKot = new Map<string, KotPhoto[]>();
  photos.forEach((photo) => {
    const list = byKot.get(photo.kot_id) ?? [];
    list.push(photo);
    byKot.set(photo.kot_id, list);
  });
  return koten.map((kot) => ({
    ...kot,
    kot_photos: byKot.get(kot.id) ?? []
  })) as Array<Kot & { kot_photos: KotPhoto[] }>;
}

export async function getAllKoten() {
  const koten = await query<Kot>(
    "select * from koten where status = 'published' and archived_at is null order by created_at desc"
  );
  if (koten.length === 0) return [];
  const ids = koten.map((k) => k.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
  const photos = await query<KotPhoto>(
    `select * from kot_photos where kot_id in (${placeholders})`,
    ids
  );
  const byKot = new Map<string, KotPhoto[]>();
  photos.forEach((photo) => {
    const list = byKot.get(photo.kot_id) ?? [];
    list.push(photo);
    byKot.set(photo.kot_id, list);
  });
  return koten.map((kot) => ({
    ...kot,
    kot_photos: byKot.get(kot.id) ?? []
  })) as Array<Kot & { kot_photos: KotPhoto[] }>;
}


