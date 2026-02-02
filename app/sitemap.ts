import { MetadataRoute } from 'next';
import { query } from '../lib/db';
import { Kot } from '../types';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Base URL
    const baseUrl = 'https://mijn-kot.be'; // Replace with real domain

    // Get all active koten
    const koten = await query<Kot>("select id, created_at from koten where status = 'published' and archived_at is null");

    const kotEntries = koten.map((kot) => ({
        url: `${baseUrl}/koten/${kot.id}`,
        lastModified: new Date(kot.created_at || new Date()), // Or updated_at if available
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/vestigingen`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...kotEntries,
    ];
}
