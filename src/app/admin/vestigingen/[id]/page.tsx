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
import { FloorPlanManager } from "../../_components/floor-plan-manager";
import { ImageUploadZone } from "../../_components/image-upload-zone";
import { useTranslation } from "react-i18next";

function ShareFloorPlanLink({ vestigingId }: { vestigingId: string }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const loadToken = () => {
    fetch(`/api/cms/floor-plan-token?vestiging_id=${vestigingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.token) { setShareUrl(null); return; }
        const base = window.location.origin;
        setShareUrl(`${base}/vestigingen/${vestigingId}/grondplan?token=${data.token}`);
      })
      .catch(() => {});
  };

  useEffect(() => { loadToken(); }, [vestigingId]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRegenerate = async () => {
    if (!confirm(t('admin.vestigingen.regenerate_confirm', 'De oude link wordt onmiddellijk ongeldig. Doorgaan?'))) return;
    setLoading(true);
    await fetch(`/api/cms/floor-plan-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vestiging_id: vestigingId }),
    });
    loadToken();
    setLoading(false);
  };

  const handleDeactivate = async () => {
    if (!confirm(t('admin.vestigingen.deactivate_confirm', 'De publieke link wordt gedeactiveerd. Doorgaan?'))) return;
    setLoading(true);
    await fetch(`/api/cms/floor-plan-token?vestiging_id=${vestigingId}`, { method: 'DELETE' });
    setShareUrl(null);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {shareUrl ? (
        <>
          <Link
            href={shareUrl}
            target="_blank"
            className="text-sm text-primary hover:underline"
          >
            {t('admin.vestigingen.public_page', 'Publieke pagina')}
          </Link>
          <button
            onClick={handleCopy}
            disabled={loading}
            className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {copied ? t('admin.vestigingen.copied', "Gekopieerd!") : t('admin.vestigingen.copy_link', "Kopieer link")}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {t('admin.vestigingen.regenerate_link', "Nieuwe link")}
          </button>
          <button
            onClick={handleDeactivate}
            disabled={loading}
            className="text-xs bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {t('admin.vestigingen.deactivate_link', "Deactiveer")}
          </button>
        </>
      ) : (
        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {t('admin.vestigingen.generate_link', "Genereer link")}
        </button>
      )}
    </div>
  );
}

