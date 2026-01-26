import { getLatestKoten, getSiteSettings, getVestigingen } from "../lib/queries";
import { KotCard } from "../components/kot-card";
import { VestigingCard } from "../components/vestiging-card";
import { HeroSection } from "../components/hero-section";
import { RentalOptions } from "../components/rental-options";
import { SectionHeader } from "../components/section-header";
import { HomeEmptyState } from "../components/home-components";

export const runtime = 'edge';

export default async function HomePage() {
  const [settings, vestigingen, latestKoten] = await Promise.all([
    getSiteSettings(),
    getVestigingen(),
    getLatestKoten(6)
  ]);

  return (
    <div>
      <HeroSection settings={settings} />

      <RentalOptions />

      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          title="home.sections.latest"
          description="home.sections.latest_desc"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestKoten.map((kot) => (
            <KotCard key={kot.id} kot={kot} />
          ))}
        </div>
        {latestKoten.length === 0 && <HomeEmptyState />}
      </section>

      <section className="py-20 bg-surface-subtle border-y border-border-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            title="home.sections.locations"
            description="home.sections.locations_desc"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vestigingen.map((vestiging) => (
              <VestigingCard key={vestiging.id} vestiging={vestiging} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
