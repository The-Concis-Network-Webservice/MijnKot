'use client';

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { siteConfig } from "@/shared/lib/config";
import type { SiteSettings } from "@/types";
import logoFooter from "@/assets/logo/mijnkot-logo_horizontal-beige.png";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white pt-20 pb-10 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src={logoFooter}
                alt={`${settings?.company_name || siteConfig.company.name} Logo`}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-secondary-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5 text-secondary-500">{t('footer.navigation_title')}</h3>
            <ul className="space-y-3 text-sm text-secondary-600">
              <li><Link href="/" className="hover:text-secondary-200 transition-colors">{t('navigation.home')}</Link></li>
              <li><Link href="/vestigingen" className="hover:text-secondary-200 transition-colors">{t('navigation.rent')}</Link></li>
              <li><Link href="/faq" className="hover:text-secondary-200 transition-colors">{t('navigation.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5 text-secondary-500">{t('footer.information_title')}</h3>
            <ul className="space-y-3 text-sm text-secondary-600">
              <li><Link href="/privacybeleid" className="hover:text-secondary-200 transition-colors">{t('footer.privacy_policy')}</Link></li>
              <li><Link href="/algemene-voorwaarden" className="hover:text-secondary-200 transition-colors">{t('footer.terms_of_service')}</Link></li>
              <li><Link href="/cookie-instellingen" className="hover:text-secondary-200 transition-colors">{t('footer.cookie_settings')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5 text-secondary-500">{t('footer.contact_title')}</h3>
            
            <ul className="space-y-3 text-sm text-secondary-600">

              {settings?.contact_email && (
                <li className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  {settings.contact_email}
                </li>
              )}

              {settings?.contact_phone && (
                <li className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {settings.contact_phone}
                </li>
              )}
              {settings?.contact_address && (
                <li className="flex items-center gap-2 pt-2">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>
                    {settings.contact_address.split(',')[0]}<br />
                    {settings.contact_address.split(',')[1]?.trim()}
                  </span>
                </li>
              )}  
            </ul>

          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-700">
          <p>© {currentYear} {settings?.company_name || siteConfig.company.name}. {t('footer.rights_reserved')}</p>
          <p>{t('footer.platform_label')}</p>
        </div>
      </div>
    </footer>
  );
}
