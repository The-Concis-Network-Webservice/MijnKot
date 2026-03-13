'use client';

import { useTranslation } from 'react-i18next';
import { SectionHeader } from "./section-header";

type OverviewHeaderProps = {
    filterButtons: React.ReactNode;
};

export function OverviewHeader({ filterButtons }: OverviewHeaderProps) {
    const { t } = useTranslation();

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

type LocationFilterProps = {
    vestigingen: Array<{ id: string; name: string }>;
    currentVestiging?: string;
};

export function LocationFilter({ vestigingen, currentVestiging }: LocationFilterProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap gap-3">
            <a
                href="/koten"
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${!currentVestiging ? 'bg-primary-600 text-white shadow-soft' : 'bg-white border border-border-light text-primary-800 hover:border-primary-400 hover:bg-surface-subtle'}`}
            >
                {t('overview.all_locations')}
            </a>
            {vestigingen.map(v => (
                <a
                    key={v.id}
                    href={`/koten?vestiging=${v.id}`}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${currentVestiging === v.id ? 'bg-primary-600 text-white shadow-soft' : 'bg-white border border-border-light text-primary-800 hover:border-primary-400 hover:bg-surface-subtle'}`}
                >
                    {v.name}
                </a>
            ))}
        </div>
    );
}
