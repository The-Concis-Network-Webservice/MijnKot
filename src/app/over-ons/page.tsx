import { JsonLd } from '@/shared/ui/json-ld';
import { getSiteSettings, getVestigingen } from '@/shared/lib/queries';
import { Metadata } from 'next';
import { OverOnsContent } from './_components/over-ons-content';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const domain = settings?.contact_domain || 'mijn-kot.be';
  return {
    title: 'Over Ons',
    description: 'Leer meer over Mijn-Kot: kwalitatieve studentenhuisvesting in Leuven. Direct huren van de eigenaar, brandveilig gecertificeerd, en voorzien van het KU Leuven Kotlabel.',
    alternates: {
      canonical: `https://${domain}/over-ons`
    }
  };
}

export default async function OverOnsPage() {
  const settings = await getSiteSettings();
  const vestigingen = await getVestigingen();
  const domain = settings?.contact_domain || 'mijn-kot.be';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Over Mijn-Kot",
    "description": "Mijn-Kot biedt kwalitatieve studentenhuisvesting in Leuven, direct van de eigenaar.",
    "url": `https://${domain}/over-ons`,
    "publisher": {
      "@type": "Organization",
      "name": "Mijn-Kot",
      "logo": `https://${domain}/logo.png`
    }
  };

  return (
    <main className="min-h-screen bg-surface-subtle">
      <JsonLd data={schemaData} />
      <OverOnsContent vestigingen={vestigingen} />
    </main>
  );
}
