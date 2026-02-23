'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Kot, Vestiging } from "@/types";

interface StickySummaryProps {
    kot: Kot;
    vestiging: Vestiging | null;
}

export function StickySummary({ kot, vestiging }: StickySummaryProps) {
    const { t } = useTranslation();
    const [showContact, setShowContact] = useState(false);

    return (
        <>
            {/* Desktop Sticky Sidebar */}
            <div className="hidden lg:block">
                <div className="sticky top-6 bg-surface-card border border-border-light rounded-2xl shadow-soft p-6 space-y-6">
                    {/* Price */}
                    <div className="border-b border-border-light pb-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-text-main">€{kot.price}</span>
                            <span className="text-text-muted">/ maand</span>
                        </div>
                        <p className="text-sm text-text-muted mt-1">Kosten inbegrepen</p>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-main">Beschikbaarheid</span>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${kot.availability_status === 'available'
                            ? 'bg-state-success/10 text-state-success border-state-success/20'
                            : kot.availability_status === 'reserved'
                                ? 'bg-state-warning/10 text-state-warning border-state-warning/20'
                                : 'bg-state-error/10 text-state-error border-state-error/20'
                            }`}>
                            {kot.availability_status === 'available' && 'Beschikbaar'}
                            {kot.availability_status === 'reserved' && 'Gereserveerd'}
                            {kot.availability_status === 'rented' && 'Verhuurd'}
                        </span>
                    </div>

                    {/* Location */}
                    {vestiging && (
                        <div className="flex items-start gap-3">
                            <div>
                                <p className="text-sm font-medium text-text-main">{vestiging.city}</p>
                                <p className="text-sm text-text-muted">{vestiging.address}</p>
                                <p className="text-xs text-text-light">{vestiging.postal_code}</p>
                            </div>
                        </div>
                    )}

                    {/* Quick Facts */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
                        <div className="text-center p-3 bg-surface-subtle rounded-xl border border-border-light">
                            <p className="text-xs text-text-muted mb-1">Type</p>
                            <p className="text-sm font-semibold text-text-main">Studio</p>
                        </div>
                        <div className="text-center p-3 bg-surface-subtle rounded-xl border border-border-light">
                            <p className="text-xs text-text-muted mb-1">Gemeubeld</p>
                            <p className="text-sm font-semibold text-text-main">Ja</p>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3 pt-4 border-t border-border-light">
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold shadow-soft">
                            Plan bezoek
                        </button>
                        <button
                            onClick={() => setShowContact(!showContact)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-surface-card text-text-main border-2 border-border-DEFAULT rounded-xl hover:border-border-medium hover:bg-surface-subtle transition-colors font-semibold"
                        >
                            Contact
                        </button>
                    </div>

                    {/* Contact Info (Collapsible) */}
                    {showContact && (
                        <div className="space-y-2 pt-2 border-t border-border-light">
                            <a href="tel:+32123456789" className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600">
                                +32 123 456 789
                            </a>
                            <a href="mailto:info@example.com" className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600">
                                info@example.com
                            </a>
                        </div>
                    )}

                    {/* Reference */}
                    <div className="text-center pt-4 border-t border-border-light">
                        <p className="text-xs text-text-muted">Ref: {kot.id.slice(0, 8)}</p>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t-2 border-border-light shadow-2xl z-50 safe-area-inset-bottom">
                <div className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1">
                        <p className="text-2xl font-bold text-text-main">€{kot.price}</p>
                        <p className="text-xs text-text-muted">/ maand</p>
                    </div>
                    <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold shadow-soft">
                        Plan bezoek
                    </button>
                </div>
            </div>

            {/* Mobile: Add bottom padding to prevent content overlap */}
            <div className="lg:hidden h-20" />
        </>
    );
}

