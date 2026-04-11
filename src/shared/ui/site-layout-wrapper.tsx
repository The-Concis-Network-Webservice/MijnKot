'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SiteNav } from './site-nav';
import { SiteFooter } from './site-footer';
import { LeadCaptureModal } from './lead-capture-modal';
import { NoticeBar } from './notice-bar';
import { CookieBanner } from './cookie-banner';
import type { SiteSettings, Vestiging } from '@/types';

const NOTICE_H = 40; // px — hoogte van de notice bar

export function SiteLayoutWrapper({
  children,
  vestigingen,
  settings
}: {
  children: React.ReactNode;
  vestigingen: Vestiging[];
  settings?: SiteSettings;
}) {
  const pathname = usePathname();
  const hasNotice = !!(settings?.notice_active && settings?.notice_text);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const noticeVisible = hasNotice && !noticeDismissed;

  if (pathname.startsWith('/admin')) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      {noticeVisible && (
        <NoticeBar settings={settings} onDismiss={() => setNoticeDismissed(true)} />
      )}
      <SiteNav
        vestigingen={vestigingen}
        settings={settings}
        topOffset={noticeVisible ? NOTICE_H : 0}
      />
      <main
        className="flex-1"
        style={{ paddingTop: noticeVisible ? `${NOTICE_H + 80}px` : '80px' }}
      >
        {children}
      </main>
      <SiteFooter settings={settings} />
      <LeadCaptureModal settings={settings} />
      <CookieBanner />
    </>
  );
}
