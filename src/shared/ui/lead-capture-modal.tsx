'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function LeadCaptureModal() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user has already seen the modal or submitted
        const hasSeen = localStorage.getItem('has_seen_lead_modal');
        if (!hasSeen) {
            // Show after 3 seconds
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name }),
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
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 text-sm font-medium"
                >
                    Sluiten
                </button>

                <div className="p-8">
                    {step === 'form' ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-display font-semibold text-text-main mb-2">
                                    Als eerste op de hoogte?
                                </h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Meld je aan voor onze lijst en ontvang direct een mailtje zodra er nieuwe koten vrijkomen.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Jouw naam (optioneel)"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-subtle"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Jouw emailadres"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border-DEFAULT focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-subtle"
                                    />
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
                        <div className="text-center py-8">
                            <h3 className="text-xl font-semibold text-text-main mb-2">Aangemeld!</h3>
                            <p className="text-text-secondary">Check je mailbox, we hebben je alvast een welkom gestuurd.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
