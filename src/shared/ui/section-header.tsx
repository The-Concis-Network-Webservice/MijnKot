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
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-600 leading-tight mb-4">
                {t(title as any)}
            </h2>
            {description && (
                <p className="text-neutral-400 text-base leading-relaxed max-w-xl">
                    {t(description as any)}
                </p>
            )}
            <div className={`mt-5 h-px bg-border-light ${centered ? 'max-w-xs mx-auto' : 'max-w-xs'}`}>
                <div className="h-px w-12 bg-accent-500" />
            </div>
        </div>
    );
}
