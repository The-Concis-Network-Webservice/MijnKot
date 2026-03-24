import { getVestigingen } from "@/shared/lib/queries";
import { Section } from "@/shared/ui/section";
import { VestigingCard } from "@/shared/ui/vestiging-card";
import { SectionHeader } from "@/shared/ui/section-header";
import type { Metadata } from "next";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Onze locaties in Leuven',
  description: 'Ontdek de gebouwen en locaties van Mijn-Kot in Leuven. Bekijk beschikbare kamers per locatie, grondplannen en foto\'s van onze studentenresidenties.',
  alternates: { canonical: 'https://mijn-kot.be/vestigingen' },
};

export default async function VestigingenPage() {
  const vestigingen = await getVestigingen();

  return (
    <Section>
      <SectionHeader
        title="vestigingen.title"
        description="vestigingen.description"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vestigingen.map((vestiging) => (
          <VestigingCard key={vestiging.id} vestiging={vestiging} />
        ))}
      </div>
    </Section>
  );
}


