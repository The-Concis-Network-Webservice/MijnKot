'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SectionHeader } from "./section-header";
import type { SiteSettings } from "@/types";

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

            <div className="grid gap-6 md:grid-cols-3 mb-10 md:mb-16">
                {settings?.contact_email && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-5 md:p-8 text-center hover:shadow-soft transition-all">
                        <h3 className="font-semibold text-text-main mb-2">{t('contact.email_label')}</h3>
                        <p className="text-text-main text-sm">{settings.contact_email}</p>
                    </div>
                )}
                {settings?.contact_phone && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-5 md:p-8 text-center hover:shadow-soft transition-all">
                        <h3 className="font-semibold text-text-main mb-2">{t('contact.phone_label')}</h3>
                        <p className="text-text-main text-sm">{settings.contact_phone}</p>
                    </div>
                )}
                {settings?.contact_address && (
                    <div className="bg-surface-card border border-border-light rounded-xl p-5 md:p-8 text-center hover:shadow-soft transition-all">
                        <h3 className="font-semibold text-text-main mb-2">{t('contact.office_label')}</h3>
                        <p className="text-text-main text-sm">{settings.contact_address}</p>
                    </div>
                )}
                <div className="bg-surface-card border border-border-light rounded-xl p-5 md:p-8 text-center hover:shadow-soft transition-all">
                    <h3 className="font-semibold text-text-main mb-4">{t('contact.socials_label')}</h3>
                    <div className="flex justify-center gap-4">
                        <a
                            href="https://www.instagram.com/mijnkot.be/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-text-main hover:text-primary-600 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            Instagram
                        </a>
                        <a
                            href="https://www.facebook.com/mijnkot/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-text-main hover:text-primary-600 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-surface-card rounded-2xl p-5 sm:p-8 md:p-12 border border-border-light shadow-soft">
                <h3 className="text-2xl font-semibold font-display text-text-main mb-6 text-center">{t('contact.form_title')}</h3>

                {status === 'success' ? (
                    <div className="text-center py-12 bg-green-50 rounded-xl border border-green-100">
                        <h4 className="text-xl font-semibold text-green-800 mb-2">{t('contact.success_title')}</h4>
                        <p className="text-green-600">{t('contact.success_desc')}</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-6 text-sm font-medium text-green-700 hover:underline"
                        >
                            {t('contact.send_another')}
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
                                {t('contact.error_sending')}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-500 text-white rounded-lg font-medium shadow-soft hover:bg-primary-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? t('contact.submitting') : t('contact.submit_button')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

