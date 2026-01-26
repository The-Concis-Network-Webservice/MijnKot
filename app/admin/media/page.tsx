"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import type { MediaAsset } from "../../../types";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  const loadAssets = async () => {
    setLoading(true);
    const res = await fetch("/api/cms/media");
    const payload = await res.json();
    setAssets(payload.data ?? []);
    setLoading(false);
  };

  const uploadAsset = async (file: File) => {
    const res = await fetch("/api/r2/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type
      })
    });
    if (!res.ok) {
      push("Failed to get upload URL.", "error");
      return;
    }
    const { uploadUrl, publicUrl, key } = await res.json();
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file
    });
    if (!uploadRes.ok) {
      push("Upload failed.", "error");
      return;
    }
    const mediaRes = await fetch("/api/cms/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        r2_key: key,
        public_url: publicUrl,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size
      })
    });
    const payload = await mediaRes.json();
    if (!mediaRes.ok) {
      push(payload.error ?? "Failed to register media.", "error");
      return;
    }
    push("Media uploaded.");
    await loadAssets();
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const deleteAsset = async (id: string) => {
    if (!confirm("Delete this media asset? It cannot be undone.")) return;
    const res = await fetch("/api/cms/media", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    const payload = await res.json();
    if (!res.ok) {
      push(payload.error ?? "Cannot delete media.", "error");
      return;
    }
    await loadAssets();
    push("Media deleted.");
  };

  return (
    <AdminGuard>
      <AdminShell>
        <PageHeader
          title="Media library"
          description="All uploaded assets, reusable across koten."
          crumbs={[{ label: "CMS", href: "/admin" }, { label: "Media" }]}
        />
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                files.forEach((file) => uploadAsset(file));
              }}
            />
          </div>
          {loading ? (
            <p className="text-sm text-text-muted">Loading...</p>
          ) : null}
          <div className="grid md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="border border-gray-100 rounded-xl p-3 space-y-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.public_url}
                  alt={asset.file_name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="text-xs text-text-muted">
                  {asset.file_name}
                </div>
                <button
                  className="text-xs text-red-500"
                  onClick={() => deleteAsset(asset.id)}
                >
                  Delete
                </button>
              </div>
            ))}
            {assets.length === 0 ? (
              <p className="text-sm text-text-muted">
                No media uploaded yet.
              </p>
            ) : null}
          </div>
        </section>
      </AdminShell>
    </AdminGuard>
  );
}

