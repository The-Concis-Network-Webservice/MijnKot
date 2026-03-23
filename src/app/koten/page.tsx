import { getAllKoten, getVestigingen, getRentTypes } from "@/shared/lib/queries";
import { KotCard } from "@/shared/ui/kot-card";
import { OverviewHeader, OverviewEmptyState, LocationFilter, RentTypeFilter, PriceFilter } from "@/shared/ui/overview-components";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function KotenPage({
    searchParams,
}: {
    searchParams: { vestiging?: string; type?: string; minPrice?: string; maxPrice?: string };
}) {
    const [allKoten, vestigingen, rentTypes] = await Promise.all([
        getAllKoten(searchParams.type),
        getVestigingen(),
        getRentTypes(),
    ]);

    let filteredKoten = allKoten;

    if (searchParams.vestiging) {
        filteredKoten = filteredKoten.filter(k => k.vestiging_id === searchParams.vestiging);
    }
    if (searchParams.minPrice) {
        const min = parseFloat(searchParams.minPrice);
        if (!isNaN(min)) filteredKoten = filteredKoten.filter(k => k.price >= min);
    }
    if (searchParams.maxPrice) {
        const max = parseFloat(searchParams.maxPrice);
        if (!isNaN(max)) filteredKoten = filteredKoten.filter(k => k.price <= max);
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
                        <PriceFilter
                            currentMin={searchParams.minPrice}
                            currentMax={searchParams.maxPrice}
                        />
                    </>
                }
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
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

