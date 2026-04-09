"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "../AdminProvider";
import {
  canEditContent,
  canManageUsers,
  canManageVestigingen
} from "@/shared/lib/cms/permissions";
import type { UserRole } from "@/types";

function NavLinks({ role, onClick }: { role: UserRole | null; onClick?: () => void }) {
  const link = "block py-1.5 hover:text-primary transition-colors";
  return (
    <nav className="space-y-3 text-sm" onClick={onClick}>
      <Link className={link} href="/admin/vestigingen">Vestigingen</Link>
      {canEditContent(role) && <Link className={link} href="/admin/koten">Koten</Link>}
      {canEditContent(role) && <Link className={link} href="/admin/media">Media Library</Link>}
      <Link className={link} href="/admin/faq">FAQ</Link>
      {canManageVestigingen(role) && <Link className={link} href="/admin/settings">Site Settings</Link>}
      <Link className={link} href="/admin/audit-logs">Audit Logs</Link>
      {canManageUsers(role) && <Link className={link} href="/admin/users">Users & Roles</Link>}
      <Link className={link} href="/admin/leads">Leads & Aanmeldingen</Link>
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const {
    signOut,
    role,
    assignedVestigingen,
    activeVestigingId,
    setActiveVestigingId
  } = useAdmin();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-text-main flex">

      {/* Desktop sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6 hidden md:block flex-shrink-0">
        <div className="text-xl font-display font-bold text-primary mb-8">Admin</div>
        <NavLinks role={role ?? null} />
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
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 p-6 shadow-xl transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="text-xl font-display font-bold text-primary">Admin</div>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        </div>
        <NavLinks role={role ?? null} onClick={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-gray-200 bg-white px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu openen"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            </button>
            <span className="font-semibold text-sm md:text-base">Mijn-Kot CMS</span>
            <span className="text-xs text-text-muted uppercase hidden sm:inline">{role}</span>
            <select
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
              value={activeVestigingId ?? ""}
              onChange={(event) => setActiveVestigingId(event.target.value || null)}
            >
              {role === "super_admin" && <option value="">All vestigingen</option>}

              {assignedVestigingen.map((vestiging) => (
                <option key={vestiging.id} value={vestiging.id}>
                  {vestiging.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="text-sm text-text-muted hover:text-primary"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
