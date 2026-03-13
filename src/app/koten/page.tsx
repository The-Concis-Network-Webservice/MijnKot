import { getAllKoten, getVestigingen, getRentTypes } from "@/shared/lib/queries";
import type { Kot, RentType } from "@/types";
import { KotCard } from "@/shared/ui/kot-card";
import { OverviewHeader, OverviewEmptyState, LocationFilter } from "@/shared/ui/overview-components";

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
        getRentTypes()
    ]);

    let filteredKoten = allKoten;

    if (searchParams.vestiging) {
        filteredKoten = allKoten.filter((k: Kot) => k.vestiging_id === searchParams.vestiging);
    }

    return (
        <div>
            <OverviewHeader
                filterButtons={
                    <div className="space-y-4">
                        <LocationFilter
                            vestigingen={vestigingen}
                            currentVestiging={searchParams.vestiging}
                        />
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={`/koten${searchParams.vestiging ? `?vestiging=${searchParams.vestiging}` : ''}`}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    !searchParams.type
                                        ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                                        : "bg-white text-primary-800 hover:bg-surface-subtle border border-border-light hover:border-primary-400"
                                }`}
                            >
                                Alle Types
                            </a>
                            {rentTypes.map((rt: RentType) => (
                                <a
                                    key={rt.id}
                                    href={`/koten?type=${rt.slug}${searchParams.vestiging ? `&vestiging=${searchParams.vestiging}` : ''}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        searchParams.type === rt.slug
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                                            : "bg-white text-primary-800 hover:bg-surface-subtle border border-border-light hover:border-primary-400"
                                    }`}
                                >
                                    {rt.name}
                                </a>
                            ))}
                        </div>
                    </div>
                }
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredKoten.map((kot: Kot) => (
                        <KotCard key={kot.id} kot={kot} />
                    ))}
                </div>

                {filteredKoten.length === 0 && <OverviewEmptyState />}
            </div>
        </div>
    );
}

