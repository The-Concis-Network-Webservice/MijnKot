'use client';

import Link from "next/link";
import type { Vestiging } from "@/types";
import { useTranslation } from 'react-i18next';
import { getLocalizedData } from "@/shared/lib/i18n-utils";

export function VestigingCard({ vestiging }: { vestiging: Vestiging }) {
  const { i18n } = useTranslation();
  const description = getLocalizedData(vestiging, 'description', i18n.language);

  return (
    <Link
      href={`/vestigingen/${vestiging.id}`}
      className="block bg-surface-light border border-accent-100 rounded-2xl overflow-hidden hover:shadow-lg transition group"
    >
      <div className="relative h-48 w-full bg-gray-100">
        {vestiging.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vestiging.image_url}
            alt={vestiging.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-700 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-6 bg-primary-500">
        <h3 className="font-display text-xl font-bold text-secondary-400 mb-2">
          {vestiging.name}
        </h3>
        <p className="text-sm text-secondary-500 mb-4">
          {vestiging.address}, {vestiging.postal_code} {vestiging.city}
        </p>
        <p className="text-sm text-secondary-600 line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}


