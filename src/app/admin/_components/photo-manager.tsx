"use client";

import { useEffect, useState } from "react";
import type { KotPhoto, MediaAsset } from "@/types";
import { useToast } from "./toast";

type Props = {
  kotId: string;
  photos: KotPhoto[];
  onChange: () => Promise<void>;
};

export function PhotoManager({ kotId, photos, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [dragId, setDragId] = useState<string | null>(null);
  const { push } = useToast();

  const ordered = [...photos].sort((a, b) => a.order_index - b.order_index);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const res = await fetch("/api/cms/media");
    const payload = await res.json();
    setLibrary(payload.data ?? []);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      // 1. Upload directly via binding API using raw binary buffer
      const res = await fetch("/api/r2/upload", {
        method: "POST",
        headers: { 
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name),
          "X-Mime-Type": file.type || "application/octet-stream"
        },
        body: file // Send file directly as binary stream
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to upload image.");
      }
      
      const { publicUrl, key, file_name, mime_type, size_bytes } = await res.json();

      // 2. Register in media library
      const mediaRes = await fetch("/api/cms/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          r2_key: key,
          public_url: publicUrl,
          file_name,
          mime_type,
          size_bytes
        })
      });
      
      const mediaPayload = await mediaRes.json();
      if (!mediaRes.ok) {
        throw new Error(mediaPayload.error || "Failed to register media.");
      }

      // 3. Link to Kot
      await fetch("/api/cms/kot-photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          kot_id: kotId,
          image_url: publicUrl,
          order_index: ordered.length,
          media_asset_id: mediaPayload.data.id
        })
      });

      await onChange();
      await loadLibrary();
      push("Photo added.");
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const movePhoto = async (photoId: string, direction: "up" | "down") => {
    const index = ordered.findIndex((photo) => photo.id === photoId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= ordered.length) return;
    const current = ordered[index];
    const target = ordered[swapIndex];
    await fetch("/api/cms/kot-photos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: current.id, order_index: target.order_index })
    });
    await fetch("/api/cms/kot-photos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: target.id, order_index: current.order_index })
    });
    await onChange();
  };

  const deletePhoto = async (photoId: string) => {
    await fetch("/api/cms/kot-photos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: photoId })
    });
    await onChange();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-text-main block mb-2">
          Upload photos
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            files.reduce(
              (promise, file) => promise.then(() => uploadPhoto(file)),
              Promise.resolve()
            );
          }}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-text-main block mb-2">
            Attach from library
          </label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full"
            value={selectedAsset}
            onChange={(event) => setSelectedAsset(event.target.value)}
          >
            <option value="">Select media</option>
            {library.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.file_name}
              </option>
            ))}
          </select>
          <button
            className="mt-3 text-sm text-primary"
            onClick={async () => {
              if (!selectedAsset) return;
              const asset = library.find((item) => item.id === selectedAsset);
              if (!asset) return;
              await fetch("/api/cms/kot-photos", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  kot_id: kotId,
                  image_url: asset.public_url,
                  order_index: ordered.length,
                  media_asset_id: asset.id
                })
              });
              await onChange();
              push("Photo attached.");
            }}
          >
            Attach selected media
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {uploading ? (
        <p className="text-sm text-text-muted">Uploading...</p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {ordered.map((photo, index) => (
          <div
            key={photo.id}
            className="border border-gray-100 rounded-xl p-3 space-y-3"
            draggable
            onDragStart={() => setDragId(photo.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={async () => {
              if (!dragId || dragId === photo.id) return;
              const sourceIndex = ordered.findIndex((p) => p.id === dragId);
              const targetIndex = ordered.findIndex((p) => p.id === photo.id);
              if (sourceIndex === -1 || targetIndex === -1) return;
              await fetch("/api/cms/kot-photos", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  id: ordered[sourceIndex].id,
                  order_index: ordered[targetIndex].order_index
                })
              });
              await fetch("/api/cms/kot-photos", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  id: ordered[targetIndex].id,
                  order_index: ordered[sourceIndex].order_index
                })
              });
              setDragId(null);
              await onChange();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.image_url}
              alt={`Kot photo ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-2">
                <button
                  className="text-primary"
                  onClick={() => movePhoto(photo.id, "up")}
                >
                  Up
                </button>
                <button
                  className="text-primary"
                  onClick={() => movePhoto(photo.id, "down")}
                >
                  Down
                </button>
              </div>
              <button
                className="text-red-500"
                onClick={() => deletePhoto(photo.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {ordered.length === 0 ? (
        <p className="text-sm text-text-muted">
          No photos yet. Upload the first one.
        </p>
      ) : null}
    </div>
  );
}


