'use client';

import { useTranslation } from 'react-i18next';
import { SectionHeader } from "./section-header";

const activeBtn = 'bg-primary-600 text-white shadow-sm';
const inactiveBtn = 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600';
const btn = `px-5 py-2 rounded-xl text-sm font-medium transition-all duration-150`;

type OverviewHeaderProps = {
    filterButtons: React.ReactNode;
};

export function OverviewHeader({ filterButtons }: OverviewHeaderProps) {

    return (
        <div className="bg-surface-subtle py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
