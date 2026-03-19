'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Vestiging } from "@/types";
import { useTranslation } from 'react-i18next';
import { getLocalizedData } from "@/shared/lib/i18n-utils";

export function VestigingCard({ vestiging }: { vestiging: Vestiging }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Always use 'nl' during SSR/hydration to match server output, switch after mount
  const locale = mounted ? i18n.language : 'nl';
  // Fallback to Dutch description if no English translation exists
  const description = getLocalizedData(vestiging, 'description', locale) || vestiging.description;

  return (
    <Link
      href={`/vestigingen/${vestiging.id}`}
      className="block bg-surface-card border border-border-light rounded-2xl overflow-hidden hover:shadow-medium transition-shadow duration-300 group isolate"
    >
      {/* Image — fixed height, overflow-hidden contains the scale effect */}
      <div className="relative h-48 w-full bg-surface-subtle overflow-hidden">
        {vestiging.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vestiging.image_url}
            alt={vestiging.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-700 text-sm">
            No image
          </div>
        )}
      </div>
      {/* Info — fixed height h-40 so layout NEVER shifts on language change */}
      <div className="p-6 bg-primary-700 h-40">
        <h3 className="font-display text-xl font-bold text-secondary-200 mb-2 truncate">
          {vestiging.name}
        </h3>
        <p className="text-sm text-secondary-400 mb-3 truncate">
          {vestiging.address}, {vestiging.postal_code} {vestiging.city}
        </p>
        <p className="text-sm text-secondary-500 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
