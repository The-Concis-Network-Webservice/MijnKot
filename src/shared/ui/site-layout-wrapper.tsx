'use client';

import { usePathname } from 'next/navigation';
import { SiteNav } from './site-nav';
import { SiteFooter } from './site-footer';
import { LeadCaptureModal } from './lead-capture-modal';
import type { SiteSettings, Vestiging } from '@/types';

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
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <SiteNav vestigingen={vestigingen} settings={settings} />
      <main className="flex-1 pt-20">{children}</main>
      <SiteFooter settings={settings} />
      <LeadCaptureModal settings={settings} />
    </>
  );
}
