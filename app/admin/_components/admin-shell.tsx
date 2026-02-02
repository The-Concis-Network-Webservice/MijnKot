"use client";

import Link from "next/link";
import { useAdmin } from "../AdminProvider";
import {
  canEditContent,
  canManageUsers,
  canManageVestigingen
} from "../../../lib/cms/permissions";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const {
    signOut,
    role,
    assignedVestigingen,
    activeVestigingId,
    setActiveVestigingId
  } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-50 text-text-main flex">
      <aside className="w-64 border-r border-gray-200 bg-white p-6 hidden md:block">
        <div className="text-xl font-display font-bold text-primary mb-8">
          Admin
        </div>
        <nav className="space-y-3 text-sm">
          <Link className="block hover:text-primary" href="/admin/vestigingen">
            Vestigingen
          </Link>
          {canEditContent(role) ? (
            <Link className="block hover:text-primary" href="/admin/koten">
              Koten
            </Link>
          ) : null}
          {canEditContent(role) ? (
            <Link className="block hover:text-primary" href="/admin/media">
              Media Library
            </Link>
          ) : null}
          <Link className="block hover:text-primary" href="/admin/faq">
            FAQ
          </Link>
          {canManageVestigingen(role) ? (
            <Link className="block hover:text-primary" href="/admin/settings">
              Site Settings
            </Link>
          ) : null}
          <Link className="block hover:text-primary" href="/admin/audit-logs">
            Audit Logs
          </Link>
          {canManageUsers(role) ? (
            <Link className="block hover:text-primary" href="/admin/users">
              Users & Roles
            </Link>
          ) : null}
          <Link className="block hover:text-primary" href="/admin/leads">
            Leads & Aanmeldingen
          </Link>
        </nav>
      </aside>
      <div className="flex-1">
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Mijn-Kot CMS</span>
            <span className="text-xs text-text-muted uppercase">{role}</span>
            <select
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
              value={activeVestigingId ?? ""}
              onChange={(event) =>
                setActiveVestigingId(event.target.value || null)
              }
            >
              {role === "super_admin" ? (
                <option value="">All vestigingen</option>
              ) : null}
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
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

