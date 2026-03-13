"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminGuard } from "../../_components/admin-guard";
import { AdminShell } from "../../_components/admin-shell";
import { PageHeader } from "../../_components/page-header";
import { useToast } from "../../_components/toast";
import { canEditContent } from "@/shared/lib/cms/permissions";
import { useAdmin } from "../../AdminProvider";
import type { Kot, Vestiging } from "@/types";
import { RichTextEditor } from "../../_components/rich-text-editor";

export default function AdminVestigingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vestiging, setVestiging] = useState<Vestiging | null>(null);
  const [koten, setKoten] = useState<Kot[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();
  const { role } = useAdmin();
  const [kotForm, setKotForm] = useState({
    title: "",
    description: "",
    price: "",
    availability_status: "available",
    status: "draft",
    scheduled_publish_at: ""
  });

  const loadData = async () => {
    const vestigingRes = await fetch(`/api/cms/vestigingen?id=${id}`);
    const vestigingPayload = await vestigingRes.json();
    const kotenRes = await fetch(`/api/cms/koten?vestiging_id=${id}`);
    const kotenPayload = await kotenRes.json();
    setVestiging(vestigingPayload.data ?? null);
    setKoten(kotenPayload.data ?? []);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const updateVestiging = async () => {
    if (!vestiging) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/cms/vestigingen", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        name: vestiging.name,
        address: vestiging.address,
        city: vestiging.city,
        postal_code: vestiging.postal_code,
        description: vestiging.description,
        image_url: vestiging.image_url
      })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Failed to save vestiging.");
    } else {
      await loadData();
      push("Vestiging updated.");
    }
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const res = await fetch("/api/r2/upload", {
        method: "POST",
        headers: { 
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name),
          "X-Mime-Type": file.type || "application/octet-stream"
        },
        body: file
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to upload image.");
      }
      
      const { publicUrl, key, file_name, mime_type, size_bytes } = await res.json();

      await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          r2_key: key,
          public_url: publicUrl,
          file_name,
          mime_type,
          size_bytes
        })
      });

      if (vestiging) {
        setVestiging({ ...vestiging, image_url: publicUrl });
      }
      push("Image uploaded successfully.");
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

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
        vestiging_id: id,
        title: kotForm.title,
        description: kotForm.description,
        price: Number(kotForm.price),
        availability_status: kotForm.availability_status,
        status: kotForm.status,
        scheduled_publish_at: kotForm.scheduled_publish_at || null
      })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Failed to create kot.");
    } else {
      setKotForm({
        title: "",
        description: "",
        price: "",
        availability_status: "available",
        status: "draft",
        scheduled_publish_at: ""
      });
      await loadData();
      push("Kot created.");
    }
    setLoading(false);
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="space-y-8 max-w-4xl">
          <PageHeader
            title="Vestiging detail"
            description="Update vestiging details and create koten."
            crumbs={[
              { label: "CMS", href: "/admin" },
              { label: "Vestigingen", href: "/admin/vestigingen" },
              { label: vestiging?.name ?? "Detail" }
            ]}
          />
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Edit vestiging</h2>
            {vestiging ? (
              <div className="space-y-4">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={vestiging.name}
                  onChange={(event) =>
                    setVestiging({ ...vestiging, name: event.target.value })
                  }
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    value={vestiging.address}
                    onChange={(event) =>
                      setVestiging({
                        ...vestiging,
                        address: event.target.value
                      })
                    }
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    value={vestiging.city}
                    onChange={(event) =>
                      setVestiging({ ...vestiging, city: event.target.value })
                    }
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    value={vestiging.postal_code}
                    onChange={(event) =>
                      setVestiging({
                        ...vestiging,
                        postal_code: event.target.value
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description (Markdown)</label>
                  <RichTextEditor
                    value={vestiging.description}
                    onChange={(val) =>
                      setVestiging({
                        ...vestiging,
                        description: val
                      })
                    }
                    placeholder="Describe this location..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Image</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="vestiging-image-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                    <label 
                      htmlFor="vestiging-image-upload"
                      className="cursor-pointer bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors inline-block"
                    >
                      {uploading ? "Uploading..." : "Upload Image"}
                    </label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 flex-1 text-sm"
                      value={vestiging.image_url ?? ""}
                      onChange={(event) =>
                        setVestiging({
                          ...vestiging,
                          image_url: event.target.value
                        })
                      }
                      placeholder="Or paste URL..."
                    />
                  </div>
                  {vestiging.image_url && (
                    <div className="mt-2 w-full max-w-2xl aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={vestiging.image_url} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={updateVestiging}
                  disabled={loading}
                >
                  Save changes
                </button>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Loading vestiging...</p>
            )}
          </section>

          {canEditContent(role) ? (
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Create kot</h2>
              <form className="space-y-4" onSubmit={createKot}>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  placeholder="Title"
                  value={kotForm.title}
                  onChange={(event) =>
                    setKotForm({ ...kotForm, title: event.target.value })
                  }
                  required
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description (Markdown)</label>
                  <RichTextEditor
                    value={kotForm.description}
                    onChange={(val) =>
                      setKotForm({ ...kotForm, description: val })
                    }
                    placeholder="Describe this room..."
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Price"
                    type="number"
                    value={kotForm.price}
                    onChange={(event) =>
                      setKotForm({ ...kotForm, price: event.target.value })
                    }
                    required
                  />
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    value={kotForm.availability_status}
                    onChange={(event) =>
                      setKotForm({
                        ...kotForm,
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
                    value={kotForm.status}
                    onChange={(event) =>
                      setKotForm({ ...kotForm, status: event.target.value })
                    }
                  >
                    <option value="draft">draft</option>
                    <option value="scheduled">scheduled</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    type="date"
                    value={kotForm.scheduled_publish_at ? kotForm.scheduled_publish_at.split('T')[0] : ''}
                    onChange={(event) =>
                      setKotForm({
                        ...kotForm,
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
                  Create kot
                </button>
              </form>
            </section>
          ) : null}

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Koten</h2>
            <div className="space-y-3">
              {koten.map((kot) => (
                <div
                  key={kot.id}
                  className="border border-gray-100 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{kot.title}</p>
                    <p className="text-sm text-text-muted">
                      {kot.availability_status} · {kot.status}
                    </p>
                  </div>
                  <Link
                    className="text-primary hover:underline text-sm"
                    href={`/admin/koten/${kot.id}`}
                  >
                    Manage
                  </Link>
                </div>
              ))}
              {koten.length === 0 ? (
                <p className="text-sm text-text-muted">No koten yet.</p>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

