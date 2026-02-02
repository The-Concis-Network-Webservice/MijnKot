'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SiteSettings } from '../types';
import { getLocalizedData } from '../lib/i18n-utils';

type HeroSectionProps = {
    settings: SiteSettings | null;
};

export function HeroSection({
    settings,
}: HeroSectionProps) {
    const { t, i18n } = useTranslation();

    // Localized fallbacks
    const title = settings ? getLocalizedData(settings, 'hero_title', i18n.language) : t('home.hero.title');
    const subtitle = settings ? getLocalizedData(settings, 'hero_subtitle', i18n.language) : t('home.hero.subtitle');
    const ctaLabel = settings ? getLocalizedData(settings, 'hero_cta_label', i18n.language) : t('home.hero.cta');
    const ctaHref = settings?.hero_cta_href || "/vestigingen";

    return (
        <section className="relative bg-surface-subtle overflow-hidden">
            {/* Subtle background pattern */}
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://videos.pexels.com/video-files/6860803/6860803-hd_1920_1080_25fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 relative z-10">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-lg bg-primary-50 text-primary-700 text-xs font-medium px-4 py-2 mb-8 border border-primary-100">
                        {t('home.hero.badge')}
                    </span>

                    <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-main mb-6 tracking-tight leading-tight">
                        {title}
                    </h1>

                    <p className="text-text-secondary text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
                        {subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-lg font-medium text-base hover:bg-primary-600 transition-colors shadow-soft"
                        >
                            {ctaLabel}
                        </Link>

                        <Link
                            href="/faq"
                            className="inline-flex items-center justify-center px-8 py-4 bg-surface-card border border-border-DEFAULT text-text-main rounded-lg font-medium text-base hover:bg-surface-subtle transition-colors"
                        >
                            {t('home.hero.secondary_cta')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
