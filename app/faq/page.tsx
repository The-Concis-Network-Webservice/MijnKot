import { getFaqItems } from "../../lib/queries";
import { FaqList } from "../../components/faq-list";

export const dynamic = 'force-dynamic';

export default async function FaqPage() {
  const items = await getFaqItems();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <FaqList items={items} />
    </div>
  );
}

