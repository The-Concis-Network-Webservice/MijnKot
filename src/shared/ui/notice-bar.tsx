'use client';

import { X } from 'lucide-react';
import type { SiteSettings } from '@/types';

export function NoticeBar({
  settings,
  onDismiss
}: {
  settings?: SiteSettings;
  onDismiss: () => void;
}) {
  if (!settings?.notice_active || !settings?.notice_text) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary-600 text-white px-4 py-2.5 text-center text-sm font-medium">
      <span>{settings.notice_text}</span>
      <button
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Sluit melding"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
