import { MetadataRoute } from 'next';
import { siteConfig } from "@/shared/lib/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/sign/'],
        },
        sitemap: `${siteConfig.company.url}/sitemap.xml`,
    };
}
