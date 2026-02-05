import { getVestigingen } from "@/shared/lib/queries";
import { Section } from "@/shared/ui/section";
import { VestigingCard } from "@/shared/ui/vestiging-card";


export const runtime = 'edge';

export default async function VestigingenPage() {
  const vestigingen = await getVestigingen();

  return (
    <Section
      title="Vestigingen"
      description="Explore all our locations and the koten they offer."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vestigingen.map((vestiging) => (
          <VestigingCard key={vestiging.id} vestiging={vestiging} />
        ))}
      </div>
    </Section>
  );
}


