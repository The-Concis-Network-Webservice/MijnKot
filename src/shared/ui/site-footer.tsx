'use client';

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import logoFooter from "@/assets/logo/mijnkot-logo_horizontal-beige.png";

export function SiteFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white pt-20 pb-10 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src={logoFooter}
                alt="Mijn-Kot Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5 text-white">{t('footer.navigation_title')}</h3>
            <ul className="space-y-3 text-sm text-primary-200">
              <li><Link href="/" className="hover:text-white transition-colors">{t('navigation.home')}</Link></li>
              <li><Link href="/vestigingen" className="hover:text-white transition-colors">{t('navigation.rent')}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">{t('navigation.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5 text-white">{t('footer.information_title')}</h3>
            <ul className="space-y-3 text-sm text-primary-200">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy_policy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms_of_service')}</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">{t('footer.cookie_settings')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5 text-white">{t('footer.contact_title')}</h3>
            <ul className="space-y-3 text-sm text-primary-200">
              <li>info@mijn-kot.be</li>
              <li>+32 123 45 67 89</li>
              <li className="pt-2">Grote Markt 1<br />3000 Leuven</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-300">
          <p>© {currentYear} Mijn-Kot. {t('footer.rights_reserved')}</p>
          <p>{t('footer.platform_label')}</p>
        </div>
      </div>
    </footer>
  );
}
