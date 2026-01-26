'use client';

import Link from "next/link";
import type { Kot, KotPhoto } from "../types";
import { useTranslation } from 'react-i18next';
import { getLocalizedData } from '../lib/i18n-utils';

type KotWithPhoto = Kot & { kot_photos?: KotPhoto[] };

function getCoverPhoto(photos?: KotPhoto[]) {
  if (!photos || photos.length === 0) return null;
  return [...photos].sort((a, b) => a.order_index - b.order_index)[0]?.image_url;
}

export function KotCard({ kot }: { kot: KotWithPhoto }) {
  const { t, i18n } = useTranslation();
  const cover = getCoverPhoto(kot.kot_photos);

  const title = getLocalizedData(kot, 'title', i18n.language);
  const description = getLocalizedData(kot, 'description', i18n.language);

  // Map status to translation key
  const statusLabel = t(`status.${kot.availability_status}` as any);

  const statusColors = {
    'available': 'bg-state-success/10 text-state-success border-state-success/20',
    'rented': 'bg-state-error/10 text-state-error border-state-error/20',
    'option': 'bg-state-warning/10 text-state-warning border-state-warning/20',
    'pending': 'bg-state-info/10 text-state-info border-state-info/20',
  }[kot.availability_status] || 'bg-surface-subtle text-text-muted border-border-light';

  return (
    <Link
      href={`/koten/${kot.id}`}
      className="group bg-surface-card border border-border-light rounded-xl overflow-hidden hover:shadow-medium transition-all flex flex-col"
    >
      <div className="relative h-56 bg-surface-subtle">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={cover}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-text-muted">
            {t('common.no_data')}
          </div>
        )}
        <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusColors}`}>
          {statusLabel}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-text-main line-clamp-1 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <span className="text-primary-600 font-semibold text-lg whitespace-nowrap ml-4">
            €{kot.price}
            <span className="text-xs text-text-muted font-normal ml-1">{t('detail.per_month')}</span>
          </span>
        </div>
        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-4 flex-1">{description}</p>

        <div className="pt-4 border-t border-border-light">
          <span className="text-sm font-medium text-primary-600 group-hover:underline">{t('common.read_more')} {t('common.arrow')}</span>
        </div>
      </div>
    </Link>
  );
}
