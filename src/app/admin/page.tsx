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
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/admin/vestigingen");
    }
  }, [router, user]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Inloggen mislukt.");
    } else {
      window.location.href = "/admin/vestigingen";
    }
    setLoading(false);
  };

  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Als dit account bestaat, is er een herstel-email verzonden.");
        setForgotEmail("");
        // Optional: switch back to login after some delay
      } else {
        setError(data.error || "Er is iets misgegaan.");
      }
    } catch (err) {
      setError("Netwerkfout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg w-full max-w-md">
        {showForgot ? (
          <form onSubmit={onForgotSubmit} className="space-y-4">
            <h1 className="font-display text-2xl font-bold text-text-main mb-2">
              Forgot Password
            </h1>
            <p className="text-sm text-text-muted mb-6">
              Enter your email address to receive a recovery link.
            </p>
            <div>
              <label className="text-sm font-semibold text-text-main block mb-1">
                Email
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded-lg border border-green-100">{success}</p>}

            <button
              className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending..." : "Send Link"}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setShowForgot(false); setError(null); setSuccess(null); }}
                className="text-xs text-text-muted hover:text-primary transition-colors font-medium"
              >
                Back to sign in
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="font-display text-2xl font-bold text-text-main mb-2">
              Admin Login
            </h1>
            <p className="text-sm text-text-muted mb-6">
              Sign in with your MijnKot admin account.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-text-main block mb-1">
                  Email
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <button
                className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]"
                disabled={loading}
                type="submit"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForgot(true); setError(null); setSuccess(null); }}
                  className="text-xs text-text-muted hover:text-primary transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

