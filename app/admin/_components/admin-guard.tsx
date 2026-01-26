"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../AdminProvider";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-muted">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

