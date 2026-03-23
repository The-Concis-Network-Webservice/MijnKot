'use client';

import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { SectionHeader } from "./section-header";

const activeBtn = 'bg-primary-600 text-white shadow-sm';
const inactiveBtn = 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600';
const btn = `px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-150 inline-flex items-center`;

type OverviewHeaderProps = {
    filterButtons: React.ReactNode;
};

export function OverviewHeader({ filterButtons }: OverviewHeaderProps) {

    return (
        <div className="bg-surface-subtle py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="overview.title"
                    description="overview.description"
                />
                {filterButtons}
            </div>
        </div>
    );
}

export function OverviewEmptyState() {
    const { t } = useTranslation();

    return (
        <div className="text-center py-20 bg-surface-subtle rounded-xl border border-border-light">
            <h3 className="text-xl font-semibold text-text-main mb-3">{t('overview.no_results_title')}</h3>
            <p className="text-text-secondary mb-6">{t('overview.no_results_desc')}</p>
            <a href="/koten" className="inline-flex items-center text-primary-600 font-medium hover:underline">{t('overview.back_to_all')}</a>
        </div>
    );
}

type RentTypeFilterProps = {
    rentTypes: Array<{ id: string; name: string; slug: string }>;
    currentType?: string;
    currentVestiging?: string;
};

export function RentTypeFilter({ rentTypes, currentType, currentVestiging }: RentTypeFilterProps) {
    if (rentTypes.length === 0) return null;
    const vestigingParam = currentVestiging ? `&vestiging=${currentVestiging}` : '';
    return (
        <div className="flex flex-wrap items-center gap-2 mt-3">
            <a
                href={`/koten${currentVestiging ? `?vestiging=${currentVestiging}` : ''}`}
                className={`${btn} ${!currentType ? activeBtn : inactiveBtn}`}
            >
                Alle
            </a>
            {rentTypes.map(rt => (
                <a
                    key={rt.id}
                    href={`/koten?type=${rt.slug}${vestigingParam}`}
                    className={`${btn} ${currentType === rt.slug ? activeBtn : inactiveBtn}`}
                >
                    {rt.name}
                </a>
            ))}
        </div>
    );
}

const PRICE_OPTIONS = [300, 400, 500, 600, 700, 800, 900];

type PriceFilterProps = {
    currentMin?: string;
    currentMax?: string;
};

export function PriceFilter({ currentMin, currentMax }: PriceFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const minVal = currentMin ? parseInt(currentMin) : null;
    const maxVal = currentMax ? parseInt(currentMax) : null;
    const invalid = minVal !== null && maxVal !== null && minVal >= maxVal;

    const update = (minPrice: string, maxPrice: string) => {
        const min = minPrice ? parseInt(minPrice) : null;
        const max = maxPrice ? parseInt(maxPrice) : null;
        // Skip navigation if min >= max (both set)
        if (min !== null && max !== null && min >= max) return;
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
        if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
        router.push(`/koten?${params.toString()}`);
    };

    const selectClass = `${btn} appearance-none pr-8 bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_10px_center]`;

    return (
        <div className="flex flex-wrap items-center gap-2 mt-3">
            <select
                value={currentMin ?? ""}
                onChange={(e) => update(e.target.value, currentMax ?? "")}
                className={`${selectClass} ${invalid ? "border-red-400 text-red-600 bg-red-50" : inactiveBtn}`}
            >
                <option value="">Min. prijs</option>
                {PRICE_OPTIONS.map(p => (
                    // Hide min options that are >= current max
                    <option key={p} value={p} disabled={maxVal !== null && p >= maxVal}>
                        € {p}
                    </option>
                ))}
            </select>
            <select
                value={currentMax ?? ""}
                onChange={(e) => update(currentMin ?? "", e.target.value)}
                className={`${selectClass} ${invalid ? "border-red-400 text-red-600 bg-red-50" : inactiveBtn}`}
            >
                <option value="">Max. prijs</option>
                {PRICE_OPTIONS.map(p => (
                    // Hide max options that are <= current min
                    <option key={p} value={p} disabled={minVal !== null && p <= minVal}>
                        € {p}
                    </option>
                ))}
            </select>
            {invalid && (
                <span className="text-xs text-red-500 font-medium">Min. moet lager zijn dan max.</span>
            )}
            {(currentMin || currentMax) && !invalid && (
                <button onClick={() => update("", "")} className={`${btn} ${inactiveBtn}`}>
                    ✕
                </button>
            )}
            {invalid && (
                <button onClick={() => update("", "")} className={`${btn} border border-red-200 text-red-500 hover:bg-red-50`}>
                    ✕ Wis
                </button>
            )}
        </div>
    );
}

type LocationFilterProps = {
    vestigingen: Array<{ id: string; name: string }>;
    currentVestiging?: string;
    currentType?: string;
};

export function LocationFilter({ vestigingen, currentVestiging, currentType }: LocationFilterProps) {
    const { t } = useTranslation();
    const typeParam = currentType ? `?type=${currentType}` : '';

    return (
        <div className="flex flex-wrap items-center gap-2 mb-2">
            <a
                href={`/koten${typeParam}`}
                className={`${btn} ${!currentVestiging ? activeBtn : inactiveBtn}`}
            >
                {t('overview.all_locations')}
            </a>
            {vestigingen.map(v => (
                <a
                    key={v.id}
                    href={`/koten?vestiging=${v.id}${currentType ? `&type=${currentType}` : ''}`}
                    className={`${btn} ${currentVestiging === v.id ? activeBtn : inactiveBtn}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
}
