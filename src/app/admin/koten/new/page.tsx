"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminGuard } from "../../_components/admin-guard";
import { AdminShell } from "../../_components/admin-shell";
import { PageHeader } from "../../_components/page-header";
import { useToast } from "../../_components/toast";
import { useAdmin } from "../../AdminProvider";
import { RichTextEditor } from "../../_components/rich-text-editor";
import type { Vestiging, RentType } from "@/types";

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
    scheduled_publish_at: "",
    rent_type_ids: [] as string[]
  });
  const [rentTypes, setRentTypes] = useState<RentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    fetch("/api/cms/vestigingen")
      .then((res) => res.json())
      .then((payload) => setVestigingen(payload.data ?? []));

    fetch("/api/cms/rent-types")
      .then((res) => res.json())
      .then((payload) => setRentTypes(payload.data ?? []));
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
        scheduled_publish_at: form.scheduled_publish_at || null,
        rent_type_ids: form.rent_type_ids
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
              className="border border-border-DEFAULT rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main bg-white"
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
              className="border border-border-DEFAULT rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main"
              placeholder="Title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              required
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted ml-1">Description</label>
              <RichTextEditor
                placeholder="Description"
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                minHeight="250px"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold block italic text-text-muted">Categorieën (Te Huur filters)</label>
              <div className="flex flex-wrap gap-4">
                {rentTypes.map((rt) => (
                  <label key={rt.id} className="flex items-center gap-2 cursor-pointer bg-surface-subtle px-3 py-1.5 rounded-lg border border-border-light hover:border-primary-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.rent_type_ids.includes(rt.id)}
                      onChange={(e) => {
                        const ids = form.rent_type_ids;
                        if (e.target.checked) {
                          setForm({ ...form, rent_type_ids: [...ids, rt.id] });
                        } else {
                          setForm({ ...form, rent_type_ids: ids.filter(id => id !== rt.id) });
                        }
                      }}
                      className="rounded text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium">{rt.name}</span>
                  </label>
                ))}
                {rentTypes.length === 0 && <p className="text-sm text-text-muted italic">No categories defined. Add them in settings.</p>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main w-full"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
              />
              <select
                className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main bg-white w-full"
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
                className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main bg-white w-full"
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
                className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main w-full"
                type="date"
                value={form.scheduled_publish_at ? form.scheduled_publish_at.split('T')[0] : ''}
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
              className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-2.5 rounded-lg font-medium shadow-sm w-full md:w-auto"
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


