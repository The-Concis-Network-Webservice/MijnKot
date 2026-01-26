"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminGuard } from "../../_components/admin-guard";
import { AdminShell } from "../../_components/admin-shell";
import { PageHeader } from "../../_components/page-header";
import { useToast } from "../../_components/toast";
import { useAdmin } from "../../AdminProvider";
import type { Vestiging } from "../../../../types";

export default function AdminKotCreatePage() {
  const router = useRouter();
  const { activeVestigingId } = useAdmin();
  const [vestigingen, setVestigingen] = useState<Vestiging[]>([]);
  const [form, setForm] = useState({
    vestiging_id: "",
    title: "",
    description: "",
    price: "",
    availability_status: "available",
    status: "draft",
    scheduled_publish_at: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    fetch("/api/cms/vestigingen")
      .then((res) => res.json())
      .then((payload) => setVestigingen(payload.data ?? []));
  }, []);

  useEffect(() => {
    if (activeVestigingId && !form.vestiging_id) {
      setForm((prev) => ({ ...prev, vestiging_id: activeVestigingId }));
    }
  }, [activeVestigingId, form.vestiging_id]);

  const createKot = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/cms/koten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vestiging_id: form.vestiging_id,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        availability_status: form.availability_status,
        status: form.status,
        scheduled_publish_at: form.scheduled_publish_at || null
      })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Failed to create kot.");
    } else if (payload.data?.id) {
      push("Kot created.");
      router.push(`/admin/koten/${payload.data.id}`);
    }
    setLoading(false);
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="max-w-3xl space-y-6">
          <PageHeader
            title="Create kot"
            crumbs={[
              { label: "CMS", href: "/admin" },
              { label: "Koten", href: "/admin/koten" },
              { label: "New" }
            ]}
          />
          <form
            className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4"
            onSubmit={createKot}
          >
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 w-full"
              value={form.vestiging_id}
              onChange={(event) =>
                setForm({ ...form, vestiging_id: event.target.value })
              }
              required
            >
              <option value="">Select vestiging</option>
              {vestigingen.map((vestiging) => (
                <option key={vestiging.id} value={vestiging.id}>
                  {vestiging.name}
                </option>
              ))}
            </select>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 w-full"
              placeholder="Title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              required
            />
            <textarea
              className="border border-gray-200 rounded-lg px-3 py-2 w-full"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border border-gray-200 rounded-lg px-3 py-2"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
              />
              <select
                className="border border-gray-200 rounded-lg px-3 py-2"
                value={form.availability_status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    availability_status: event.target.value
                  })
                }
              >
                <option value="available">available</option>
                <option value="reserved">reserved</option>
                <option value="rented">rented</option>
                <option value="hidden">hidden</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2"
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
              >
                <option value="draft">draft</option>
                <option value="scheduled">scheduled</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2"
                type="datetime-local"
                value={form.scheduled_publish_at}
                onChange={(event) =>
                  setForm({
                    ...form,
                    scheduled_publish_at: event.target.value
                  })
                }
              />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating..." : "Create kot"}
            </button>
          </form>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

