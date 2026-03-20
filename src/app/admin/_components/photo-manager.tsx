"use client";

import { useEffect, useRef, useState } from "react";
import type { KotPhoto, MediaAsset } from "@/types";
import { useToast } from "./toast";

type Props = {
  kotId: string;
  photos: KotPhoto[];
  onChange: () => Promise<void>;
};

export function PhotoManager({ kotId, photos, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState<MediaAsset[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    setUploadProgress(10);
    setError(null);
    try {
      const res = await fetch("/api/r2/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name),
          "X-Mime-Type": file.type || "application/octet-stream",
        },
        body: file,
      });
      setUploadProgress(50);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload mislukt.");
      }
      const { publicUrl, key, file_name, mime_type, size_bytes } = await res.json();
      setUploadProgress(70);

      const mediaRes = await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ r2_key: key, public_url: publicUrl, file_name, mime_type, size_bytes }),
      });
      const mediaPayload = await mediaRes.json();
      if (!mediaRes.ok) throw new Error(mediaPayload.error || "Media registratie mislukt.");
      setUploadProgress(90);

      await fetch("/api/cms/kot-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kot_id: kotId,
          image_url: publicUrl,
          order_index: ordered.length,
          media_asset_id: mediaPayload.data.id,
        }),
      });
      setUploadProgress(100);
      await onChange();
      await loadLibrary();
      push("Foto toegevoegd.");
    } catch (err: any) {
      setError(err.message || "Upload mislukt.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).reduce(
      (promise, file) => promise.then(() => uploadPhoto(file)),
      Promise.resolve()
    );
  };

  const movePhoto = async (photoId: string, direction: "up" | "down") => {
    const index = ordered.findIndex((p) => p.id === photoId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= ordered.length) return;
    const current = ordered[index];
    const target = ordered[swapIndex];
    await Promise.all([
      fetch("/api/cms/kot-photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id, order_index: target.order_index }),
      }),
      fetch("/api/cms/kot-photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id, order_index: current.order_index }),
      }),
    ]);
    await onChange();
  };

  const deletePhoto = async (photoId: string) => {
    await fetch("/api/cms/kot-photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: photoId }),
    });
    setDeleteConfirmId(null);
    await onChange();
    push("Foto verwijderd.");
  };

  const attachFromLibrary = async (asset: MediaAsset) => {
    await fetch("/api/cms/kot-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kot_id: kotId,
        image_url: asset.public_url,
        order_index: ordered.length,
        media_asset_id: asset.id,
      }),
    });
    await onChange();
    setShowLibrary(false);
    push("Foto gekoppeld.");
  };

  return (
    <div className="space-y-5">

      {/* Upload zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <div className="space-y-3">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
            <p className="text-sm text-text-muted">Bezig met uploaden...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-xs mx-auto">
              <div
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2 pointer-events-none">
            <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium text-text-main">Sleep foto's hierheen of klik om te uploaden</p>
            <p className="text-xs text-text-muted">PNG, JPG, WebP — meerdere tegelijk mogelijk</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
          {error}
        </p>
      )}

      {/* Library toggle */}
      <button
        type="button"
        onClick={() => setShowLibrary(!showLibrary)}
        className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        {showLibrary ? "Verberg mediabibliotheek" : "Koppel uit mediabibliotheek"}
        <svg className={`w-3.5 h-3.5 transition-transform ${showLibrary ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Library grid */}
      {showLibrary && (
        <div className="border border-gray-200 rounded-xl p-4">
          {library.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">Geen media in bibliotheek.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
              {library.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => attachFromLibrary(asset)}
                  className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-400 transition-all cursor-pointer"
                  title={asset.file_name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.public_url}
                    alt={asset.file_name}
                    className="w-full h-16 object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photo grid */}
      {ordered.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {ordered.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative border rounded-xl overflow-hidden transition-all ${
                dragOverId === photo.id && dragId !== photo.id
                  ? "border-primary-400 ring-2 ring-primary-200 scale-[0.98]"
                  : "border-gray-200"
              }`}
              draggable
              onDragStart={() => setDragId(photo.id)}
              onDragEnd={() => { setDragId(null); setDragOverId(null); }}
              onDragOver={(e) => { e.preventDefault(); setDragOverId(photo.id); }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={async () => {
                if (!dragId || dragId === photo.id) return;
                const sourceIndex = ordered.findIndex((p) => p.id === dragId);
                const targetIndex = ordered.findIndex((p) => p.id === photo.id);
                if (sourceIndex === -1 || targetIndex === -1) return;
                await Promise.all([
                  fetch("/api/cms/kot-photos", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: ordered[sourceIndex].id, order_index: ordered[targetIndex].order_index }),
                  }),
                  fetch("/api/cms/kot-photos", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: ordered[targetIndex].id, order_index: ordered[sourceIndex].order_index }),
                  }),
                ]);
                setDragId(null);
                setDragOverId(null);
                await onChange();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.image_url}
                alt={`Foto ${index + 1}`}
                className="w-full h-44 object-cover"
              />

              {/* Cover badge */}
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                  Cover
                </span>
              )}

              {/* Drag handle */}
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 cursor-grab active:cursor-grabbing shadow">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => movePhoto(photo.id, "up")}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Omhoog"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    disabled={index === ordered.length - 1}
                    onClick={() => movePhoto(photo.id, "down")}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Omlaag"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {deleteConfirmId === photo.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Verwijderen?</span>
                    <button
                      type="button"
                      onClick={() => deletePhoto(photo.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Ja
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      Nee
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(photo.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Verwijderen"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ordered.length === 0 && !uploading && (
        <p className="text-sm text-text-muted text-center py-2">Nog geen foto's. Upload de eerste.</p>
      )}
    </div>
  );
}
