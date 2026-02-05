'use client';

import { useState } from "react";
import { useTranslation } from 'react-i18next';

export function DocumentUpload() {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

    const handleUpload = () => {
        setStatus('uploading');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="bg-surface-card p-6 rounded-xl border border-border-light">
            <h3 className="font-semibold text-base mb-4 text-text-main">{t('detail.documents_title')}</h3>
            <div className="p-6 border-2 border-dashed border-border-DEFAULT rounded-lg bg-surface-subtle text-center hover:bg-surface-subtle hover:border-primary-300 transition-colors cursor-pointer">
                {status === 'success' ? (
                    <div className="text-state-success font-medium py-2">{t('detail.upload_success')}</div>
                ) : (
                    <div className="text-text-secondary text-sm">
                        <p className="font-medium text-text-main mb-1">{t('detail.upload_prompt')}</p>
                        <p className="text-xs">{t('detail.upload_helper')}</p>
                    </div>
                )}
                <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </div>

            {file && status !== 'success' && (
                <button
                    onClick={handleUpload}
                    className="mt-4 w-full py-2.5 bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors shadow-subtle"
                >
                    {status === 'uploading' ? t('detail.uploading') : `${t('detail.upload_button')} ${file.name}`}
                </button>
            )}

            <p className="text-xs text-text-muted mt-4 leading-relaxed bg-surface-subtle p-3 rounded-lg">
                {t('detail.privacy_notice')}
            </p>
        </div>
    );
}
