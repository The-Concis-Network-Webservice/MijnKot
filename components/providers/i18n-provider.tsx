'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../../lib/i18n';
import { useState, useEffect } from 'react';

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch / flash of untranslated content
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-main">
                {/* Optional: Simple loading spinner or just whitespace */}
                <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
}

// Re-export useTranslation for convenience/compatibility if needed,
// strictly speaking user should use useTranslation from react-i18next directly,
// but we might want to keep the hook path consistent.
// However, the standard is `import { useTranslation } from 'react-i18next'`.
// I will not export a custom hook called useI18n anymore to force standard usage.
