import { getSiteSettings } from "@/shared/lib/queries";
import { ContactView } from "@/shared/ui/contact-view";
import type { Metadata } from "next";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Neem contact op met Mijn-Kot voor vragen over studentenkoten in Leuven. Bereikbaar via e-mail, telefoon of het contactformulier.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Mijn-Kot',
    description: 'Neem contact op met Mijn-Kot voor vragen over studentenkoten in Leuven.',
    type: 'website',
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 bg-white min-h-[calc(100vh-80px)]">
      <ContactView settings={settings} />
    </div>
  );
}


