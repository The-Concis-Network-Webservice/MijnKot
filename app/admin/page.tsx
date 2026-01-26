"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "./AdminProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/admin/vestigingen");
    }
  }, [router, user]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Failed to sign in.");
    } else {
      window.location.href = "/admin/vestigingen";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg w-full max-w-md"
      >
        <h1 className="font-display text-2xl font-bold text-text-main mb-4">
          Admin Login
        </h1>
        <p className="text-sm text-text-muted mb-6">
          Sign in with your Supabase admin account.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-text-main block mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-text-main block mb-1">
              Password
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

