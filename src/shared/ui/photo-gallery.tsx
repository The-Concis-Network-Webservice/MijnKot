'use client';

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import type { KotPhoto } from "@/types";
import { useTranslation } from 'react-i18next';

// Lazy load the lightbox component (code splitting)
const Lightbox = lazy(() => import('./lightbox').then(module => ({ default: module.Lightbox })));

export function PhotoGallery({ photos }: { photos: KotPhoto[] }) {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const ordered = [...photos].sort((a, b) => a.order_index - b.order_index);

  if (ordered.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl h-96 flex items-center justify-center text-gray-400 border border-gray-200">
        <div className="text-center">
          <p className="text-lg">{t('detail.no_photos') || 'Geen foto\'s beschikbaar'}</p>
        </div>
      </div>
    );
  }

  const images = ordered.map((photo, idx) => ({
    url: photo.image_url,
    alt: `Foto ${idx + 1}`
  }));

  const mainPhoto = ordered[0];
  const remainingCount = ordered.length - 1;

  return (
    <>
      <div className="relative group">
        {/* Main Photo with Optimization */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="relative w-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200"
          style={{ aspectRatio: '16/9' }}
        >
          <Image
            src={mainPhoto.image_url}
            alt="Hoofdfoto van de kamer"
            className="object-cover"
            priority // Eager load LCP
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-full font-medium shadow-sm">
              Bekijk foto's
            </div>
          </div>
        </button>

        {/* More Photos Button - Only show if there are more photos */}
        {remainingCount > 0 && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors border border-gray-200"
          >
            <span className="font-medium text-gray-900">
              {remainingCount === 1
                ? `+1 foto`
                : `+${remainingCount} foto's`}
            </span>
          </button>
        )}

        {/* Photo Counter - Top Left */}
        {ordered.length > 1 && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-sm rounded-lg">
            1 / {ordered.length}
          </div>
        )}
      </div>

      {/* Lightbox - Only load when opened (lazy loading & code splitting) */}
      {lightboxIndex !== null && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <div className="text-white">Laden...</div>
          </div>
        }>
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        </Suspense>
      )}
    </>
  );
}

