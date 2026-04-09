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
import { useTranslation } from "react-i18next";
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
    rent_type_ids: [] as string[],
    title_en: "",
    description_en: ""
  });
  const [rentTypes, setRentTypes] = useState<RentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdKotId, setCreatedKotId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<KotPhoto[]>([]);
  const { push } = useToast();
  const { t } = useTranslation();

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
        title_en: form.title_en,
        description: form.description,
        description_en: form.description_en,
        price: Number(form.price),
        availability_status: form.availability_status,
        status: form.status,
        rent_type_ids: form.rent_type_ids
      })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Aanmaken van kot mislukt.");
    } else if (payload.data?.id) {
      push("Kot aangemaakt. Voeg hieronder foto's toe.");
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
            title={t('admin.koten.create', 'Kot aanmaken')}
            crumbs={[
              { label: "CMS", href: "/admin" },
              { label: t('admin.view.koten', 'Koten'), href: "/admin/koten" },
              { label: t('common.new', 'Nieuw') }
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
              <option value="">Selecteer vestiging</option>
              {vestigingen.map((vestiging) => (
                <option key={vestiging.id} value={vestiging.id}>
                  {vestiging.name}
                </option>
              ))}
            </select>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary-800">Titel (NL)</label>
                <input
                  className="border border-border-DEFAULT rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main"
                  placeholder="Kamer titel"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-primary-800 italic">Title (EN)</label>
                  <button 
                    type="button"
                    onClick={async () => {
                      const res = await fetch('/api/cms/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: form.title })
                      });
                      const { translated } = await res.json();
                      if (translated) setForm({ ...form, title_en: translated });
                    }}
                    className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                  >
                    Suggest English
                  </button>
                </div>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  value={form.title_en}
                  onChange={(event) =>
                    setForm({ ...form, title_en: event.target.value })
                  }
                  placeholder="Engelse titel"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary-800">Beschrijving (NL)</label>
                <textarea
                  className="border border-border-DEFAULT rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main min-h-[100px]"
                  placeholder="Beschrijf de kamer..."
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-primary-800 italic">Description (EN)</label>
                  <button 
                    type="button"
                    onClick={async () => {
                      const res = await fetch('/api/cms/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: form.description })
                      });
                      const { translated } = await res.json();
                      if (translated) setForm({ ...form, description_en: translated });
                    }}
                    className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                  >
                    Suggest English
                  </button>
                </div>
                <textarea
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  rows={3}
                  value={form.description_en}
                  onChange={(event) =>
                    setForm({ ...form, description_en: event.target.value })
                  }
                  placeholder="Engelse beschrijving"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary-800">Huurprijs</label>
                <input
                  className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main w-full"
                  type="number"
                  placeholder="Huurprijs"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  required
                />
              </div>
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
                <option value="available">beschikbaar</option>
                <option value="reserved">gereserveerd</option>
                <option value="rented">verhuurd</option>
                <option value="hidden">verborgen</option>
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
                <option value="draft">concept</option>
                <option value="scheduled">gepland</option>
                <option value="published">gepubliceerd</option>
                <option value="archived">gearchiveerd</option>
              </select>
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-2.5 rounded-lg font-medium shadow-sm w-full md:w-auto"
              disabled={loading}
              type="submit"
            >
              {loading ? t('admin.common.saving', 'Aanmaken...') : t('admin.koten.create', 'Kot aanmaken')}
            </button>
          </form>

          {createdKotId && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Foto's</h2>
                <button
                  className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
                  onClick={() => router.push(`/admin/koten/${createdKotId}`)}
                >
                  Klaar - naar kot
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


