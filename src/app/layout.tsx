import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Switch to Outfit for display
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteNav } from "@/shared/ui/site-nav";
import { I18nProvider } from "@/shared/ui/providers/i18n-provider";
import { getVestigingen } from "@/shared/lib/queries";
import { LeadCaptureModal } from "@/shared/ui/lead-capture-modal";

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
  metadataBase: new URL('https://mijn-kot.be'), // Replace with actual domain
  title: {
    template: '%s | Mijn-Kot Studentenhuisvesting',
    default: 'Mijn-Kot | Premium Studentenkoten in België',
  },
  description: 'Op zoek naar een studentenkot? Mijn-Kot biedt hoogwaardige studentenkamers en studio\'s in Gent, Antwerpen en Leuven. Direct contact met eigenaar.',
  keywords: ['studentenkot', 'kot huren', 'studentenkamer', 'studio huren', 'Gent', 'Antwerpen', 'Leuven', 'studentenhuisvesting'],
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    siteName: 'Mijn-Kot',
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

  return (
    <html lang="nl" className={`${outfit.variable} ${interBody.variable}`}>
      <body>
        <I18nProvider>
          <div className="min-h-screen flex flex-col bg-surface-main">
            <SiteNav vestigingen={vestigingen} />
            <main className="flex-1 pt-20">{children}</main>
            <SiteFooter />
            <LeadCaptureModal />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}

