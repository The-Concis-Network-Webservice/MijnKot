'use client';

import { useTranslation } from 'react-i18next';
import type { Kot, Vestiging } from "../types";

type DetailHeaderProps = {
    kot: Kot;
    vestiging: Vestiging | null;
};

import { getLocalizedData } from '../lib/i18n-utils';

export function DetailHeader({ kot, vestiging }: DetailHeaderProps) {
    const { t, i18n } = useTranslation();
    const title = getLocalizedData(kot, 'title', i18n.language);

    return (
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-state-success/10 text-state-success rounded-lg text-xs font-medium border border-state-success/20">
                    {t(`status.${kot.availability_status}` as any)}
                </span>
                <span className="text-text-muted text-sm">{t('detail.ref_label')}: {kot.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-text-main mb-4 leading-tight">{title}</h1>
            <div className="flex items-center text-text-secondary">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {vestiging?.address}, {vestiging?.postal_code} {vestiging?.city}
            </div>
        </div>
    );
}

export function DetailAbout({ kot }: { kot: Kot }) {
    const { t, i18n } = useTranslation();
    const description = getLocalizedData(kot, 'description', i18n.language);

    return (
        <section>
            <h2 className="text-2xl font-semibold font-display text-text-main mb-6">{t('detail.about_title')}</h2>
            <div className="prose prose-lg max-w-none">
                <p className="text-text-secondary leading-relaxed">{description}</p>
            </div>
        </section>
    );
}

export function DetailAttributes() {
    const { t } = useTranslation();

    return (
        <section className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-surface-subtle rounded-xl border border-border-light">
                <p className="text-sm text-text-muted mb-1">{t('detail.type_label')}</p>
                <p className="font-medium text-text-main">{t('detail.type_value')}</p>
            </div>
            <div className="p-5 bg-surface-subtle rounded-xl border border-border-light">
                <p className="text-sm text-text-muted mb-1">{t('detail.furnished_label')}</p>
                <p className="font-medium text-text-main">{t('detail.furnished_yes')}</p>
            </div>
        </section>
    );
}

type PricingCardProps = {
    price: number;
};

export function PricingCard({ price }: PricingCardProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-surface-card border border-border-light rounded-2xl p-8 shadow-soft sticky top-24">
            <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-semibold text-text-main">€{price}</span>
                <span className="text-text-muted mb-1">{t('detail.per_month')}</span>
            </div>

            <div className="space-y-3 mb-8 text-sm text-text-secondary pb-6 border-b border-border-light">
                <div className="flex justify-between">
                    <span>{t('detail.utilities')}</span>
                    <span className="font-medium text-text-main">{t('detail.utilities_value')}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t('detail.deposit')}</span>
                    <span className="font-medium text-text-main">{t('detail.deposit_value')}</span>
                </div>
            </div>

            <button className="w-full py-3.5 bg-primary-500 text-white rounded-lg font-medium shadow-soft hover:bg-primary-600 transition-colors mb-3">
                {t('detail.request_visit')}
            </button>
            <button className="w-full py-3.5 bg-surface-card border border-border-DEFAULT text-text-main rounded-lg font-medium hover:bg-surface-subtle transition-colors">
                {t('detail.ask_question')}
            </button>
        </div>
    );
}
