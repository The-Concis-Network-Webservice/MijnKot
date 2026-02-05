import { getSiteSettings } from "@/shared/lib/queries";
import { ContactView } from "@/shared/ui/contact-view";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 bg-white min-h-[calc(100vh-80px)]">
      <ContactView settings={settings} />
    </div>
  );
}


