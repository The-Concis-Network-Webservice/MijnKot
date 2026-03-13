import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Switch to Outfit for display
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteNav } from "@/shared/ui/site-nav";
import { I18nProvider } from "@/shared/ui/providers/i18n-provider";
import { getVestigingen, getSiteSettings } from "@/shared/lib/queries";
import { LeadCaptureModal } from "@/shared/ui/lead-capture-modal";
import { NoticeBanner } from "@/shared/ui/notice-banner";

import { siteConfig } from "@/shared/lib/config";

export const runtime = 'edge'; const outfit = Outfit({
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
    template: `%s | ${siteConfig.company.name} Studentenhuisvesting`,
    default: `${siteConfig.company.name} | Premium Studentenkoten in België`,
  },
  description: `Op zoek naar een studentenkot? ${siteConfig.company.name} biedt hoogwaardige studentenkamers en studio's in Gent, Antwerpen en Leuven. Direct contact met eigenaar.`,
  keywords: ['studentenkot', 'kot huren', 'studentenkamer', 'studio huren', 'Gent', 'Antwerpen', 'Leuven', 'studentenhuisvesting'],
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    siteName: siteConfig.company.name,
  },
  robots: {
    index: true,
    follow: true,
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

  return (
    <html lang="nl" className={`${outfit.variable} ${interBody.variable}`}>
      <body>
        <I18nProvider>
          <div className="min-h-screen flex flex-col bg-surface-main">
            <header className="sticky top-0 z-[100] w-full">
              <NoticeBanner 
                active={settings.notice_active} 
                text={settings.notice_text} 
              />
              <SiteNav 
                vestigingen={vestigingen} 
                settings={settings} 
              />
            </header>
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter settings={settings} />
            <LeadCaptureModal settings={settings} />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}