export default function AdminVestigingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vestiging, setVestiging] = useState<Vestiging | null>(null);
  const [koten, setKoten] = useState<Kot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();
  const { role } = useAdmin();
  const { t } = useTranslation();
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
        description_en: vestiging.description_en,
        image_url: vestiging.image_url
      })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? t('admin.vestigingen.save_error', "Opslaan van vestiging mislukt."));
    } else {
      await loadData();
      push(t('admin.common.update_success', "Vestiging bijgewerkt."));
    }
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
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
        throw new Error(errData.error || t('admin.common.upload_error', "Upload afbeelding mislukt."));
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
      push(t('admin.common.upload_success', "Afbeelding succesvol geüpload."));
    } catch (err: any) {
      setError(err.message || t('admin.common.upload_error', "Upload mislukt."));
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
      setError(payload.error ?? t('admin.koten.create_error', "Aanmaken van kot mislukt."));
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
      push(t('admin.common.create_success', "Kot aangemaakt."));
    }
    setLoading(false);
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="space-y-8 max-w-4xl">
          <PageHeader
            title={t('admin.vestigingen.detail', "Vestiging detail")}
            description={t('admin.vestigingen.edit_desc', "Werk vestiging details bij en maak nieuwe koten aan.")}
            crumbs={[
              { label: "CMS", href: "/admin" },
              { label: t('admin.view.locations', "Vestigingen"), href: "/admin/vestigingen" },
              { label: vestiging?.name ?? t('admin.common.detail', "Detail") }
            ]}
          />
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">{t('admin.vestigingen.edit', "Vestiging bewerken")}</h2>
            {vestiging ? (
              <div className="space-y-4">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  placeholder={t('admin.vestigingen.name', 'Naam')}
                  value={vestiging.name}
                  onChange={(event) =>
                    setVestiging({ ...vestiging, name: event.target.value })
                  }
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder={t('admin.vestigingen.address', 'Adres')}
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
                    placeholder={t('admin.vestigingen.city', 'Stad')}
                    value={vestiging.city}
                    onChange={(event) =>
                      setVestiging({ ...vestiging, city: event.target.value })
                    }
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder={t('admin.vestigingen.postal_code', 'Postcode')}
                    value={vestiging.postal_code}
                    onChange={(event) =>
                      setVestiging({
                        ...vestiging,
                        postal_code: event.target.value
                      })
                    }
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-800">{t('admin.vestigingen.description_nl', 'Beschrijving (NL)')}</label>
                    <textarea
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                      rows={4}
                      value={vestiging.description}
                      onChange={(event) =>
                        setVestiging({
                          ...vestiging,
                          description: event.target.value
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-primary-800 italic">{t('admin.vestigingen.description_en', 'Description (EN)')}</label>
                      <button 
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/cms/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: vestiging.description })
                          });
                          const data = await res.json();
                          if (data.translated) {
                            setVestiging({ ...vestiging, description_en: data.translated });
                            push(t('admin.common.translated_success', "Beschrijving vertaald."));
                          } else {
                            push(t('admin.common.translate_error', "Vertaling mislukt."), "error");
                          }
                        } catch (err) {
                          push(t('admin.common.translate_network_error', "Netwerkfout bij vertalen."), "error");
                        }
                      }}
                        className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                      >
                        {t('admin.common.suggest_en', 'Suggest English')}
                      </button>
                    </div>
                    <textarea
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                      rows={4}
                      value={vestiging.description_en ?? ""}
                      onChange={(event) =>
                        setVestiging({
                          ...vestiging,
                          description_en: event.target.value
                        })
                      }
                      placeholder={t('admin.vestigingen.en_placeholder', "Engelse beschrijving")}
                    />
                  </div>
                </div>
                <ImageUploadZone
                  label="Omslagfoto"
                  previewUrl={vestiging.image_url}
                  onUpload={handleFileUpload}
                />
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                  <button
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={updateVestiging}
                  disabled={loading}
                >
                  {loading ? t('admin.common.saving', "Opslaan...") : t('admin.admin.save_changes', "Wijzigingen opslaan")}
                </button>
              </div>
            ) : (
              <p className="text-sm text-text-muted">{t('admin.vestigingen.loading', "Vestiging laden...")}</p>
            )}
          </section>

          {canEditContent(role) ? (
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">{t('admin.koten.create', "Kot aanmaken")}</h2>
              <form className="space-y-4" onSubmit={createKot}>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  placeholder={t('admin.koten.field_title', "Titel")}
                  value={kotForm.title}
                  onChange={(event) =>
                    setKotForm({ ...kotForm, title: event.target.value })
                  }
                  required
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('admin.koten.desc_markdown', "Beschrijving (Markdown)")}</label>
                  <RichTextEditor
                    value={kotForm.description}
                    onChange={(val) =>
                      setKotForm({ ...kotForm, description: val })
                    }
                    placeholder={t('admin.koten.desc_placeholder', "Beschrijf deze kamer...")}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    placeholder={t('admin.koten.price', "Prijs")}
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
                    <option value="available">{t('common.available', 'beschikbaar')}</option>
                    <option value="reserved">{t('common.reserved', 'gereserveerd')}</option>
                    <option value="rented">{t('common.rented', 'verhuurd')}</option>
                    <option value="hidden">{t('status.hidden', 'verborgen')}</option>
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
                    <option value="draft">{t('status.draft', 'concept')}</option>
                    <option value="scheduled">{t('status.scheduled', 'gepland')}</option>
                    <option value="published">{t('status.published', 'gepubliceerd')}</option>
                    <option value="archived">{t('status.archived', 'gearchiveerd')}</option>
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
                  {t('admin.koten.create', "Kot aanmaken")}
                </button>
              </form>
            </section>
          ) : null}

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">{t('admin.vestigingen.floor_plan', "Plattegrond")}</h2>
              <ShareFloorPlanLink vestigingId={id} />
            </div>
            <FloorPlanManager vestigingId={id} koten={koten} />
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">{t('admin.view.koten', "Koten")}</h2>
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
                    {t('admin.koten.manage', "Beheren")}
                  </Link>
                </div>
              ))}
              {koten.length === 0 ? (
                <p className="text-sm text-text-muted">{t('admin.koten.no_koten', "Nog geen koten.")}</p>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

