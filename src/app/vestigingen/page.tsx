import { getVestigingen } from "@/shared/lib/queries";
import { Section } from "@/shared/ui/section";
import { VestigingCard } from "@/shared/ui/vestiging-card";
import { SectionHeader } from "@/shared/ui/section-header";


export const runtime = 'edge';

export default async function VestigingenPage() {
  const vestigingen = await getVestigingen();
  console.log("DEBUG: Fetched Vestigingen:", vestigingen.map(v => v.name));

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


