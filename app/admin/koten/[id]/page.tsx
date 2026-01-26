"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "../../_components/admin-guard";
import { AdminShell } from "../../_components/admin-shell";
import { PhotoManager } from "../../_components/photo-manager";
import { PageHeader } from "../../_components/page-header";
import { useToast } from "../../_components/toast";
import { AITextPolisher } from "../../../../components/ai-text-polisher";
import type { AvailabilityHistory, Kot, KotPhoto, Vestiging } from "../../../../types";

type KotWithPhotos = Kot & { kot_photos?: KotPhoto[]; vestigingen?: Vestiging };

export default function AdminKotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [kot, setKot] = useState<KotWithPhotos | null>(null);
  const [history, setHistory] = useState<AvailabilityHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  const formatDatetimeLocal = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

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

  useEffect(() => {
    loadKot();
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
        description: kot.description,
        price: kot.price,
        availability_status: kot.availability_status,
        status: kot.status,
        scheduled_publish_at: kot.scheduled_publish_at
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

  const deleteKot = async () => {
    if (!confirm("Archive this kot? It will no longer be public.")) return;
    await fetch("/api/cms/koten", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, action: "archive" })
    });
    await loadKot();
    push("Kot archived.");
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
                    await fetch("/api/cms/koten", {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ id, action: "publish" })
                    });
                    await loadKot();
                    push("Kot published.");
                  }}
                >
                  Publish now
                </button>
                <button className="text-red-500" onClick={deleteKot}>
                  Archive kot
                </button>
              </div>
            </div>
            {kot ? (
              <>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={kot.title}
                  onChange={(event) =>
                    setKot({ ...kot, title: event.target.value })
                  }
                />

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

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    type="number"
                    value={kot.price}
                    onChange={(event) =>
                      setKot({
                        ...kot,
                        price: Number(event.target.value)
                      })
                    }
                  />
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    value={kot.availability_status}
                    onChange={(event) =>
                      setKot({
                        ...kot,
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
                    value={kot.status}
                    onChange={(event) =>
                      setKot({
                        ...kot,
                        status: event.target.value as Kot["status"]
                      })
                    }
                  >
                    <option value="draft">draft</option>
                    <option value="scheduled">scheduled</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    type="datetime-local"
                    value={formatDatetimeLocal(kot.scheduled_publish_at)}
                    onChange={(event) =>
                      setKot({
                        ...kot,
                        scheduled_publish_at: event.target.value
                      })
                    }
                  />
                </div>
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
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
            <h2 className="font-semibold text-lg mb-4">
              Availability history
            </h2>
            <div className="space-y-2 text-sm text-text-muted">
              {history.map((entry) => (
                <div key={entry.id} className="flex justify-between">
                  <span>
                    {entry.old_status} → {entry.new_status}
                  </span>
                  <span>{new Date(entry.changed_at).toLocaleString()}</span>
                </div>
              ))}
              {history.length === 0 ? (
                <p>No availability changes yet.</p>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

