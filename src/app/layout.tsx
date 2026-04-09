import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Switch to Outfit for display
import Script from "next/script";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteNav } from "@/shared/ui/site-nav";
import { I18nProvider } from "@/shared/ui/providers/i18n-provider";
import { getVestigingen, getSiteSettings } from "@/shared/lib/queries";
import { LeadCaptureModal } from "@/shared/ui/lead-capture-modal";
import { JsonLd } from "@/shared/ui/json-ld";

import { siteConfig } from "@/shared/lib/config";

export const runtime = 'edge';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const interBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.company.url),
  title: {
    template: `%s | ${siteConfig.company.name}`,
    default: `${siteConfig.company.name} | Studentenkoten in Leuven`,
  },
  description: `Op zoek naar een studentenkot in Leuven? ${siteConfig.company.name} biedt hoogwaardige studentenkamers en studio's in het centrum en Heverlee. Direct contact met eigenaar, eerlijke prijs.`,
  keywords: ['studentenkot', 'kot huren Leuven', 'studentenkamer Leuven', 'studio huren Leuven', 'kot Leuven centrum', 'studentenhuisvesting Leuven', 'Erasmus kamer Leuven'],
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    siteName: siteConfig.company.name,
    url: siteConfig.company.url,
  },
  alternates: {
    canonical: siteConfig.company.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const vestigingen = await getVestigingen();
  const settings = await getSiteSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": `${siteConfig.company.url}/#organization`,
        "name": siteConfig.company.name,
        "legalName": siteConfig.company.legalName,
        "url": siteConfig.company.url,
        "logo": `${siteConfig.company.url}/favicon.png`,
        "description": `${siteConfig.company.name} biedt kwalitatieve studentenkoten en studio's in Leuven. Actief sinds 1991. Direct contact met eigenaar, geen bemiddelingskosten. Beschikbaar voor academiejaar, semester en Erasmus-verblijven.`,
        "address": {
          "@type": "PostalAddress",
          ...(siteConfig.company.address.street ? { "streetAddress": siteConfig.company.address.street } : {}),
          "addressLocality": siteConfig.company.address.city,
          "postalCode": siteConfig.company.address.postalCode,
          "addressCountry": "BE"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": siteConfig.company.contact.email,
          ...(siteConfig.company.contact.phone ? { "telephone": siteConfig.company.contact.phone } : {}),
          "availableLanguage": ["Dutch", "English"]
        },
        "areaServed": {
          "@type": "City",
          "name": "Leuven"
        },
        "sameAs": [
          siteConfig.company.social.instagram,
          siteConfig.company.social.facebook,
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.company.url}/#website`,
        "url": siteConfig.company.url,
        "name": siteConfig.company.name,
        "publisher": { "@id": `${siteConfig.company.url}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteConfig.company.url}/koten?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="nl" className={`${outfit.variable} ${interBody.variable}`}>
      <body suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
        <JsonLd data={organizationJsonLd} />
        <I18nProvider>
          <div className="min-h-screen flex flex-col bg-surface-main">
            <SiteNav vestigingen={vestigingen} settings={settings} />
            <main className="flex-1 pt-20">{children}</main>
            <SiteFooter settings={settings} />
            <LeadCaptureModal />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}

