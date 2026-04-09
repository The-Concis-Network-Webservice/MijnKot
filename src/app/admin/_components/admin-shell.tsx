"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Building2, 
  Home, 
  Image, 
  HelpCircle, 
  Settings, 
  ShieldCheck, 
  Users, 
  ClipboardList,
  LogOut,
  Menu,
  ChevronDown,
  X
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAdmin } from "../AdminProvider";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/shared/ui/language-switcher";
import {
  canEditContent,
  canManageUsers,
  canManageVestigingen
} from "@/shared/lib/cms/permissions";
import type { UserRole } from "@/types";

function NavLinks({ role, onClick }: { role: UserRole | null; onClick?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const links = [
    { href: "/admin/vestigingen", label: t('admin.view.locations', 'Vestigingen'), icon: Building2, show: true },
    { href: "/admin/koten", label: t('admin.view.koten', 'Koten'), icon: Home, show: canEditContent(role) },
    { href: "/admin/media", label: t('admin.view.media', 'Mediabibliotheek'), icon: Image, show: canEditContent(role) },
    { href: "/admin/faq", label: t('admin.view.faq', 'FAQ'), icon: HelpCircle, show: true },
    { href: "/admin/leads", label: t('admin.view.leads', 'Leads'), icon: ClipboardList, show: true },
    { href: "/admin/settings", label: t('admin.view.settings', 'Site Instellingen'), icon: Settings, show: canManageVestigingen(role) },
    { href: "/admin/audit-logs", label: t('admin.view.logs', 'Systeemlogboeken'), icon: ShieldCheck, show: true },
    { href: "/admin/users", label: t('admin.view.users', 'Gebruikers & Rollen'), icon: Users, show: canManageUsers(role) },
  ];

  return (
    <nav className="space-y-1" onClick={onClick}>
      {links.filter(l => l.show).map((l) => {
        const isActive = pathname === l.href;
        const Icon = l.icon;
        return (
          <Link 
            key={l.href}
            href={l.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive 
                ? "bg-primary-50 text-primary-600 shadow-sm" 
                : "text-text-muted hover:text-text-main hover:bg-gray-100"
            }`}
          >
            <Icon className={`w-4.5 h-4.5 ${isActive ? "text-primary-500" : "text-gray-400"}`} strokeWidth={2} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const {
    assignedVestigingen,
    activeVestigingId,
    setActiveVestigingId,
    signOut,
    role,
    user
  } = useAdmin();
  const { t } = useTranslation();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-text-main flex">

      {/* Desktop sidebar */}
      <aside className="w-68 border-r border-gray-100 bg-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 pb-2">
          <Link href="/admin" className="block px-3 mb-8">
             <div className="text-xl font-display font-bold text-primary flex items-center gap-2">
                Mijn-Kot <span className="text-primary-500/80">CMS</span>
             </div>
          </Link>
          <NavLinks role={role ?? null} />
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-50 bg-gray-50/30">
           <button
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
            onClick={() => signOut()}
          >
            <LogOut className="w-4.5 h-4.5" />
            {t('common.logout', 'Uitloggen')}
          </button>
        </div>
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 p-6 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="text-xl font-display font-bold text-primary">Mijn-Kot CMS</div>
          <button
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavLinks role={role ?? null} onClick={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
              {/* Hamburger - mobile only */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label={t('admin.common.open_menu', 'Menu openen')}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-3">
                 <div className="relative flex items-center decoration-primary-500">
                    <div className="absolute left-3 text-gray-400">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <select
                      className="appearance-none bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl pl-9 pr-10 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                      value={activeVestigingId ?? ""}
                      onChange={(event) => setActiveVestigingId(event.target.value || null)}
                    >
                      {role === "super_admin" && <option value="">{t('admin.common.all_locations', 'Alle vestigingen')}</option>}
                      {assignedVestigingen.map((vestiging) => (
                        <option key={vestiging.id} value={vestiging.id}>
                          {vestiging.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 pointer-events-none text-gray-400">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <LanguageSwitcher />
                 <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-semibold text-text-main leading-tight">{user?.email}</span>
                    <span className="text-[10px] text-text-muted">
                      {role?.replace('_', ' ')} · {t('admin.common.logged_in', 'Ingelogd')}
                    </span>
                 </div>
               
                <button
                 className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hidden md:block"
                 onClick={() => signOut()}
                 title={t('common.logout', 'Uitloggen')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>
        <main className="p-4 md:p-8 animate-in fade-in duration-500">{children}</main>
      </div>
    </div>
  );
}
