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
import { RichTextEditor } from "../_components/rich-text-editor";
import { ImageUploadZone } from "../_components/image-upload-zone";
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
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { push } = useToast();
  const { role } = useAdmin();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

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
      push("Laden van vestigingen mislukt. Controleer de verbinding.");
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
        setError(payload.error ?? "Aanmaken van vestiging mislukt.");
      } else {
        setForm(emptyForm);
        await loadVestigingen();
        push("Vestiging aangemaakt.");
      }
    } catch (err: any) {
      setError(err.message || "Er is een onverwachte fout opgetreden.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deze vestiging verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
    try {
      const res = await fetch("/api/cms/vestigingen", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });
      
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: "Server fout" }));
        push(payload.error ?? "Verwijderen van vestiging mislukt.");
      } else {
        await loadVestigingen();
        push("Vestiging verwijderd.");
      }
    } catch (err) {
      push("Verwijderen van vestiging mislukt. Controleer de verbinding.");
    }
  };

  const handleFileUpload = async (file: File) => {
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
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload mislukt.");
      }
      const { publicUrl, key, file_name, mime_type, size_bytes } = await res.json();
      await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ r2_key: key, public_url: publicUrl, file_name, mime_type, size_bytes }),
      });
      setForm((prev) => ({ ...prev, image_url: publicUrl }));
      push("Afbeelding geüpload.");
    } catch (err: any) {
      setError(err.message || "Upload mislukt.");
    }
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="max-w-4xl space-y-8">
          <PageHeader
            title={t('admin.vestigingen.title', 'Vestigingen')}
            description={t('admin.vestigingen.description', 'Beheer de locaties in je portfolio.')}
            crumbs={[{ label: "CMS", href: "/admin" }, { label: t('admin.vestigingen.title', 'Vestigingen') }]}
          />
          {canManageVestigingen(role) ? (
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">{t('admin.vestigingen.create', 'Vestiging aanmaken')}</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder={t('admin.vestigingen.name', 'Naam')}
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    required
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder={t('admin.vestigingen.address', 'Adres')}
                    value={form.address}
                    onChange={(event) =>
                      setForm({ ...form, address: event.target.value })
                    }
                    required
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder={t('admin.vestigingen.city', 'Stad')}
                    value={form.city}
                    onChange={(event) =>
                      setForm({ ...form, city: event.target.value })
                    }
                    required
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder={t('admin.vestigingen.postal_code', 'Postcode')}
                    value={form.postal_code}
                    onChange={(event) =>
                      setForm({ ...form, postal_code: event.target.value })
                    }
                    required
                  />
                  <div className="md:col-span-2">
                    <ImageUploadZone
                      label={t('admin.vestigingen.cover_photo', 'Omslagfoto')}
                      previewUrl={form.image_url}
                      onUpload={handleFileUpload}
                    />
                  </div>
                </div>
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <button
                  className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow-soft active:scale-95"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? t('admin.common.saving', 'Opslaan...') : t('admin.common.create', 'Aanmaken')}
                </button>
              </form>
            </section>
          ) : null}

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">{t('admin.vestigingen.existing', 'Bestaande vestigingen')}</h2>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 w-full mb-4"
              placeholder={t('admin.common.search', 'Zoek vestigingen...')}
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
                        Geen afbeelding
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-primary-900">{vestiging.name}</p>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <span>{vestiging.city}</span>
                        {locale === 'en' && !vestiging.description_en && (
                          <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 italic">
                            Geen EN beschrijving
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Link
                      className="text-primary hover:underline"
                      href={`/admin/vestigingen/${vestiging.id}`}
                    >
                      Bewerken
                    </Link>
                    {canManageVestigingen(role) ? (
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(vestiging.id)}
                      >
                        Verwijderen
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {vestigingen.length === 0 ? (
                <p className="text-sm text-text-muted">
                  Nog geen vestigingen.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}


