'use client';

import { useState, useEffect } from 'react';
import { Facebook, Instagram, Mail, MapPin, CheckCircle } from 'lucide-react';
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
                setError('Voer een geldig telefoonnummer in.');
                return;
            }
        }

        if (!consent) {
            setError('Je moet akkoord gaan met de voorwaarden.');
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
                alert("Er ging iets mis. Probeer het later opnieuw.");
            }
        } catch (err) {
            console.error(err);
            alert("Er ging iets mis.");
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
                    className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors px-2 py-1 text-sm font-medium bg-secondary-100 rounded-lg"
                >
                    Sluiten
                </button>

                <div className="p-8">
                    {step === 'form' ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-display font-semibold text-text-main mb-2">
                                    {settings?.popup_title || "Als eerste op de hoogte?"}
                                </h2>
                                <p className="text-neutral-600 leading-relaxed">
                                    {settings?.popup_text || "Meld je aan voor onze lijst en ontvang direct een mailtje zodra er nieuwe koten vrijkomen."}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Jouw naam (optioneel)"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-secondary-50/50 text-text-main placeholder:text-neutral-400"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Telefoonnummer (optioneel)"
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-border-light'} focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-secondary-50/50 text-text-main placeholder:text-neutral-400`}
                                    />
                                    {error && (
                                        <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Jouw emailadres"
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
                                        Ik ga akkoord met de verwerking van mijn gegevens en wil graag updates ontvangen. Bekijk onze <a href="/privacy" className="text-primary-600 hover:underline">privacyverklaring</a> voor meer info.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-medium shadow-soft hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Momentje...' : 'Hou mij op de hoogte →'}
                                </button>

                                <p className="text-xs text-center text-text-muted mt-4">
                                    Geen spam, beloofd. Uitschrijven kan altijd.
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
                            <h3 className="text-2xl font-display font-semibold text-text-main mb-3">Aangemeld!</h3>
                            <p className="text-neutral-600 mb-6 max-w-[280px] mx-auto">
                                Check je mailbox, we hebben je alvast een welkom gestuurd.
                            </p>
                            <button
                                onClick={handleClose}
                                className="text-sm font-medium text-text-muted hover:text-text-main transition-colors"
                            >
                                Sluiten
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
