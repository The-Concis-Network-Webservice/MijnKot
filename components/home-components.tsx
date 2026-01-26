'use client';

import { useTranslation } from 'react-i18next';

export function HomeEmptyState() {
    const { t } = useTranslation();

    return (
        <div className="text-center py-12 bg-surface-subtle rounded-xl">
            <p className="text-text-muted">{t('common.no_data')}</p>
        </div>
    );
}
