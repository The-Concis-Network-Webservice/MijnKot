'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
    images: { url: string; alt: string }[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
    const current = images[currentIndex];
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < images.length - 1;

    const handlePrev = useCallback(() => {
        if (hasPrev) onNavigate(currentIndex - 1);
    }, [currentIndex, hasPrev, onNavigate]);

    const handleNext = useCallback(() => {
        if (hasNext) onNavigate(currentIndex + 1);
    }, [currentIndex, hasNext, onNavigate]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [handlePrev, handleNext, onClose]);

    // Touch gestures
    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && hasNext) handleNext();
                if (diff < 0 && hasPrev) handlePrev();
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handlePrev, handleNext, hasPrev, hasNext]);

    const stopPropagation = (e: any) => e.stopPropagation();

    // Create portal only on client
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center animate-fade-in"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm text-sm font-medium"
                aria-label="Sluiten"
            >
                Sluiten
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous button */}
            {hasPrev && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm text-3xl"
                    aria-label="Vorige foto"
                >
                    ❮
                </button>
            )}

            {/* Next button */}
            {hasNext && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm text-3xl"
                    aria-label="Volgende foto"
                >
                    ❯
                </button>
            )}

            {/* Main image */}
            <div
                className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                onClick={stopPropagation}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={current.url}
                    alt={current.alt}
                    className="max-w-full max-h-full object-contain"
                    loading="eager"
                />
            </div>

            {/* Thumbnail strip (optional, for desktop) */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex gap-2 max-w-full overflow-x-auto px-4">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate(idx);
                            }}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                ? 'border-white scale-110'
                                : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                                }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img.url}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>,
        document.body
    );
}
