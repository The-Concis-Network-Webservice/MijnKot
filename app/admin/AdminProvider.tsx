"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { UserRole, Vestiging } from "../../types";

type AdminContextValue = {
  user: { id: string; email: string } | null;
  role: UserRole | null;
  assignedVestigingen: Vestiging[];
  activeVestigingId: string | null;
  setActiveVestigingId: (id: string | null) => void;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [assignedVestigingen, setAssignedVestigingen] = useState<Vestiging[]>([]);
  const [activeVestigingId, setActiveVestigingId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const res = await fetch("/api/auth/me");
    const payload = await res.json();
    if (payload.user) {
      setUser(payload.user);
      setRole(payload.role ?? null);
      setAssignedVestigingen(payload.vestigingen ?? []);
      const saved = localStorage.getItem("activeVestigingId");
      if (
        saved &&
        (payload.vestigingen ?? []).some((v: Vestiging) => v.id === saved)
      ) {
        setActiveVestigingId(saved);
      } else if ((payload.vestigingen ?? []).length > 0) {
        setActiveVestigingId(payload.vestigingen[0].id);
      } else {
        setActiveVestigingId(null);
      }
    } else {
      setUser(null);
      setRole(null);
      setAssignedVestigingen([]);
      setActiveVestigingId(null);
    }
  };

  useEffect(() => {
    loadSession().finally(() => setLoading(false));
  }, []);

  const value: AdminContextValue = {
    user,
    role,
    assignedVestigingen,
    activeVestigingId,
    setActiveVestigingId: (id) => {
      setActiveVestigingId(id);
      if (id) {
        localStorage.setItem("activeVestigingId", id);
      } else {
        localStorage.removeItem("activeVestigingId");
      }
    },
    loading,
    signOut: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setRole(null);
      setAssignedVestigingen([]);
      setActiveVestigingId(null);
    }
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return ctx;
}

