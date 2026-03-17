import { MetadataRoute } from 'next';
import { query } from "@/shared/lib/db";
import { Kot, Vestiging } from "@/types";
import { siteConfig } from "@/shared/lib/config";

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.company.url;

    const [koten, vestigingen] = await Promise.all([
        query<Kot>("select id, created_at, updated_at from koten where status = 'published' and archived_at is null"),
        query<Vestiging>("select id, updated_at from vestigingen where archived_at is null"),
    ]);

    const kotEntries = koten.map((kot) => ({
        url: `${baseUrl}/koten/${kot.id}`,
        lastModified: new Date(kot.updated_at || kot.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const vestigingEntries = vestigingen.map((v) => ({
        url: `${baseUrl}/vestigingen/${v.id}`,
        lastModified: new Date(v.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/koten`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/vestigingen`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacybeleid`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/algemene-voorwaarden`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...vestigingEntries,
        ...kotEntries,
    ];
}

