"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "../../_components/admin-guard";
import { AdminShell } from "../../_components/admin-shell";
import { PhotoManager } from "../../_components/photo-manager";
import { PageHeader } from "../../_components/page-header";
import { useToast } from "../../_components/toast";
import { AITextPolisher } from "@/shared/ui/ai-text-polisher";
import type { AvailabilityHistory, Kot, KotPhoto, RentType, Vestiging } from "@/types";

type KotWithPhotos = Kot & { kot_photos?: KotPhoto[]; vestigingen?: Vestiging };

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  available: { bg: "bg-green-100", text: "text-green-800", label: "Beschikbaar" },
  reserved:  { bg: "bg-yellow-100", text: "text-yellow-800", label: "Gereserveerd" },
  rented:    { bg: "bg-red-100", text: "text-red-800", label: "Verhuurd" },
  hidden:    { bg: "bg-gray-100", text: "text-gray-500", label: "Verborgen" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_BADGE[status] ?? { bg: "bg-gray-100", text: "text-gray-600", label: status };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

export default function AdminKotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [kot, setKot] = useState<KotWithPhotos | null>(null);
  const [history, setHistory] = useState<AvailabilityHistory[]>([]);
  const [allRentTypes, setAllRentTypes] = useState<RentType[]>([]);
  const [kotRentTypeIds, setKotRentTypeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  const loadKot = async () => {
    const res = await fetch(`/api/cms/koten?id=${id}`);
    const payload = await res.json();
    const item = payload.data?.[0] ?? null;
    if (!item) {
      setKot(null);
      return;
    }
    const photosRes = await fetch(`/api/cms/kot-photos?kot_id=${id}`);
    const photosPayload = await photosRes.json();
    setKot({ ...item, kot_photos: photosPayload.data ?? [] });
    const historyRes = await fetch(`/api/cms/koten/history?id=${id}`);
    const historyPayload = await historyRes.json();
    setHistory(historyPayload.data ?? []);
  };

  const loadRentTypes = async () => {
    const [allRes, kotRes] = await Promise.all([
      fetch("/api/cms/rent-types"),
      fetch(`/api/cms/koten/rent-types?kot_id=${id}`)
    ]);
    const allPayload = await allRes.json();
    const kotPayload = await kotRes.json();
    setAllRentTypes(allPayload.data ?? []);
    setKotRentTypeIds(kotPayload.data ?? []);
  };

  const toggleRentType = async (rentTypeId: string, checked: boolean) => {
    const res = await fetch("/api/cms/koten/rent-types", {
      method: checked ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kot_id: id, rent_type_id: rentTypeId })
    });
    if (res.ok) {
      setKotRentTypeIds(prev => checked ? [...prev, rentTypeId] : prev.filter(x => x !== rentTypeId));
    } else {
      push("Failed to update rent type.", "error");
    }
  };

  useEffect(() => {
    loadKot();
    loadRentTypes();
  }, [id]);

  const updateKot = async () => {
    if (!kot) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/cms/koten", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        title: kot.title,
        title_en: kot.title_en,
        description: kot.description,
        description_en: kot.description_en,
        description_raw: kot.description_raw,
        description_polished: kot.description_polished,
        price: kot.price,
        availability_status: kot.availability_status,
        status: kot.status,
        is_highlighted: kot.is_highlighted
      })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Failed to save kot.");
    } else {
      await loadKot();
      push("Kot updated.");
    }
    setLoading(false);
  };



  return (
    <AdminGuard>
      <AdminShell>
        <div className="space-y-8 max-w-4xl">
          <PageHeader
            title="Kot detail"
            description="Edit kot details, availability, and media."
            crumbs={[
              { label: "CMS", href: "/admin" },
              { label: "Koten", href: "/admin/koten" },
              { label: kot?.title ?? "Detail" }
            ]}
          />
          <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Edit kot</h2>
              <div className="flex items-center gap-3 text-sm">
                <button
                  className="text-primary"
                  onClick={async () => {
                    if (!kot) return;
                    setLoading(true);
                    // 1. Save current changes first
                    await fetch("/api/cms/koten", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id,
                        title: kot.title,
                        title_en: kot.title_en,
                        description: kot.description,
                        description_en: kot.description_en,
                        description_raw: kot.description_raw,
                        description_polished: kot.description_polished,
                        price: kot.price,
                        availability_status: kot.availability_status,
                        status: kot.status,
                        is_highlighted: kot.is_highlighted
                      })
                    });
                    // 2. Then publish
                    await fetch("/api/cms/koten", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id, action: "publish" })
                    });
                    await loadKot();
                    push("Kot published and saved.");
                    setLoading(false);
                  }}
                >
                  Publish now
                </button>
                <button
                  className="text-red-500"
                  onClick={async () => {
                    if (!kot) return;
                    if (!confirm("Archive this kot? It will no longer be public.")) return;
                    setLoading(true);
                    // 1. Save changes first
                    await fetch("/api/cms/koten", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id,
                        title: kot.title,
                        title_en: kot.title_en,
                        description: kot.description,
                        description_en: kot.description_en,
                        description_raw: kot.description_raw,
                        description_polished: kot.description_polished,
                        price: kot.price,
                        availability_status: kot.availability_status,
                        status: kot.status,
                        is_highlighted: kot.is_highlighted
                      })
                    });
                    // 2. Archive
                    await fetch("/api/cms/koten", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id, action: "archive" })
                    });
                    await loadKot();
                    push("Kot archived and saved.");
                    setLoading(false);
                  }}
                >
                  Archive kot
                </button>
              </div>
            </div>
            {kot ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                    <input
                      type="checkbox"
                      checked={!!kot.is_highlighted}
                      onChange={(e) => setKot({ ...kot, is_highlighted: e.target.checked })}
                      className="rounded text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-yellow-800">Highlight (Top of list)</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-800">Titel (NL)</label>
                    <input
                      className="border border-border-DEFAULT rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main"
                      value={kot.title}
                      onChange={(event) =>
                        setKot({ ...kot, title: event.target.value })
                      }
                      placeholder="Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-primary-800 italic">Title (EN)</label>
                      <button 
                        onClick={async () => {
                          const res = await fetch('/api/cms/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: kot.title })
                          });
                          const { translated } = await res.json();
                          if (translated) setKot({ ...kot, title_en: translated });
                        }}
                        className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                      >
                        Suggest English
                      </button>
                    </div>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                      value={kot.title_en ?? ""}
                      onChange={(event) =>
                        setKot({ ...kot, title_en: event.target.value })
                      }
                      placeholder="English title"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-800">Beschrijving (NL)</label>
                    {/* AI Text Polisher for Description */}
                    <AITextPolisher
                      rawText={kot.description_raw || kot.description || ''}
                      polishedText={kot.description_polished || ''}
                      onTextChange={(raw, polished) => {
                        setKot({
                          ...kot,
                          description_raw: raw,
                          description_polished: polished,
                          description: polished || raw // Use polished if available, otherwise raw
                        });
                      }}
                      language="nl-BE"
                      kotMeta={{
                        title: kot.title,
                        city: kot.vestigingen?.city || 'Unknown'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-primary-800 italic">Description (EN)</label>
                      <button 
                        onClick={async () => {
                          const res = await fetch('/api/cms/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: kot.description })
                          });
                          const { translated } = await res.json();
                          if (translated) setKot({ ...kot, description_en: translated });
                        }}
                        className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                      >
                        Suggest English
                      </button>
                    </div>
                    <textarea
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                      rows={4}
                      value={kot.description_en ?? ""}
                      onChange={(event) =>
                        setKot({ ...kot, description_en: event.target.value })
                      }
                      placeholder="English description"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main w-full"
                    type="number"
                    min="1"
                    step="1"
                    value={kot.price}
                    onChange={(event) =>
                      setKot({
                        ...kot,
                        price: Number(event.target.value)
                      })
                    }
                    placeholder="Prijs"
                  />
                  <select
                    className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main bg-white w-full"
                    value={kot.availability_status}
                    onChange={(event) =>
                      setKot({
                        ...kot,
                        availability_status: event.target.value as Kot["availability_status"]
                      })
                    }
                  >
                    <option value="available">available</option>
                    <option value="reserved">reserved</option>
                    <option value="rented">rented</option>
                    <option value="hidden">hidden</option>
                  </select>
                </div>
                <select
                  className="border border-border-DEFAULT rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-main bg-white w-full"
                  value={kot.status}
                  onChange={(event) =>
                    setKot({
                      ...kot,
                      status: event.target.value as Kot["status"]
                    })
                  }
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <button
                  className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-2.5 rounded-lg font-medium shadow-sm w-full md:w-auto"
                  onClick={updateKot}
                  disabled={loading}
                >
                  Save changes
                </button>
              </>
            ) : (
              <p className="text-sm text-text-muted">Loading kot...</p>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Huurtype</h2>
            {allRentTypes.length === 0 ? (
              <p className="text-sm text-text-muted">Geen huurtypen gevonden. Voeg ze toe via Settings → Categories.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {allRentTypes.map(rt => (
                  <label key={rt.id} className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-border-DEFAULT hover:border-primary-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={kotRentTypeIds.includes(rt.id)}
                      onChange={e => toggleRentType(rt.id, e.target.checked)}
                      className="rounded text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium">{rt.name}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Photos</h2>
            {kot ? (
              <PhotoManager
                kotId={kot.id}
                photos={kot.kot_photos ?? []}
                onChange={loadKot}
              />
            ) : null}
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Availability history</h2>
            {history.length === 0 ? (
              <p className="text-sm text-text-muted">Nog geen statuswijzigingen.</p>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-4 text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={entry.old_status} />
                      <span className="text-gray-400">→</span>
                      <StatusBadge status={entry.new_status} />
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(entry.changed_at).toLocaleString("nl-BE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Contracts</h2>
              <button
                onClick={async () => {
                  if (!kot) return;
                  if (!confirm("Genereer nieuw contract voor dit kot?")) return;

                  try {
                    const res = await fetch('/api/admin/contracts/generate', {
                      method: 'POST',
                      body: JSON.stringify({
                        kot_id: id,
                        kot_data: {
                          price: kot.price,
                          address: kot.vestigingen?.address
                        }
                      })
                    });

                    const data = await res.json();
                    if (res.ok) {
                      prompt("Contract Link Aangemaakt! Stuur deze naar de huurder:", `${window.location.origin}/sign/${data.token}`);
                    } else {
                      alert(data.error || 'Fout bij aanmaken contract');
                    }
                  } catch (e) {
                    console.error(e);
                    alert('Fout bij aanmaken contract');
                  }
                }}
                className="bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700"
              >
                Maak contract
              </button>
            </div>
            <p className="text-sm text-text-muted">
              Genereer en beheer huurcontracten voor dit kot.
            </p>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
