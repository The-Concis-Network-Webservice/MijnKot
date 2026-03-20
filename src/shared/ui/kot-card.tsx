'use client';

import Link from "next/link";
import Image from "next/image";
import type { Kot, KotPhoto } from "@/types";
import { useTranslation } from 'react-i18next';
import { getLocalizedData } from "@/shared/lib/i18n-utils";
import { MapPinIcon } from "@heroicons/react/24/outline";

type KotWithPhoto = Kot & { kot_photos?: KotPhoto[]; vestiging_city?: string };

function getCoverPhoto(photos?: KotPhoto[]) {
    if (!photos || photos.length === 0) return null;
    return [...photos].sort((a, b) => a.order_index - b.order_index)[0]?.image_url;
}

export function KotCard({ kot }: { kot: KotWithPhoto }) {
    const { i18n } = useTranslation();
    const cover = getCoverPhoto(kot.kot_photos);

    const title = getLocalizedData(kot, 'title', i18n.language);
    const description = getLocalizedData(kot, 'description', i18n.language);

    const isAvailable = kot.availability_status === 'available';
    const isReserved = kot.availability_status === 'reserved';

    const statusLabel = isAvailable ? 'Beschikbaar' : isReserved ? 'Gereserveerd' : 'Verhuurd';
    const statusClass = isAvailable
        ? 'text-state-success border-state-success/30 bg-white'
        : isReserved
            ? 'text-state-warning border-state-warning/30 bg-white'
            : 'text-state-error border-state-error/30 bg-white';

    return (
        <Link
            href={`/koten/${kot.id}`}
            className="group bg-surface-card border border-border-light rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-large hover:border-primary-200 hover:-translate-y-0.5"
        >
            {/* Photo */}
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary-100">
                {cover ? (
                    <Image
                        alt={title}
                        src={cover}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                        Geen foto
                    </div>
                )}

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Price — bottom left on photo */}
                <div className="absolute bottom-3 left-3">
                    <span className="inline-block bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm font-bold text-neutral-500 shadow-subtle">
                        €{kot.price}<span className="text-xs font-normal text-text-muted">/mnd</span>
                    </span>
                </div>

                {/* Status — top right */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${statusClass}`}>
                    {statusLabel}
                </span>

                {/* Highlighted ribbon */}
                {kot.is_highlighted && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-accent-500 text-white">
                        Uitgelicht
                    </span>
                )}
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-sm text-neutral-500 line-clamp-1 mb-2 group-hover:text-primary-600 transition-colors">
                    {title}
                </h3>

                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed flex-1">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                    {kot.vestiging_city ? (
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                            <MapPinIcon className="w-3 h-3 shrink-0" />
                            {kot.vestiging_city}
                        </span>
                    ) : <span />}
                    <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-800 transition-colors">
                        Bekijk →
                    </span>
                </div>
            </div>
        </Link>
    );
}
