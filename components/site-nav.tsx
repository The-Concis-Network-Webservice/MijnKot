'use client';

import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "./language-switcher";

export function SiteNav() {
  const { t } = useTranslation();

  return (
    <nav className="fixed w-full top-0 z-50 bg-surface-card/95 backdrop-blur-sm border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link className="flex items-center gap-3 group" href="/">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white shadow-subtle">
              <span className="text-lg font-semibold font-display">MK</span>
            </div>
            <span className="font-display font-semibold text-xl tracking-tight text-text-main">
              MIJN-KOT
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors" href="/">
              {t('navigation.home')}
            </Link>
            <Link className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors" href="/faq">
              {t('navigation.faq')}
            </Link>
            <Link
              className="px-5 py-2.5 bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors shadow-subtle"
              href="/vestigingen"
            >
              {t('navigation.rent')}
            </Link>
            <Link className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors" href="/contact">
              {t('navigation.contact')}
            </Link>

            <div className="w-px h-6 bg-border-light ml-2"></div>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}

