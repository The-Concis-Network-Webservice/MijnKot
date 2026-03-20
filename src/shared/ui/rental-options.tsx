'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { GlobeEuropeAfricaIcon, AcademicCapIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

const OPTION_ICONS = [GlobeEuropeAfricaIcon, AcademicCapIcon, CalendarDaysIcon];

export function RentalOptions() {
    const { t } = useTranslation();

    const options = [
        {
            title: t('home.rental_options.erasmus_title'),
            description: t('home.rental_options.erasmus_desc'),
            href: "/contact",
        },
        {
            title: t('home.rental_options.academic_title'),
            description: t('home.rental_options.academic_desc'),
            href: "/contact",
        },
        {
            title: t('home.rental_options.prebooking_title'),
            description: t('home.rental_options.prebooking_desc'),
            href: "/contact",
        },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-border-light rounded-2xl overflow-hidden shadow-subtle">
                {options.map((option, i) => {
                    const Icon = OPTION_ICONS[i];
                    return (
                        <Link
                            key={option.title}
                            href={option.href}
                            className="group bg-surface-card px-8 py-9 flex flex-col gap-4 hover:bg-secondary-50 transition-colors duration-200 cursor-pointer first:rounded-l-2xl last:rounded-r-2xl"
                        >
                            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                <Icon className="w-5 h-5 text-primary-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-neutral-500 mb-2 group-hover:text-primary-600 transition-colors">
                                    {option.title}
                                </h3>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    {option.description}
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-primary-500 group-hover:text-primary-700 transition-colors mt-auto">
                                Meer info →
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
