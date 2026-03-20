'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Vestiging } from "@/types";
import { useTranslation } from 'react-i18next';
import { getLocalizedData } from "@/shared/lib/i18n-utils";
import { MapPinIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export function VestigingCard({ vestiging }: { vestiging: Vestiging }) {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const locale = mounted ? i18n.language : 'nl';
    const description = getLocalizedData(vestiging, 'description', locale) || vestiging.description;

    return (
        <Link
            href={`/vestigingen/${vestiging.id}`}
            className="group bg-surface-card border border-border-light rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-large hover:border-primary-200 hover:-translate-y-0.5"
        >
            {/* Image */}
            <div className="relative h-52 w-full overflow-hidden bg-secondary-100">
                {vestiging.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={vestiging.image_url}
                        alt={vestiging.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                        Geen foto
                    </div>
                )}
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display text-base font-semibold text-neutral-500 mb-1.5 truncate group-hover:text-primary-600 transition-colors">
                    {vestiging.name}
                </h3>
                <p className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                    <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-primary-400" />
                    {vestiging.address}, {vestiging.postal_code} {vestiging.city}
                </p>
                {description && (
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed flex-1">
                        {description}
                    </p>
                )}
                <div className="flex items-center gap-1 mt-4 pt-4 border-t border-border-light text-xs font-semibold text-primary-600 group-hover:text-primary-800 transition-colors">
                    Bekijk locatie
                    <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
            </div>
        </Link>
    );
}
