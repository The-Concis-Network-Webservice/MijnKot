'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SectionHeader } from "./section-header";
import type { SiteSettings } from "@/types";
import { siteConfig } from "@/shared/lib/config";
<<<<<<< HEAD
=======
import { Facebook, Instagram, Mail, MapPin } from 'lucide-react';
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707

export function ContactView({ settings }: { settings: SiteSettings | null }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        const payload = {
            ...formData,
            subject: formData.subject === 'viewing' 
                ? t('contact.subject_viewing') 
                : formData.subject === 'technical' 
                ? t('contact.subject_technical') 
                : t('contact.subject_general')
        };

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader
                title="contact.title"
                description="contact.description"
                centered
            />

<<<<<<< HEAD
            <div className="grid gap-6 md:grid-cols-3 mb-16">
                {settings?.contact_email && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-8 text-center hover:shadow-soft transition-all">
                        <h3 className="font-semibold text-text-main mb-2">{t('contact.email_label')}</h3>
                        <p className="text-text-main text-sm">{settings.contact_email}</p>
                    </div>
                )}
                {settings?.contact_phone && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-8 text-center hover:shadow-soft transition-all">
                        <h3 className="font-semibold text-text-main mb-2">{t('contact.phone_label')}</h3>
                        <p className="text-text-main text-sm">{settings.contact_phone}</p>
                    </div>
                )}
                {settings?.contact_address && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-8 text-center hover:shadow-soft transition-all">
                        <h3 className="font-semibold text-text-main mb-2">{t('contact.office_label')}</h3>
                        <p className="text-text-main text-sm">{settings.contact_address}</p>
                    </div>
                )}
=======
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mb-16">
                {(settings?.contact_email || siteConfig.company.contact.email) && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-4 sm:p-6 text-center hover:shadow-soft transition-all h-full flex flex-col justify-center items-center group overflow-hidden">
                        <a 
                            href={`mailto:${settings?.contact_email || siteConfig.company.contact.email}`}
                            className="p-3 rounded-full bg-secondary-400/30 group-hover:bg-secondary-500/50 transition-colors mb-3"
                        >
                            <Mail className="w-6 h-6 text-text-main group-hover:text-primary-500 transition-colors" />
                        </a>
                        <h3 className="font-semibold text-text-main mb-1">{t('contact.email_label')}</h3>
                        <p className="text-text-main text-xs whitespace-nowrap truncate w-full opacity-80" title={settings?.contact_email || siteConfig.company.contact.email}>
                            {settings?.contact_email || siteConfig.company.contact.email}
                        </p>
                    </div>
                )}
                {(settings?.contact_address || siteConfig.company.address.street) && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-4 sm:p-6 text-center hover:shadow-soft transition-all h-full flex flex-col justify-center items-center group overflow-hidden">
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.contact_address || `${siteConfig.company.address.street}, ${siteConfig.company.address.postalCode} ${siteConfig.company.address.city}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-secondary-400/30 group-hover:bg-secondary-500/50 transition-colors mb-3"
                        >
                            <MapPin className="w-6 h-6 text-text-main group-hover:text-primary-500 transition-colors" />
                        </a>
                        <h3 className="font-semibold text-text-main mb-1">{t('contact.office_label')}</h3>
                        <p className="text-text-main text-xs opacity-80 whitespace-nowrap truncate w-full" title={settings?.contact_address || `${siteConfig.company.address.street}, ${siteConfig.company.address.postalCode} ${siteConfig.company.address.city}`}>
                            {settings?.contact_address || `${siteConfig.company.address.street}, ${siteConfig.company.address.postalCode} ${siteConfig.company.address.city}`}
                        </p>
                    </div>
                )}
                <div className="bg-surface-card border border-border-light rounded-xl p-6 text-center hover:shadow-soft transition-all h-full flex flex-col justify-center items-center group">
                    <div className="flex gap-4 mb-4">
                        <a 
                            href="https://www.facebook.com/mijnkot/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-secondary-400/30 hover:bg-primary-500 hover:text-white text-text-main transition-all transform hover:scale-110"
                            title={t('contact.social_facebook' as any)}
                        >
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a 
                            href="https://www.instagram.com/mijnkot.be/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-secondary-400/30 hover:bg-primary-500 hover:text-white text-text-main transition-all transform hover:scale-110"
                            title={t('contact.social_instagram' as any)}
                        >
                            <Instagram className="w-6 h-6" />
                        </a>
                    </div>
                    <h3 className="font-semibold text-text-main">{t('contact.socials_label')}</h3>
                </div>
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
            </div>

            <div className="bg-surface-card rounded-2xl p-8 md:p-12 border border-border-light shadow-soft">
                <h3 className="text-2xl font-semibold font-display text-text-main mb-6 text-center">{t('contact.form_title')}</h3>

                {status === 'success' ? (
                    <div className="text-center py-12 bg-green-50 rounded-xl border border-green-100">
                        <h4 className="text-xl font-semibold text-green-800 mb-2">Bericht verzonden!</h4>
                        <p className="text-green-600">We hebben je bericht goed ontvangen en nemen zo snel mogelijk contact op.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-6 text-sm font-medium text-green-700 hover:underline"
                        >
                            Nog een bericht sturen
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-2">{t('contact.name_label')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card text-text-main"
                                    placeholder={t('contact.name_placeholder')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-2">{t('contact.email_label')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card text-text-main"
                                    placeholder={t('contact.email_placeholder')}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">{t('contact.subject_label')}</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card text-text-main"
                            >
                                <option value="">{t('contact.subject_general')}</option>
                                <option value="viewing">{t('contact.subject_viewing')}</option>
                                <option value="technical">{t('contact.subject_technical')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">{t('contact.message_label')}</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-border-light focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card resize-none text-text-main"
                                placeholder={t('contact.message_placeholder')}
                            ></textarea>
                        </div>

                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
                                Er ging iets mis bij het versturen. Probeer het later opnieuw.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-500 text-white rounded-lg font-medium shadow-soft hover:bg-primary-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verzenden...' : t('contact.submit_button')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

