import { getFaqItems } from "@/shared/lib/queries";
import { FaqList } from "@/shared/ui/faq-list";
import { JsonLd } from "@/shared/ui/json-ld";
import { siteConfig } from "@/shared/lib/config";
import type { Metadata } from "next";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Veelgestelde vragen',
  description: 'Antwoorden op veelgestelde vragen over het huren van een studentenkot bij Mijn-Kot in Leuven: contracten, borg, huurprijs, bezichtigingen en meer.',
  alternates: { canonical: 'https://mijn-kot.be/faq' },
};

export default async function FaqPage() {
  const items = await getFaqItems();

  const faqJsonLd = items.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "url": `${siteConfig.company.url}/faq`,
    "name": "Veelgestelde vragen - Mijn-Kot",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      }
    }))
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <FaqList items={items} />
    </div>
  );
}


