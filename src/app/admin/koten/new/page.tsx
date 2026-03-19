"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminGuard } from "../../_components/admin-guard";
import { AdminShell } from "../../_components/admin-shell";
import { PageHeader } from "../../_components/page-header";
import { PhotoManager } from "../../_components/photo-manager";
import { useToast } from "../../_components/toast";
import { useAdmin } from "../../AdminProvider";
import { RichTextEditor } from "../../_components/rich-text-editor";
import type { Vestiging, RentType, KotPhoto } from "@/types";

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
  const [createdKotId, setCreatedKotId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<KotPhoto[]>([]);
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
      push("Kot created. Add photos below.");
      setCreatedKotId(payload.data.id);
    }
    setLoading(false);
  };

  const loadPhotos = async (kotId: string) => {
    const res = await fetch(`/api/cms/kot-photos?kot_id=${kotId}`);
    const payload = await res.json();
    setPhotos(payload.data ?? []);
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
            <textarea
              className="border border-border-DEFAULT rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main min-h-[150px]"
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
              className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-2.5 rounded-lg font-medium shadow-sm w-full md:w-auto"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating..." : "Create kot"}
            </button>
          </form>

          {createdKotId && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Photos</h2>
                <button
                  className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
                  onClick={() => router.push(`/admin/koten/${createdKotId}`)}
                >
                  Done — go to kot
                </button>
              </div>
              <PhotoManager
                kotId={createdKotId}
                photos={photos}
                onChange={() => loadPhotos(createdKotId)}
              />
            </div>
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}


