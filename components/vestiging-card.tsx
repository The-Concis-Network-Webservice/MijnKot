'use client';

import Link from "next/link";
import type { Vestiging } from "../types";
import { useTranslation } from 'react-i18next';
import { getLocalizedData } from '../lib/i18n-utils';

export function VestigingCard({ vestiging }: { vestiging: Vestiging }) {
  const { i18n } = useTranslation();
  const description = getLocalizedData(vestiging, 'description', i18n.language);

  return (
    <Link
      href={`/vestigingen/${vestiging.id}`}
      className="block bg-surface-light border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition"
    >
      <h3 className="font-display text-xl font-bold text-text-main mb-2">
        {vestiging.name}
      </h3>
      <p className="text-sm text-text-muted mb-4">
        {vestiging.address}, {vestiging.postal_code} {vestiging.city}
      </p>
      <p className="text-sm text-text-main line-clamp-3">
        {description}
      </p>
    </Link>
  );
}

