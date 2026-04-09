"use client";

import { useEffect, useRef, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { useTranslation } from "react-i18next";
import type { MediaAsset } from "@/types";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();
  const { t } = useTranslation();

  const loadAssets = async () => {
    setLoading(true);
    const res = await fetch("/api/cms/media");
    const payload = await res.json();
    setAssets(payload.data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadAssets(); }, []);

  const uploadAsset = async (file: File) => {
    setUploading(true);
    setUploadProgress(10);
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
      setUploadProgress(55);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || t('admin.common.upload_error', "Upload mislukt."));
      }
      const { publicUrl, key, file_name, mime_type, size_bytes } = await res.json();
      setUploadProgress(80);
      const mediaRes = await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ r2_key: key, public_url: publicUrl, file_name, mime_type, size_bytes }),
      });
      const payload = await mediaRes.json();
      if (!mediaRes.ok) throw new Error(payload.error || t('admin.common.registration_error', "Registratie mislukt."));
      setUploadProgress(100);
      push(t('admin.common.upload_success', "Media geüpload."));
      await loadAssets();
    } catch (err: any) {
      push(err.message || "Upload mislukt.", "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).reduce(
      (p, f) => p.then(() => uploadAsset(f)),
      Promise.resolve()
    );
  };

  const deleteAsset = async (id: string) => {
    const res = await fetch("/api/cms/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const payload = await res.json();
    if (!res.ok) { push(payload.error ?? t('admin.common.delete_error', "Kan media niet verwijderen."), "error"); return; }
    setDeleteConfirmId(null);
    await loadAssets();
    push(t('admin.common.delete_success', "Media verwijderd."));
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminGuard>
      <AdminShell>
        <PageHeader
          title={t('admin.media.title', "Mediabibliotheek")}
          description={t('admin.media.description', "Alle geüploade afbeeldingen, herbruikbaar voor koten.")}
          crumbs={[{ label: "CMS", href: "/admin" }, { label: t('admin.view.media', "Media") }]}
        />
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">

          {/* Upload zone */}
          <div
            className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
              dragOver
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
            }`}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          >
            {uploading ? (
              <div className="p-8 flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                <p className="text-sm text-text-muted">{t('admin.media.uploading', "Bezig met uploaden...")}</p>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 pointer-events-none">
                <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm font-medium text-text-main">{t('admin.media.drag_drop_title', "Sleep afbeeldingen hierheen of klik om te uploaden")}</p>
                <p className="text-xs text-text-muted">{t('admin.media.drag_drop_subtitle', "PNG, JPG, WebP - meerdere tegelijk mogelijk")}</p>
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

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl bg-gray-100 animate-pulse h-52" />
              ))}
            </div>
          ) : assets.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">{t('admin.media.no_media', "Nog geen media geüpload.")}</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="border border-gray-100 rounded-xl overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.public_url}
                    alt={asset.file_name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-text-muted truncate" title={asset.file_name}>
                      {asset.file_name}
                    </p>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => copyUrl(asset.public_url, asset.id)}
                        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                      >
                        {copiedId === asset.id ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {t('admin.media.copied', "Gekopieerd")}
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {t('admin.media.copy_url', "Kopieer URL")}
                          </>
                        )}
                      </button>

                      {deleteConfirmId === asset.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{t('admin.media.delete_ask', "Verwijderen?")}</span>
                          <button type="button" onClick={() => deleteAsset(asset.id)} className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer">{t('admin.media.yes', "Ja")}</button>
                          <button type="button" onClick={() => setDeleteConfirmId(null)} className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">{t('admin.media.no', "Nee")}</button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(asset.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title={t('admin.common.delete', "Verwijderen")}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </AdminShell>
    </AdminGuard>
  );
}
