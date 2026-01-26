'use client';

import { useTranslation } from 'react-i18next';
import { SectionHeader } from "./section-header";
import type { SiteSettings } from "../types";

export function ContactView({ settings }: { settings: SiteSettings | null }) {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader
                title="contact.title"
                description="contact.description"
                centered
            />

            <div className="grid gap-6 md:grid-cols-3 mb-16">
                <div className="bg-surface-card border border-border-light rounded-xl p-8 text-center hover:shadow-soft transition-all">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">✉️</div>
                    <h3 className="font-semibold text-text-main mb-2">{t('contact.email_label')}</h3>
                    <p className="text-text-secondary text-sm">{settings?.contact_email || 'info@mijn-kot.be'}</p>
                </div>
                <div className="bg-surface-card border border-border-light rounded-xl p-8 text-center hover:shadow-soft transition-all">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">📞</div>
                    <h3 className="font-semibold text-text-main mb-2">{t('contact.phone_label')}</h3>
                    <p className="text-text-secondary text-sm">{settings?.contact_phone || '+32 123 45 67 89'}</p>
                </div>
                <div className="bg-surface-card border border-border-light rounded-xl p-8 text-center hover:shadow-soft transition-all">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">📍</div>
                    <h3 className="font-semibold text-text-main mb-2">{t('contact.office_label')}</h3>
                    <p className="text-text-secondary text-sm">{settings?.contact_address || 'Leuven, Belgium'}</p>
                </div>
            </div>

            <div className="bg-surface-card rounded-2xl p-8 md:p-12 border border-border-light shadow-soft">
                <h3 className="text-2xl font-semibold font-display text-text-main mb-6 text-center">{t('contact.form_title')}</h3>
                <form className="space-y-6 max-w-xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">{t('contact.name_label')}</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-border-DEFAULT focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card" placeholder={t('contact.name_placeholder')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">{t('contact.email_label')}</label>
                            <input type="email" className="w-full px-4 py-3 rounded-lg border border-border-DEFAULT focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card" placeholder={t('contact.email_placeholder')} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">{t('contact.subject_label')}</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-border-DEFAULT focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card">
                            <option>{t('contact.subject_general')}</option>
                            <option>{t('contact.subject_viewing')}</option>
                            <option>{t('contact.subject_technical')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">{t('contact.message_label')}</label>
                        <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-border-DEFAULT focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-surface-card resize-none" placeholder={t('contact.message_placeholder')}></textarea>
                    </div>
                    <button type="submit" className="w-full py-4 bg-primary-500 text-white rounded-lg font-medium shadow-soft hover:bg-primary-600 transition-colors">
                        {t('contact.submit_button')}
                    </button>
                </form>
            </div>
        </div>
    );
}
