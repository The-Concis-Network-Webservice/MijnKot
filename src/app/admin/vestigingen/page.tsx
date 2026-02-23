"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { canManageVestigingen } from "@/shared/lib/cms/permissions";
import { useAdmin } from "../AdminProvider";
import type { Vestiging } from "@/types";

const emptyForm = {
  name: "",
  address: "",
  city: "",
  postal_code: "",
  description: "",
  image_url: ""
};

export default function AdminVestigingenPage() {
  const [vestigingen, setVestigingen] = useState<Vestiging[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { push } = useToast();
  const { role } = useAdmin();
  const { t } = useTranslation();

  const loadVestigingen = async () => {
    try {
      const res = await fetch("/api/cms/vestigingen");
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const payload = await res.json();
      setVestigingen(payload.data ?? []);
    } catch (err) {
      console.error("Failed to load vestigingen:", err);
      push("Failed to load vestigingen. Check if you are on the correct port (3000).");
    }
  };

  useEffect(() => {
    loadVestigingen();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/vestigingen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      
      let payload;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        payload = await res.json();
      } else {
        throw new Error("Server did not return JSON. Make sure you are using port 3000.");
      }

      if (!res.ok) {
        setError(payload.error ?? "Failed to create vestiging.");
      } else {
        setForm(emptyForm);
        await loadVestigingen();
        push("Vestiging created.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vestiging? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/cms/vestigingen", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });
      
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: "Server error" }));
        push(payload.error ?? "Failed to delete vestiging.");
      } else {
        await loadVestigingen();
        push("Vestiging deleted.");
      }
    } catch (err) {
      push("Failed to delete vestiging. Check your connection.");
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      // 1. Upload directly using our new binding-based API
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

      // 2. Register in media library for consistency
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

      // 3. Set the URL in our form
      setForm({ ...form, image_url: publicUrl });
      push("Image uploaded successfully.");
    } catch (err: any) {
      const msg = err.message || "Upload failed.";
      if (msg.includes("BINDING")) {
        setError("Upload error: Cloudflare binding mismatch. Please restart 'npm run dev:wrangler' or use port 3000.");
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
    }
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
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Image</label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                      <label 
                        htmlFor="image-upload"
                        className="cursor-pointer bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors inline-block"
                      >
                        {uploading ? "Uploading..." : "Upload Image"}
                      </label>
                      <input
                        className="border border-gray-200 rounded-lg px-3 py-2 flex-1 text-sm"
                        placeholder="Or paste URL..."
                        value={form.image_url}
                        onChange={(event) =>
                          setForm({ ...form, image_url: event.target.value })
                        }
                      />
                    </div>
                    {form.image_url && (
                      <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-gray-100">
                        <img src={form.image_url} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                  </div>
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
                  className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow-soft active:scale-95"
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
                  <div className="flex items-center gap-4">
                    {vestiging.image_url ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img 
                          src={vestiging.image_url} 
                          alt={vestiging.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs text-text-muted flex-shrink-0">
                        No image
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{vestiging.name}</p>
                      <p className="text-sm text-text-muted">
                        {vestiging.city}
                      </p>
                    </div>
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


