'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import type { SiteSettings, Vestiging, RentType } from "@/types";
import { LanguageSwitcher } from "./language-switcher";
import { siteConfig } from "@/shared/lib/config";
import logoImage from "@/assets/logo/mijnkot-logo_horizontal-green.png";
import { CalendarDaysIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function SiteNav({
    vestigingen = [],
    settings,
    className = "",
    topOffset = 0
}: {
    vestigingen?: Vestiging[];
    settings?: SiteSettings;
    className?: string;
    topOffset?: number;
}) {
    const { t } = useTranslation();
    const [rentTypes, setRentTypes] = useState<RentType[]>([]);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const bookingUrl = settings?.booking_url || "/afspraken";
    const isExternalBooking = bookingUrl.startsWith('http');

    useEffect(() => {
        fetch("/api/rent-types")
            .then(res => res.json())
            .then(payload => setRentTypes(payload.data ?? []))
            .catch(err => console.error("Failed to load rent types in nav:", err));
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const linkClass = "text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors duration-150 px-3 py-2 rounded-lg hover:bg-primary-50 cursor-pointer";

    return (
        <nav style={{ top: topOffset }} className={`fixed left-0 right-0 z-50 bg-surface-card transition-shadow duration-300 ${scrolled ? 'shadow-soft border-b border-border-light' : 'border-b border-transparent'} ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link href="/" onClick={() => setMobileOpen(false)} className="shrink-0">
                        <Image
                            src={logoImage}
                            alt={`${settings?.company_name || siteConfig.company.name} Logo`}
                            className="h-8 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/" className={linkClass}>{t('navigation.home')}</Link>

                        {/* Koten dropdown */}
                        <div className="relative group">
                            <Link href="/koten" className={`${linkClass} flex items-center gap-1`}>
                                {t('navigation.rent')}
                                <ChevronDownIcon className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                            </Link>
                            <div className="absolute top-full left-0 mt-1.5 w-52 bg-surface-card border border-border-light rounded-xl shadow-medium py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top scale-[0.97] group-hover:scale-100">
                                {rentTypes.map(rt => (
                                    <Link key={rt.id} href={`/koten?type=${rt.slug}`} className="block px-4 py-2.5 text-sm text-neutral-500 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
                                        {rt.name}
                                    </Link>
                                ))}
                                {rentTypes.length > 0 && <div className="my-1 border-t border-border-light" />}
                                <Link href="/koten" className="block px-4 py-2.5 text-sm font-semibold text-primary-600 hover:bg-secondary-50 transition-colors">
                                    {t('navigation.rent_view_all')} →
                                </Link>
                            </div>
                        </div>

                        {/* Vestigingen dropdown */}
                        <div className="relative group">
                            <Link href="/vestigingen" className={`${linkClass} flex items-center gap-1`}>
                                {t('navigation.locations')}
                                <ChevronDownIcon className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                            </Link>
                            <div className="absolute top-full left-0 mt-1.5 w-56 bg-surface-card border border-border-light rounded-xl shadow-medium py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top scale-[0.97] group-hover:scale-100 max-h-64 overflow-y-auto">
                                {vestigingen.map(v => (
                                    <Link key={v.id} href={`/vestigingen/${v.id}`} className="block px-4 py-2.5 text-sm text-neutral-500 hover:bg-secondary-50 hover:text-primary-600 truncate transition-colors">
                                        {v.name}
                                    </Link>
                                ))}
                                {vestigingen.length === 0 && (
                                    <span className="block px-4 py-2.5 text-sm text-text-muted italic">{t('navigation.no_locations')}</span>
                                )}
                            </div>
                        </div>

                        <Link href="/over-ons" className={linkClass}>{t('navigation.about')}</Link>
                        <Link href="/faq" className={linkClass}>{t('navigation.faq')}</Link>
                        <Link href="/contact" className={linkClass}>{t('navigation.contact')}</Link>
                    </div>

                    {/* Right: language + booking CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <LanguageSwitcher />
                        <div className="w-px h-5 bg-border-light" />
                        <a
                            href={bookingUrl}
                            {...(isExternalBooking ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 active:bg-accent-700 transition-colors cursor-pointer whitespace-nowrap"
                        >
                            <CalendarDaysIcon className="w-4 h-4 shrink-0" />
                            {t('navigation.plan_visit')}
                        </a>
                    </div>

                    {/* Mobile: hamburger only */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Menu"
                        >
                            {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border-light bg-surface-card">
                    <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col">
                        {[
                            { href: "/", label: t('navigation.home') },
                            { href: "/koten", label: t('navigation.rent') },
                            { href: "/vestigingen", label: t('navigation.locations') },
                            { href: "/over-ons", label: t('navigation.about') },
                            { href: "/faq", label: t('navigation.faq') },
                            { href: "/contact", label: t('navigation.contact') },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="py-3.5 text-sm font-medium text-neutral-500 border-b border-border-light last:border-0 hover:text-primary-600 transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                        <div className="pt-3 pb-1">
                            <a
                                href={bookingUrl}
                                {...(isExternalBooking ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors cursor-pointer"
                            >
                                <CalendarDaysIcon className="w-4 h-4 shrink-0" />
                                {t('navigation.plan_visit')}
                            </a>
                        </div>
                        <div className="py-2">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
