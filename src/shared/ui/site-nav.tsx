'use client';

import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "./language-switcher";
import type { Vestiging } from "@/types";

export function SiteNav({ vestigingen = [], customLogo }: { vestigingen?: Vestiging[], customLogo?: string }) {
  const { t } = useTranslation();

  return (
    <nav className="fixed w-full top-0 z-50 bg-surface-card/95 backdrop-blur-sm border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link className="flex items-center gap-3 group" href="/">
            {customLogo ? (
              <img src={customLogo} alt="Mijn-Kot Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white shadow-subtle">
                <span className="text-lg font-semibold font-display">MK</span>
              </div>
            )}
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

            {/* Te Huur Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors flex items-center gap-1">
                {t('navigation.rent')}
                <span className="text-[10px] opacity-70">▼</span>
              </button>
              <div className="absolute top-full left-0 w-48 py-2 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                <Link href="/vestigingen?type=academiejaar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                  Academiejaar
                </Link>
                <Link href="/vestigingen?type=semester" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                  Semester
                </Link>
                <Link href="/vestigingen?type=erasmus" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                  Erasmus
                </Link>
                <hr className="my-1 border-gray-100" />
                <Link href="/vestigingen" className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-gray-50">
                  Alles bekijken
                </Link>
              </div>
            </div>

            {/* Vestigingen Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors flex items-center gap-1">
                Vestigingen
                <span className="text-[10px] opacity-70">▼</span>
              </button>
              <div className="absolute top-full left-0 w-56 py-2 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0 max-h-[70vh] overflow-y-auto">
                {vestigingen.map((v) => (
                  <Link key={v.id} href={`/vestigingen/${v.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 truncate">
                    {v.name}
                  </Link>
                ))}
                {vestigingen.length === 0 && (
                  <span className="block px-4 py-2 text-sm text-gray-400 italic">No locations</span>
                )}
              </div>
            </div>

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

