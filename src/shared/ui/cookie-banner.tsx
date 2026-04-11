'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const STORAGE_KEY = 'cookie_consent';

type ConsentValue = 'all' | 'necessary';

export function CookieBanner() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            setVisible(true);
        }
    }, []);

    function accept(value: ConsentValue) {
        localStorage.setItem(STORAGE_KEY, value);
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-20 lg:bottom-4 left-0 right-0 z-[70] px-4 py-0 sm:px-6 pointer-events-none"
            aria-live="polite"
            aria-label={t('cookies.banner_label')}
        >
            <div className="max-w-4xl mx-auto bg-surface-card border border-border-light rounded-2xl shadow-soft pointer-events-auto overflow-hidden">
                <div className="px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Icon + text */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <InformationCircleIcon className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-500">
                                {t('cookies.title')}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                                {t('cookies.description')}{' '}
                                <Link
                                    href="/cookie-instellingen"
                                    className="underline underline-offset-2 hover:text-primary-600 transition-colors"
                                >
                                    {t('cookies.learn_more')}
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0 sm:ml-4">
                        <button
                            onClick={() => accept('necessary')}
                            className="px-4 py-2.5 border border-border-DEFAULT rounded-xl text-xs font-medium text-neutral-500 hover:border-primary-300 hover:bg-secondary-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                            {t('cookies.necessary_only')}
                        </button>
                        <button
                            onClick={() => accept('all')}
                            className="px-5 py-2.5 bg-accent-500 text-white rounded-xl text-xs font-semibold hover:bg-accent-600 active:bg-accent-700 transition-colors whitespace-nowrap shadow-soft cursor-pointer"
                        >
                            {t('cookies.accept_all')}
                        </button>
                        <button
                            onClick={() => accept('necessary')}
                            className="p-1.5 rounded-lg text-text-muted hover:text-neutral-500 hover:bg-secondary-100 transition-colors cursor-pointer"
                            aria-label={t('cookies.close')}
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
