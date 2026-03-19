import { getAllKoten, getVestigingen, getRentTypes } from "@/shared/lib/queries";
import { KotCard } from "@/shared/ui/kot-card";
import { OverviewHeader, OverviewEmptyState, LocationFilter, RentTypeFilter } from "@/shared/ui/overview-components";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function KotenPage({
    searchParams,
}: {
    searchParams: { vestiging?: string; type?: string };
}) {
    const [allKoten, vestigingen, rentTypes] = await Promise.all([
        getAllKoten(searchParams.type),
        getVestigingen(),
        getRentTypes(),
    ]);

    let filteredKoten = allKoten;

    if (searchParams.vestiging) {
        filteredKoten = allKoten.filter(k => k.vestiging_id === searchParams.vestiging);
    }

    return (
        <div>
            <OverviewHeader
                filterButtons={
                    <>
                        <LocationFilter
                            vestigingen={vestigingen}
                            currentVestiging={searchParams.vestiging}
                            currentType={searchParams.type}
                        />
                        <RentTypeFilter
                            rentTypes={rentTypes}
                            currentType={searchParams.type}
                            currentVestiging={searchParams.vestiging}
                        />
                    </>
                }
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredKoten.map((kot) => (
                        <KotCard key={kot.id} kot={kot} />
                    ))}
                </div>

                {filteredKoten.length === 0 && <OverviewEmptyState />}
            </div>
        </div>
    );
}

