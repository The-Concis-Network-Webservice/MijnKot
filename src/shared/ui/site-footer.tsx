'use client';

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { siteConfig } from "@/shared/lib/config";
import type { SiteSettings } from "@/types";
import logoFooter from "@/assets/logo/mijnkot-logo_horizontal-beige.png";
import { MapPinIcon, EnvelopeIcon, PhoneIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-900 mt-24">

            {/* Booking CTA strip */}
            {settings?.booking_url && (
                <div className="border-b border-primary-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div>
                            <p className="font-display text-lg font-semibold text-secondary-100">Plan een bezichtiging</p>
                            <p className="text-sm text-secondary-500 mt-0.5">Gratis &nbsp;·&nbsp; Vrijblijvend &nbsp;·&nbsp; Direct bevestiging</p>
                        </div>
                        <a
                            href={settings.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 active:bg-accent-700 transition-colors cursor-pointer shrink-0"
                        >
                            <CalendarDaysIcon className="w-4 h-4 shrink-0" />
                            Plan bezoek
                        </a>
                    </div>
                </div>
            )}

            {/* Main grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div>
                        <Image
                            src={logoFooter}
                            alt={`${settings?.company_name || siteConfig.company.name} Logo`}
                            className="h-7 w-auto object-contain mb-5"
                        />
                        <p className="text-sm text-secondary-600 leading-relaxed">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-5">
                            {t('footer.navigation_title')}
                        </p>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/", label: t('navigation.home') },
                                { href: "/koten", label: t('navigation.rent') },
                                { href: "/vestigingen", label: t('navigation.locations') },
                                { href: "/faq", label: t('navigation.faq') },
                                { href: "/contact", label: t('navigation.contact') },
                            ].map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-secondary-600 hover:text-secondary-300 transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-5">
                            {t('footer.information_title')}
                        </p>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/privacybeleid", label: t('footer.privacy_policy') },
                                { href: "/algemene-voorwaarden", label: t('footer.terms_of_service') },
                                { href: "/cookie-instellingen", label: t('footer.cookie_settings') },
                            ].map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-secondary-600 hover:text-secondary-300 transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-5">
                            {t('footer.contact_title')}
                        </p>
                        <ul className="space-y-3">
                            {settings?.contact_email && (
                                <li>
                                    <a href={`mailto:${settings.contact_email}`} className="flex items-start gap-2.5 text-sm text-secondary-600 hover:text-secondary-300 transition-colors">
                                        <EnvelopeIcon className="w-4 h-4 mt-0.5 shrink-0" />
                                        {settings.contact_email}
                                    </a>
                                </li>
                            )}
                            {settings?.contact_phone && (
                                <li>
                                    <a href={`tel:${settings.contact_phone}`} className="flex items-start gap-2.5 text-sm text-secondary-600 hover:text-secondary-300 transition-colors">
                                        <PhoneIcon className="w-4 h-4 mt-0.5 shrink-0" />
                                        {settings.contact_phone}
                                    </a>
                                </li>
                            )}
                            {settings?.contact_address && (
                                <li className="flex items-start gap-2.5 text-sm text-secondary-600">
                                    <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>
                                        {settings.contact_address.split(',')[0]}<br />
                                        {settings.contact_address.split(',')[1]?.trim()}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-primary-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-secondary-700">
                    <p>© {currentYear} {settings?.company_name || siteConfig.company.name}. {t('footer.rights_reserved')}</p>
                    <p>{t('footer.platform_label')}</p>
                </div>
            </div>
        </footer>
    );
}
