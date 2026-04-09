'use client';

import { useState, useEffect } from 'react';
import { Facebook, Instagram, Mail, MapPin, CheckCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '@/shared/lib/config';
import type { SiteSettings } from '@/types';
import { usePathname } from 'next/navigation';

export function LeadCaptureModal({ 
    settings 
}: { 
    settings?: SiteSettings 
}) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        // Check if user has already seen the modal or submitted
        const hasSeen = localStorage.getItem('has_seen_lead_modal');
        const isPopupActive = settings?.popup_active ?? false;
        const isAdmin = pathname?.startsWith('/admin');

        if (!hasSeen && isPopupActive && !isAdmin) {
            // Show after 3 seconds
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [settings?.popup_active, pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Optional phone validation: only check if not empty
        if (phone && phone.trim().length > 0) {
            const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
            if (!phoneRegex.test(phone)) {
                setError(t('modal.error_phone'));
                return;
            }
        }

        if (!consent) {
            setError(t('modal.error_consent'));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, phone }),
            });

            if (res.ok) {
                setStep('success');
                localStorage.setItem('has_seen_lead_modal', 'true');
                // Close after 2.5s
                setTimeout(() => {
                    setIsOpen(false);
                }, 2500);
            } else {
                setError(t('modal.error_generic'));
            }
        } catch (err) {
            console.error(err);
            setError(t('modal.error_generic'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('has_seen_lead_modal', 'true'); // Don't show again if manually closed
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-in">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors bg-neutral-100 hover:bg-neutral-200 p-2 rounded-full"
                    aria-label={t('modal.close')}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {step === 'form' ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-display font-semibold text-text-main mb-2">
                                    {settings?.popup_title || t('modal.title')}
                                </h2>
                                <p className="text-neutral-600 leading-relaxed">
                                    {settings?.popup_text || t('modal.desc')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t('modal.name_placeholder')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-secondary-50/50 text-text-main placeholder:text-neutral-400"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder={t('modal.phone_placeholder')}
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        className={`w-full px-4 py-3 rounded-xl border ${error === t('modal.error_phone') ? 'border-red-500' : 'border-border-light'} focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-secondary-50/50 text-text-main placeholder:text-neutral-400`}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        required
                                        placeholder={t('modal.email_placeholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-secondary-50/50 text-text-main placeholder:text-neutral-400"
                                    />
                                </div>

                                <div className="flex items-start gap-3 px-1">
                                    <input
                                        type="checkbox"
                                        id="gdpr-consent"
                                        checked={consent}
                                        onChange={(e) => {
                                            setConsent(e.target.checked);
                                            if (error) setError(null);
                                        }}
                                        className="mt-1 w-4 h-4 rounded border-border-light text-primary-600 focus:ring-primary-100 transition"
                                    />
                                    <label htmlFor="gdpr-consent" className="text-xs text-neutral-500 leading-tight">
                                        {t('modal.consent')}
                                    </label>
                                </div>

                                {error && (
                                    <p className="text-xs text-red-500 font-medium px-1 text-center">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-medium shadow-soft hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? t('modal.loading') : t('modal.submit')}
                                </button>

                                <p className="text-xs text-center text-neutral-500 mt-5 mb-2 font-medium">
                                    {t('modal.no_spam')}
                                </p>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10 animate-fade-in">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-green-50">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-display font-semibold text-text-main mb-3">{t('modal.success_title')}</h3>
                            <p className="text-neutral-600 mb-6 max-w-[280px] mx-auto">
                                {t('modal.success_desc')}
                            </p>
                            <button
                                onClick={handleClose}
                                className="text-sm font-medium text-text-muted hover:text-text-main transition-colors"
                            >
                                {t('modal.close')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
