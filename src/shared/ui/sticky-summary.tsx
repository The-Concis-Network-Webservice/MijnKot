'use client';

import { useState } from 'react';
import type { Kot, Vestiging } from "@/types";
import { useTranslation } from 'react-i18next';
import { siteConfig } from "@/shared/lib/config";
import {
    CalendarDaysIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface StickySummaryProps {
    kot: Kot;
    vestiging: Vestiging | null;
    bookingUrl?: string | null;
}

export function StickySummary({ kot, vestiging, bookingUrl }: StickySummaryProps) {
    const { t } = useTranslation();
    const [showContact, setShowContact] = useState(false);

    const isAvailable = kot.availability_status === 'available';
    const isReserved = kot.availability_status === 'reserved';

    const statusLabel = isAvailable ? t('common.available') : isReserved ? t('common.reserved') : t('common.rented');
    const statusClass = isAvailable
        ? 'bg-state-success/10 text-state-success border-state-success/20'
        : isReserved
            ? 'bg-state-warning/10 text-state-warning border-state-warning/20'
            : 'bg-state-error/10 text-state-error border-state-error/20';

    const bookingHref = bookingUrl || "/afspraken";
    const isExternal = !!bookingUrl;

    const BookingButton = ({ fullWidth = true }: { fullWidth?: boolean }) => (
        <a
            href={bookingHref}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-500 text-white rounded-xl hover:bg-accent-600 active:bg-accent-700 transition-colors font-semibold text-sm shadow-soft cursor-pointer`}
        >
            <CalendarDaysIcon className="w-4 h-4 shrink-0" />
            {t('booking.plan_visit')}
        </a>
    );

    return (
        <>
            {/* Desktop sticky sidebar */}
            <div className="hidden lg:block">
                <div className="sticky top-28 bg-surface-card border border-border-light rounded-2xl overflow-hidden shadow-soft">

                    {/* Price header */}
                    <div className="px-6 py-5 border-b border-border-light bg-secondary-50">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-neutral-500">€{kot.price}</span>
                            <span className="text-sm text-text-muted">{t('sticky.per_month')}</span>
                        </div>
                        <p className="text-xs text-text-muted mt-1">{t('sticky.all_included')}</p>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Status</span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass}`}>
                                {statusLabel}
                            </span>
                        </div>

                        {/* Urgency - available only */}
                        {isAvailable && (
                            <div className="rounded-xl border border-accent-500/20 bg-accent-500/5 px-4 py-3">
                                <p className="text-xs font-semibold text-accent-600 mb-0.5">{t('sticky.act_fast')}</p>
                                <p className="text-xs text-text-muted leading-relaxed">{t('sticky.act_fast_desc')}</p>
                            </div>
                        )}

                        {/* Location */}
                        {vestiging && (
                            <div className="flex items-start gap-2.5 py-1">
                                <MapPinIcon className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">{vestiging.city}</p>
                                    <p className="text-xs text-text-muted">{vestiging.address}{vestiging.postal_code ? `, ${vestiging.postal_code}` : ''}</p>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-border-light pt-4 space-y-3">
                            <BookingButton />
                            <p className="text-xs text-center text-text-muted">{t('booking.free_no_obligations')}</p>

                            <button
                                onClick={() => setShowContact(!showContact)}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-border-DEFAULT rounded-xl text-sm font-medium text-neutral-500 hover:border-primary-300 hover:text-primary-600 hover:bg-secondary-50 transition-colors cursor-pointer"
                            >
                                {t('sticky.contact_button')}
                                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${showContact ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Contact collapsible */}
                        {showContact && (
                            <div className="space-y-2.5 pt-1 border-t border-border-light">
                                <a href="/contact" className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-700 transition-colors font-medium">
                                    <EnvelopeIcon className="w-4 h-4 shrink-0" />
                                    {t('sticky.send_message')}
                                </a>
                            </div>
                        )}

                        <p className="text-center text-xs text-text-muted pt-2 border-t border-border-light">
                            {t('detail.ref_label')} {kot.id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile sticky bottom bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-card border-t border-border-light">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-neutral-500">
                            €{kot.price}<span className="text-xs font-normal text-text-muted ml-1">{t('sticky.per_month')}</span>
                        </p>
                        <span className={`text-xs font-semibold ${isAvailable ? 'text-state-success' : isReserved ? 'text-state-warning' : 'text-state-error'}`}>{statusLabel}</span>
                    </div>
                    <a href="/contact" className="flex items-center justify-center gap-1.5 px-4 py-3 border border-border-DEFAULT rounded-xl text-sm font-medium text-neutral-500 hover:border-primary-300 transition-colors cursor-pointer whitespace-nowrap">
                        <EnvelopeIcon className="w-4 h-4 shrink-0" />
                    </a>
                    <BookingButton fullWidth={false} />
                </div>
            </div>

            <div className="lg:hidden h-20" />
        </>
    );
}
