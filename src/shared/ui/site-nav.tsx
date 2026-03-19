'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import type { SiteSettings, Vestiging, RentType } from "@/types";
import { LanguageSwitcher } from "./language-switcher";
import { siteConfig } from "@/shared/lib/config";
import logoImage from "@/assets/logo/mijnkot-logo_horizontal-green.png";

export function SiteNav({ 
  vestigingen = [], 
  settings,
  className = ""
}: { 
  vestigingen?: Vestiging[], 
  settings?: SiteSettings,
  className?: string
}) {
  const { t } = useTranslation();
  const [rentTypes, setRentTypes] = useState<RentType[]>([]);

  useEffect(() => {
    fetch("/api/rent-types")
      .then(res => res.json())
      .then(payload => setRentTypes(payload.data ?? []))
      .catch(err => console.error("Failed to load rent types in nav:", err));
  }, []);

  return (
    <nav className={`w-full z-50 bg-surface-card/95 backdrop-blur-sm border-b border-border-light transition-all duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link className="flex items-center gap-3 group" href="/">
            <Image
              src={logoImage}
              alt={`${settings?.company_name || siteConfig.company.name} Logo`}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors" href="/">
              {t('navigation.home')}
            </Link>

            <Link className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors" href="/faq">
              {t('navigation.faq')}
            </Link>

            {/* Te Huur Dropdown */}
            <div className="relative group">
              <Link href="/koten" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                {t('navigation.rent')}
                <span className="text-[10px] opacity-70">▼</span>
              </Link>
              <div className="absolute top-full left-0 w-48 py-2 mt-1 bg-surface-card border border-border-light rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                <Link href="/vestigingen?type=academiejaar" className="block px-4 py-2 text-sm text-primary-500 hover:bg-surface-subtle hover:text-primary-600">
                  {t('navigation.rent_academic')}
                </Link>
                <Link href="/vestigingen?type=semester" className="block px-4 py-2 text-sm text-primary-500 hover:bg-surface-subtle hover:text-primary-600">
                  {t('navigation.rent_semester')}
                </Link>
                <Link href="/vestigingen?type=erasmus" className="block px-4 py-2 text-sm text-primary-500 hover:bg-surface-subtle hover:text-primary-600">
                  {t('navigation.rent_erasmus')}
                </Link>
                <hr className="my-1 border-border-light" />
                <Link href="/vestigingen" className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-surface-subtle">
                  {t('navigation.rent_view_all')}
                </Link>
              </div>
            </div>

            {/* Vestigingen Dropdown */}
            <div className="relative group">
              <Link href="/vestigingen" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                {t('navigation.locations')}
                <span className="text-[10px] opacity-70">▼</span>
              </Link>
              <div className="absolute top-full left-0 w-56 py-2 mt-1 bg-surface-card border border-border-light rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0 max-h-[70vh] overflow-y-auto">
                {vestigingen.map((v) => (
                  <Link key={v.id} href={`/vestigingen/${v.id}`} className="block px-4 py-2 text-sm text-primary-500 hover:bg-surface-subtle hover:text-primary-600 truncate">
                    {v.name}
                  </Link>
                ))}
                {vestigingen.length === 0 && (
                  <span className="block px-4 py-2 text-sm text-text-muted italic">No locations</span>
                )}
              </div>
            </div>


            <Link className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors" href="/contact">
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

