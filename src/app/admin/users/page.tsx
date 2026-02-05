"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { useAdmin } from "../AdminProvider";
import type { Profile, UserRole, Vestiging } from "@/types";

type Assignment = { user_id: string; vestiging_id: string };

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [vestigingen, setVestigingen] = useState<Vestiging[]>([]);
  const { push } = useToast();
  const { role } = useAdmin();

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
      push(payload?.error ?? "Failed to update user.", "error");
      return;
    }
    push("User updated.");
    await loadData();
  };

  const getAssignments = (userId: string) =>
    assignments.filter((a) => a.user_id === userId).map((a) => a.vestiging_id);

  return (
    <AdminGuard>
      <AdminShell>
        <PageHeader
          title="Users & roles"
          description="Assign roles and vestigingen."
          crumbs={[{ label: "CMS", href: "/admin" }, { label: "Users" }]}
        />
        {role !== "super_admin" ? (
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-text-muted">
              Only Super Admins can manage users.
            </p>
          </section>
        ) : (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          {profiles.map((profile) => {
            const assigned = getAssignments(profile.id);
            return (
              <div key={profile.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="font-semibold">{profile.email ?? profile.id}</p>
                    <p className="text-xs text-text-muted">{profile.full_name ?? "No name"}</p>
                  </div>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={profile.role}
                    onChange={(event) =>
                      updateUser(profile.id, event.target.value as UserRole, assigned)
                    }
                  >
                    <option value="super_admin">super_admin</option>
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="viewer">viewer</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {vestigingen.map((vestiging) => {
                    const checked = assigned.includes(vestiging.id);
                    return (
                      <label key={vestiging.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? assigned.filter((id) => id !== vestiging.id)
                              : [...assigned, vestiging.id];
                            updateUser(profile.id, profile.role, next);
                          }}
                        />
                        {vestiging.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {profiles.length === 0 ? (
            <p className="text-sm text-text-muted">No users found.</p>
          ) : null}
          </section>
        )}
      </AdminShell>
    </AdminGuard>
  );
}


