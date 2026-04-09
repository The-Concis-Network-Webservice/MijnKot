import { MetadataRoute } from 'next';
import { query } from '@/shared/lib/db';
import type { Kot, Vestiging } from '@/types';

export const runtime = 'edge';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mijn-kot.be';

/**
 * Static pages whose content changes rarely.
 * Use a real calendar date here - do NOT use new Date().
 * Update this date manually when you make meaningful content changes to these pages.
 */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/koten`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/vestigingen`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/faq`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/afspraken`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/privacybeleid`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/algemene-voorwaarden`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/cookie-instellingen`,
    lastModified: '2026-03-23',
  },
  {
    url: `${BASE_URL}/over-ons`,
    lastModified: '2026-03-30',
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Dynamic: published koten ---
  // Use updated_at so Google sees freshness signals when listings change price,
  // availability, or description - not just when they were first created.
  const koten = await query<Pick<Kot, 'id' | 'updated_at'>>(
    "SELECT id, updated_at FROM koten WHERE status = 'published' AND archived_at IS NULL"
  );

  const kotEntries: MetadataRoute.Sitemap = koten.map((kot) => ({
    url: `${BASE_URL}/koten/${kot.id}`,
    lastModified: kot.updated_at ? new Date(kot.updated_at).toISOString().split('T')[0] : '2026-03-23',
  }));

  // --- Dynamic: active vestigingen (location detail pages) ---
  // Each vestiging page has unique authored content + live inventory grid.
  // Only include non-archived vestigingen.
  const vestigingen = await query<Pick<Vestiging, 'id' | 'updated_at'>>(
    "SELECT id, updated_at FROM vestigingen WHERE archived_at IS NULL"
  );

  const vestigingEntries: MetadataRoute.Sitemap = vestigingen.map((v) => ({
    url: `${BASE_URL}/vestigingen/${v.id}`,
    lastModified: v.updated_at ? new Date(v.updated_at).toISOString().split('T')[0] : '2026-03-23',
  }));

  return [
    ...STATIC_PAGES,
    ...vestigingEntries,
    ...kotEntries,
  ];
}
