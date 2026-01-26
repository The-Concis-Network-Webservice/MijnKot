'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function RentalOptions() {
    const { t } = useTranslation();

    const options = [
        {
            title: t('home.rental_options.erasmus_title'),
            description: t('home.rental_options.erasmus_desc'),
            icon: "🌍",
            href: "/vestigingen?type=erasmus",
        },
        {
            title: t('home.rental_options.academic_title'),
            description: t('home.rental_options.academic_desc'),
            icon: "🎓",
            href: "/vestigingen?type=academic",
        },
        {
            title: t('home.rental_options.prebooking_title'),
            description: t('home.rental_options.prebooking_desc'),
            icon: "📅",
            href: "/vestigingen?type=next-year",
        },
    ];

    return (
        <section className="py-16 -mt-12 relative z-20 px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((option) => (
                    <Link
                        key={option.title}
                        href={option.href}
                        className="bg-surface-card p-8 rounded-xl shadow-soft border border-border-light hover:shadow-medium hover:border-primary-200 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-6 bg-primary-50 group-hover:bg-primary-100 transition-colors">
                            {option.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-text-main mb-3 group-hover:text-primary-600 transition-colors">
                            {option.title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            {option.description}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
