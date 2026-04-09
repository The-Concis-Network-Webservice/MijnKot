'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/lib/i18n';

// Render children immediately - no mount guard.
// The mount guard caused Googlebot to receive a blank spinner instead of page content.
// i18next falls back to Dutch (default locale) on the server and switches client-side
// once the browser language detector runs. A brief NL→EN flash for English users is
// preferable to blocking all content from search engine indexing.
export function I18nProvider({ children }: { children: React.ReactNode }) {
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

