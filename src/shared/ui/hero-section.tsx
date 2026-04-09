'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { SiteSettings } from "@/types";
import { getLocalizedData } from "@/shared/lib/i18n-utils";
import { CalendarDaysIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type HeroSectionProps = {
    settings: SiteSettings | null;
};

export function HeroSection({ settings }: HeroSectionProps) {
    const { t, i18n } = useTranslation();

    const title = settings ? getLocalizedData(settings, 'hero_title', i18n.language) : t('home.hero.title');
    const subtitle = settings ? getLocalizedData(settings, 'hero_subtitle', i18n.language) : t('home.hero.subtitle');
    const ctaLabel = settings ? getLocalizedData(settings, 'hero_cta_label', i18n.language) : t('home.hero.cta');
    const ctaHref = settings?.hero_cta_href || "/vestigingen";
    const bookingUrl = settings?.booking_url || "/afspraken";
    const isExternalBooking = bookingUrl.startsWith('http');

    return (
        <section
            className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16"
            style={{ background: 'linear-gradient(160deg, #f1ede8 0%, #e7e0d5 60%, #ede7e0 100%)' }}
        >
            {/* Blurred video background */}
            <div className="absolute inset-0 overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover scale-110"
                    style={{ filter: 'blur(14px) brightness(0.6) saturate(1.1)' }}
                >
                    <source src="/videos/mijnkot-hero-video.mp4" type="video/mp4" />
                </video>
                {/* Warm beige tint over video */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(241,237,232,0.72) 0%, rgba(231,224,213,0.65) 100%)' }} />
            </div>

            {/* Decorative background ring - large, subtle */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: '700px',
                    height: '700px',
                    borderRadius: '50%',
                    border: '1px solid rgba(77,89,53,0.08)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    border: '1px solid rgba(77,89,53,0.06)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* Content - centered */}
            <div className="relative z-10 text-center max-w-3xl mx-auto">

                {/* Label */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="h-px w-8 bg-accent-500" />
                    <p className="text-xs font-bold tracking-[0.25em] uppercase text-accent-500">
                        {t('home.hero.badge')}
                    </p>
                    <span className="h-px w-8 bg-accent-500" />
                </div>

                {/* Heading */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-primary-700 leading-[1.05] tracking-tight mb-6 md:mb-8">
                    {title}
                </h1>

                {/* Subtitle */}
                <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-8 md:mb-12 max-w-xl mx-auto">
                    {subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href={bookingUrl}
                        {...(isExternalBooking ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 active:bg-accent-700 transition-colors shadow-soft cursor-pointer"
                    >
                        <CalendarDaysIcon className="w-4 h-4 shrink-0" />
                        {t('booking.cta')}
                    </a>

                    <Link
                        href={ctaHref}
                        className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                            bookingUrl
                                ? 'border border-primary-400 text-primary-700 hover:bg-primary-50'
                                : 'bg-accent-500 text-white hover:bg-accent-600 shadow-soft'
                        }`}
                    >
                        {ctaLabel}
                        <ArrowRightIcon className="w-4 h-4 shrink-0" />
                    </Link>
                </div>
            </div>

            {/* Bottom fade into page */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-main to-transparent pointer-events-none" />
        </section>
    );
}
