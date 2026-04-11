'use client';

import Link from "next/link";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BookingCtaBanner({ bookingUrl }: { bookingUrl?: string | null }) {
    const { t } = useTranslation();
    const href = bookingUrl || "/afspraken";
    const isExternal = !!bookingUrl;

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-800">
            <div className="max-w-3xl mx-auto">
                <div className="border border-primary-600 rounded-2xl px-8 py-12 md:px-14 md:py-14 text-center">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-400 mb-5">
                        {t('booking.badge')}
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-100 mb-5 leading-tight">
                        {t('booking.title')}
                    </h2>
                    <p className="text-secondary-400 text-base leading-relaxed mb-10 max-w-md mx-auto">
                        {t('booking.desc')}
                    </p>
                    <Link
                        href="/koten"
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 active:bg-accent-700 transition-colors cursor-pointer"
                    >
                        <CalendarDaysIcon className="w-4 h-4 shrink-0" />
                        {t('booking.cta')}
                    </Link>
                    <p className="mt-5 text-xs text-secondary-600">
                        {t('booking.fine_print')}
                    </p>
                </div>
            </div>
        </section>
    );
}
