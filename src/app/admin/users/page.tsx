"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { useAdmin } from "../AdminProvider";
import { useTranslation } from "react-i18next";
import type { Profile, UserRole, Vestiging } from "@/types";

type Assignment = { user_id: string; vestiging_id: string };

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [vestigingen, setVestigingen] = useState<Vestiging[]>([]);
  const [newUser, setNewUser] = useState({ email: "", password: "", full_name: "", role: "admin" as UserRole });
  const [loading, setLoading] = useState(false);
  const { push } = useToast();
  const { role, user: currentUser } = useAdmin();
  const { t } = useTranslation();

  const ROLE_LABELS: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: t('admin.common.role_admin', "Beheerder (Admin)"),
    editor: t('admin.common.role_editor', "Redacteur (Editor)"),
    viewer: t('admin.common.role_viewer', "Kijker (Viewer)")
  };

  const loadData = async () => {
    const res = await fetch("/api/cms/users");
    const payload = await res.json();
    if (res.ok) {
      setProfiles(payload.profiles ?? []);
      setAssignments(payload.assignments ?? []);
    }
    const vestigingenRes = await fetch("/api/cms/vestigingen");
    const vestigingenPayload = await vestigingenRes.json();
    setVestigingen(vestigingenPayload.data ?? []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateUser = async (id: string, role: UserRole, vestigingIds: string[]) => {
    const res = await fetch("/api/cms/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, role, vestigingIds })
    });
    let payload: { error?: string } | null = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    if (!res.ok) {
      push(payload?.error ?? t('admin.common.update_error', "Bijwerken van gebruiker mislukt."), "error");
      return;
    }
    push(t('admin.common.update_success', "Gebruiker bijgewerkt."));
    await loadData();
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/cms/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    const payload = await res.json();
    if (!res.ok) {
      push(payload.error ?? t('admin.common.create_error', "Aanmaken van gebruiker mislukt."), "error");
    } else {
      push(t('admin.common.create_success', "Gebruiker aangemaakt."));
      setNewUser({ email: "", password: "", full_name: "", role: "admin" });
      await loadData();
    }
    setLoading(false);
  };

  const deleteUser = async (id: string, email: string) => {
    if (id === currentUser?.id) {
       push(t('admin.users.delete_self_error', "Je kunt jezelf niet verwijderen."), "error");
       return;
    }
    if (!confirm(t('admin.users.delete_confirm', `Gebruiker ${email} verwijderen?`, { email }))) return;
    const res = await fetch("/api/cms/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      push(t('admin.common.delete_success', "Gebruiker verwijderd."));
      await loadData();
    } else {
      const payload = await res.json();
      push(payload.error ?? t('admin.common.delete_error', "Verwijderen mislukt."), "error");
    }
  };

  const getAssignments = (userId: string) =>
    assignments.filter((a) => a.user_id === userId).map((a) => a.vestiging_id);

  return (
    <AdminGuard>
      <AdminShell>
        <PageHeader
          title={t('admin.users.title', "Gebruikers & rollen")}
          description={t('admin.users.description', "Wijs rollen en vestigingen toe.")}
          crumbs={[{ label: "CMS", href: "/admin" }, { label: t('admin.view.users', "Gebruikers") }]}
        />
        {role !== "super_admin" ? (
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-text-muted">
              {t('admin.users.restrict_msg', "Alleen Super Admins kunnen gebruikers beheren.")}
            </p>
          </section>
        ) : (
          <div className="space-y-8">
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">{t('admin.users.add_title', "Gebruiker Toevoegen")}</h2>
              <form onSubmit={createUser} className="grid md:grid-cols-2 gap-4">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder={t('admin.users.email_placeholder', "Email adres")}
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder={t('admin.users.password_placeholder', "Wachtwoord")}
                  type="password"
                  required
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder={t('admin.users.name_placeholder', "Volledige naam")}
                  value={newUser.full_name}
                  onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                />
                <select
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                >
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  >
                    {loading ? t('admin.common.creating', "Aanmaken...") : t('admin.users.add_title', "Gebruiker Aanmaken")}
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-4">{t('admin.users.existing_title', "Bestaande Gebruikers")}</h2>
              {profiles.map((profile) => {
                const assigned = getAssignments(profile.id);
                return (
                  <div key={profile.id} className="border border-gray-100 rounded-xl p-4 space-y-3 hover:border-primary-100 transition-colors shadow-sm bg-gray-50/30">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                          {profile.email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {profile.email}
                            {profile.id === currentUser?.id && (
                              <span className="text-[10px] bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{t('admin.users.you', 'Jij')}</span>
                            )}
                          </p>
                          <p className="text-xs text-text-muted">{profile.full_name || t('admin.users.no_name', "Geen naam ingevuld")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                          value={profile.role}
                          onChange={(event) =>
                            updateUser(profile.id, event.target.value as UserRole, assigned)
                          }
                        >
                          {Object.entries(ROLE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteUser(profile.id, profile.email || profile.id)}
                          disabled={profile.id === currentUser?.id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-0"
                          title={t('admin.common.delete', "Gebruiker verwijderen")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">{t('admin.users.assigned_vestigingen', "Toegewezen Vestigingen")}</p>
                      <div className="flex flex-wrap gap-4 text-sm mt-1">
                        {vestigingen.map((vestiging) => {
                          const checked = assigned.includes(vestiging.id);
                          return (
                            <label key={vestiging.id} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                className="rounded text-primary-500 focus:ring-primary-400 h-4 w-4"
                                checked={checked}
                                onChange={() => {
                                  const next = checked
                                    ? assigned.filter((id) => id !== vestiging.id)
                                    : [...assigned, vestiging.id];
                                  updateUser(profile.id, profile.role, next);
                                }}
                              />
                              <span className={`transition-colors ${checked ? 'text-primary-700 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>
                                {vestiging.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              {profiles.length === 0 ? (
                <p className="text-sm text-text-muted italic">{t('admin.users.no_users', "Geen gebruikers gevonden.")}</p>
              ) : null}
            </section>
          </div>
        )}
      </AdminShell>
    </AdminGuard>
  );
}


