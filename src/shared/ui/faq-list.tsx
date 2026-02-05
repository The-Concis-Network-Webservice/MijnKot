'use client';

import { useTranslation } from 'react-i18next';
import { SectionHeader } from "./section-header";
import type { FaqItem } from "@/types";
import { getLocalizedData } from "@/shared/lib/i18n-utils";

export function FaqList({ items }: { items: FaqItem[] }) {
    const { t, i18n } = useTranslation();

    const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
        const key = item.category || "General";
        acc[key] = acc[key] ?? [];
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <div>
            <SectionHeader
                title={t('faq.title')}
                description={t('faq.description')}
            />

            <div className="space-y-12">
                {Object.entries(grouped).map(([category, entries]) => (
                    <div key={category}>
                        <h2 className="text-lg font-semibold text-text-main mb-6">
                            {category}
                        </h2>
                        <div className="grid gap-3">
                            {entries.map((item) => {
                                const question = getLocalizedData(item, 'question', i18n.language);
                                const answer = getLocalizedData(item, 'answer', i18n.language);
                                return (
                                    <details
                                        key={item.id}
                                        className="group bg-surface-card border border-border-light rounded-xl overflow-hidden hover:shadow-soft transition-all"
                                    >
                                        <summary className="cursor-pointer font-medium text-text-main p-5 flex justify-between items-center hover:bg-surface-subtle transition-colors">
                                            {question}
                                            <span className="text-primary-500 transform group-open:rotate-180 transition-transform text-sm">▼</span>
                                        </summary>
                                        <div className="px-5 pb-5 text-text-secondary leading-relaxed border-t border-border-light pt-4">
                                            {answer}
                                        </div>
                                    </details>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-12 bg-surface-subtle rounded-xl border border-border-light">
                        <p className="text-text-muted">{t('faq.no_items')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

