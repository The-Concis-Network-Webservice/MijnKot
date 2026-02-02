'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Kot, Vestiging } from '../types';

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
                <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6">
                    {/* Price */}
                    <div className="border-b border-gray-100 pb-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900">€{kot.price}</span>
                            <span className="text-gray-500">/ maand</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Kosten inbegrepen</p>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Beschikbaarheid</span>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${kot.availability_status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : kot.availability_status === 'reserved'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
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
                                <p className="text-sm font-medium text-gray-900">{vestiging.city}</p>
                                <p className="text-sm text-gray-500">{vestiging.address}</p>
                                <p className="text-xs text-gray-400">{vestiging.postal_code}</p>
                            </div>
                        </div>
                    )}

                    {/* Quick Facts */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Type</p>
                            <p className="text-sm font-semibold text-gray-900">Studio</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Gemeubeld</p>
                            <p className="text-sm font-semibold text-gray-900">Ja</p>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                            Plan bezoek
                        </button>
                        <button
                            onClick={() => setShowContact(!showContact)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors font-semibold"
                        >
                            Contact
                        </button>
                    </div>

                    {/* Contact Info (Collapsible) */}
                    {showContact && (
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                            <a href="tel:+32123456789" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                +32 123 456 789
                            </a>
                            <a href="mailto:info@example.com" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                info@example.com
                            </a>
                        </div>
                    )}

                    {/* Reference */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Ref: {kot.id.slice(0, 8)}</p>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 safe-area-inset-bottom">
                <div className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1">
                        <p className="text-2xl font-bold text-gray-900">€{kot.price}</p>
                        <p className="text-xs text-gray-500">/ maand</p>
                    </div>
                    <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                        Plan bezoek
                    </button>
                </div>
            </div>

            {/* Mobile: Add bottom padding to prevent content overlap */}
            <div className="lg:hidden h-20" />
        </>
    );
}
