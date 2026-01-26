"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { canManageVestigingen } from "../../../lib/cms/permissions";
import { useAdmin } from "../AdminProvider";
import type { Vestiging } from "../../../types";

const emptyForm = {
  name: "",
  address: "",
  city: "",
  postal_code: "",
  description: ""
};

export default function AdminVestigingenPage() {
  const [vestigingen, setVestigingen] = useState<Vestiging[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { push } = useToast();
  const { role } = useAdmin();

  const loadVestigingen = async () => {
    const res = await fetch("/api/cms/vestigingen");
    const payload = await res.json();
    setVestigingen(payload.data ?? []);
  };

  useEffect(() => {
    loadVestigingen();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/cms/vestigingen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Failed to create vestiging.");
    } else {
      setForm(emptyForm);
      await loadVestigingen();
      push("Vestiging created.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vestiging? This cannot be undone.")) return;
    await fetch("/api/cms/vestigingen", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    await loadVestigingen();
    push("Vestiging deleted.");
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="max-w-4xl space-y-8">
          <PageHeader
            title="Vestigingen"
            description="Manage locations across your portfolio."
            crumbs={[{ label: "CMS", href: "/admin" }, { label: "Vestigingen" }]}
          />
          {canManageVestigingen(role) ? (
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Create vestiging</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    required
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Address"
                    value={form.address}
                    onChange={(event) =>
                      setForm({ ...form, address: event.target.value })
                    }
                    required
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="City"
                    value={form.city}
                    onChange={(event) =>
                      setForm({ ...form, city: event.target.value })
                    }
                    required
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Postal code"
                    value={form.postal_code}
                    onChange={(event) =>
                      setForm({ ...form, postal_code: event.target.value })
                    }
                    required
                  />
                </div>
                <textarea
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  placeholder="Description"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  required
                  rows={4}
                />
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Saving..." : "Create"}
                </button>
              </form>
            </section>
          ) : null}

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Existing vestigingen</h2>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 w-full mb-4"
              placeholder="Search vestigingen..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="space-y-4">
              {vestigingen
                .filter((vestiging) =>
                  vestiging.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((vestiging) => (
                <div
                  key={vestiging.id}
                  className="border border-gray-100 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{vestiging.name}</p>
                    <p className="text-sm text-text-muted">
                      {vestiging.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Link
                      className="text-primary hover:underline"
                      href={`/admin/vestigingen/${vestiging.id}`}
                    >
                      Edit
                    </Link>
                    {canManageVestigingen(role) ? (
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(vestiging.id)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {vestigingen.length === 0 ? (
                <p className="text-sm text-text-muted">
                  No vestigingen yet.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

