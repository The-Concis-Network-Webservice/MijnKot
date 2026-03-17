import { getFaqItems } from "@/shared/lib/queries";
import { FaqList } from "@/shared/ui/faq-list";
import { JsonLd } from "@/shared/ui/json-ld";
import type { Metadata } from "next";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen',
  description: 'Antwoorden op de meest gestelde vragen over het huren van een studentenkot bij Mijn-Kot in Leuven. Contracten, prijzen, beschikbaarheid en meer.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Veelgestelde Vragen | Mijn-Kot',
    description: 'Antwoorden op de meest gestelde vragen over het huren van een studentenkot bij Mijn-Kot in Leuven.',
    type: 'website',
  },
};

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export default async function FaqPage() {
  const items = await getFaqItems();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripMarkdown(item.answer)
      }
    }))
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <JsonLd data={faqJsonLd} />
      <FaqList items={items} />
    </div>
  );
}


