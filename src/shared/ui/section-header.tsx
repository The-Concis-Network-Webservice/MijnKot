'use client';

import { useTranslation } from 'react-i18next';

type SectionHeaderProps = {
    title: string;
    description?: string;
    centered?: boolean;
};

export function SectionHeader({ title, description, centered }: SectionHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className={`mb-12 ${centered ? 'text-center max-w-2xl mx-auto' : ''}`}>
            <h2 className="text-3xl font-display font-semibold text-text-main mb-4 leading-tight">
                {t(title as any)}
            </h2>
            {description && (
                <p className="text-text-secondary text-lg leading-relaxed">
                    {t(description as any)}
                </p>
            )}
        </div>
    );
}
