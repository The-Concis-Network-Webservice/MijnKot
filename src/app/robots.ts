import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Explicit consent for AI search crawlers
                userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'GoogleOther'],
                allow: '/',
                disallow: ['/admin/', '/sign/', '/vestigingen/*/grondplan'],
            },
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/sign/', '/vestigingen/*/grondplan'],
            },
        ],
        sitemap: 'https://mijn-kot.be/sitemap.xml',
    };
}
