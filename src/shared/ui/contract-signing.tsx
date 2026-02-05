'use client';

import { useState } from "react";
import { useTranslation } from 'react-i18next';

export function ContractSigning() {
    const { t } = useTranslation();
    const [signed, setSigned] = useState(false);

    return (
        <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
            <h3 className="font-semibold text-base mb-4 text-text-main">{t('detail.contract_title')}</h3>

            {!signed ? (
                <>
                    <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                        {t('detail.contract_desc')}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setSigned(true)}
                            className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium shadow-soft hover:bg-primary-600 transition-colors"
                        >
                            {t('detail.sign_contract')}
                        </button>
                        <button className="w-full py-3 bg-surface-card text-text-main rounded-lg font-medium border border-border-DEFAULT hover:bg-surface-subtle transition-colors">
                            {t('detail.preview_pdf')}
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-6">
                    <div className="w-12 h-12 bg-state-success/10 text-state-success rounded-full flex items-center justify-center mx-auto mb-3 text-xl border-2 border-state-success/20">
                        ✓
                    </div>
                    <h4 className="font-semibold text-text-main mb-1">{t('detail.contract_signed_title')}</h4>
                    <p className="text-xs text-text-secondary">{t('detail.contract_signed_desc')}</p>
                </div>
            )}
        </div>
    );
}
