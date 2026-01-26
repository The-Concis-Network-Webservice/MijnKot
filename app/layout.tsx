import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { I18nProvider } from "../components/providers/i18n-provider";

const inter = Inter({
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
  title: "Mijn-Kot | Student Housing Belgium",
  description:
    "Quality student housing across Belgium. Trusted by students and families."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interBody.variable}`}>
      <body>
        <I18nProvider>
          <div className="min-h-screen flex flex-col bg-surface-main">
            <SiteNav />
            <main className="flex-1 pt-20">{children}</main>
            <SiteFooter />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}


