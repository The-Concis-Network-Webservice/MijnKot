"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Wachtwoord succesvol gewijzigd! Je wordt nu doorgestuurd naar de login pagina.");
        setTimeout(() => {
          router.push("/admin");
        }, 3000);
      } else {
        setError(data.error || "Er is iets misgegaan.");
      }
    } catch (err) {
      setError("Netwerkfout.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-500 font-medium">Ongeldige herstel-link.</p>
        <button 
          onClick={() => router.push("/admin")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Terug naar inloggen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-text-main mb-2 text-center">
        Nieuw Wachtwoord
      </h1>
      <p className="text-sm text-text-muted mb-6 text-center">
        Stel je nieuwe wachtwoord in voor je admin account.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-text-main block mb-1">
            Nieuw Wachtwoord
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-text-main block mb-1">
            Bevestig Wachtwoord
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      {success && <p className="text-sm text-green-600 text-center font-medium bg-green-50 p-2 rounded-lg border border-green-100">{success}</p>}

      <button
        className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
        disabled={loading || !!success}
        type="submit"
      >
        {loading ? "Bezig met verwerken..." : "Wachtwoord Opslaan"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg w-full max-w-md">
        <Suspense fallback={<div className="text-center py-4">Laden...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
