'use client';

import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const locale = i18n.language;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-1 bg-surface-subtle rounded-lg p-1">
            <button
                onClick={() => changeLanguage('nl')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${locale === 'nl'
                        ? 'bg-surface-card text-text-main shadow-subtle'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
            >
                NL
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${locale === 'en'
                        ? 'bg-surface-card text-text-main shadow-subtle'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
