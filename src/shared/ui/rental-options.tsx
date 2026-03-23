'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { GlobeEuropeAfricaIcon, AcademicCapIcon, CalendarDaysIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const OPTIONS_META = [
    { Icon: GlobeEuropeAfricaIcon, accent: "from-amber-50 to-orange-50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "hover:border-amber-200" },
    { Icon: AcademicCapIcon,       accent: "from-primary-50 to-secondary-50", iconBg: "bg-primary-100", iconColor: "text-primary-600", border: "hover:border-primary-200" },
    { Icon: CalendarDaysIcon,      accent: "from-sky-50 to-indigo-50", iconBg: "bg-sky-100", iconColor: "text-sky-600", border: "hover:border-sky-200" },
];

export function RentalOptions() {
    const { t } = useTranslation();

    const options = [
        {
            title: t('home.rental_options.erasmus_title'),
            description: t('home.rental_options.erasmus_desc'),
            href: "/contact",
            label: t('home.rental_options.cta'),
        },
        {
            title: t('home.rental_options.academic_title'),
            description: t('home.rental_options.academic_desc'),
            href: "/contact",
            label: t('home.rental_options.cta'),
        },
        {
            title: t('home.rental_options.prebooking_title'),
            description: t('home.rental_options.prebooking_desc'),
            href: "/contact",
            label: t('home.rental_options.cta'),
        },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                {options.map((option, i) => {
                    const { Icon, accent, iconBg, iconColor, border } = OPTIONS_META[i];
                    return (
                        <Link
                            key={option.title}
                            href={option.href}
                            className={`group relative flex flex-col gap-5 rounded-2xl border border-border-light bg-surface-card p-8 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${border}`}
                        >
                            {/* subtle gradient bg on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="relative z-10 flex flex-col gap-5 h-full">
                                {/* Icon */}
                                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>

                                {/* Text */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base text-text-main mb-2 group-hover:text-primary-700 transition-colors duration-150">
                                        {option.title}
                                    </h3>
                                    <p className="text-sm text-text-muted leading-relaxed">
                                        {option.description}
                                    </p>
                                </div>

                                {/* CTA */}
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors duration-150 mt-auto">
                                    {option.label}
                                    <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
