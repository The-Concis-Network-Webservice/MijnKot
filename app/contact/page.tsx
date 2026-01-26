import { getSiteSettings } from "../../lib/queries";
import { ContactView } from "../../components/contact-view";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 bg-white min-h-[calc(100vh-80px)]">
      <ContactView settings={settings} />
    </div>
  );
}

