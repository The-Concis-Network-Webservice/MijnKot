"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { useAdmin } from "../AdminProvider";
import { useTranslation } from "react-i18next";
import { canEditContent } from "@/shared/lib/cms/permissions";
import type { Kot } from "@/types";

const PAGE_SIZE = 20;

export default function AdminKotenPage() {
  const { activeVestigingId, role } = useAdmin();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [koten, setKoten] = useState<Kot[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const { push } = useToast();

  const loadKoten = async () => {
    const params = new URLSearchParams();
    if (activeVestigingId) params.set("vestiging_id", activeVestigingId);
    const res = await fetch(`/api/cms/koten?${params.toString()}`);
    const payload = await res.json();
    setKoten(payload.data ?? []);
  };

  useEffect(() => {
    loadKoten();
  }, [activeVestigingId]);

  const filtered = koten.filter((kot) => {
    const matchesSearch =
      kot.title.toLowerCase().includes(search.toLowerCase()) ||
      kot.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? kot.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const deleteKot = async (id: string, title: string) => {
    if (!confirm(`"${title}" definitief verwijderen? Dit kan niet ongedaan worden.`)) return;
    const res = await fetch(`/api/cms/koten?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadKoten();
      push("Kot verwijderd.");
    } else {
      const payload = await res.json();
      push(payload.error ?? "Verwijderen mislukt.");
    }
  };

  const bulkAction = async (
    action: "publish" | "archive" | "availability",
    availability_status?: string
  ) => {
    if (selected.length === 0) return;
    const n = selected.length;
    if (action === "publish" && !confirm(`${n} kot(en) publiceren?`)) return;
    if (action === "archive" && !confirm(`${n} kot(en) archiveren? Ze worden niet meer getoond.`)) return;
    if (action === "availability" && availability_status === "hidden" && !confirm(`${n} kot(en) verbergen?`)) return;
    if (action === "availability" && availability_status === "available" && !confirm(`${n} kot(en) als beschikbaar markeren?`)) return;
    await fetch("/api/cms/koten/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ids: selected, action, availability_status })
    });
    setSelected([]);
    await loadKoten();
    push("Bulkactie voltooid.");
  };

  return (
    <AdminGuard>
      <AdminShell>
        <PageHeader
          title={t('admin.koten.title', 'Koten')}
          description={t('admin.koten.description', 'Zoek, filter en beheer alle koten.')}
          crumbs={[{ label: "CMS", href: "/admin" }, { label: t('admin.koten.title', 'Koten') }]}
          actions={
            canEditContent(role) && (
              <Link
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                href="/admin/koten/new"
              >
                {t('admin.koten.new', 'Nieuw kot')}
              </Link>
            )
          }
        />
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 flex-1"
              placeholder="Zoek koten..."
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2"
              value={statusFilter}
              onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
            >
              <option value="">Alle statussen</option>
              <option value="draft">concept</option>
              <option value="published">gepubliceerd</option>
              <option value="archived">gearchiveerd</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("publish")}
            >
              Publiceer geselecteerde
            </button>
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("archive")}
            >
              Archiveer geselecteerde
            </button>
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("availability", "available")}
            >
              Markeer beschikbaar
            </button>
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("availability", "hidden")}
            >
              Verbergen
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-text-muted">
                <tr>
                  <th className="py-2">
                    <input
                      type="checkbox"
                      checked={selected.length > 0 && selected.length === filtered.length}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelected(filtered.map((kot) => kot.id));
                        } else {
                          setSelected([]);
                        }
                      }}
                    />
                  </th>
                    <th className="py-2">{t('common.title', 'Titel')}</th>
                    <th>Status</th>
                    <th>{t('common.availability', 'Beschikbaarheid')}</th>
                    <th>{t('common.price', 'Prijs')}</th>
                    <th></th>
                  </tr>
              </thead>
              <tbody>
                {paginated.map((kot) => (
                  <tr key={kot.id} className="border-t border-gray-100">
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(kot.id)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelected((prev) => [...prev, kot.id]);
                          } else {
                            setSelected((prev) => prev.filter((id) => id !== kot.id));
                          }
                        }}
                      />
                    </td>
                    <td className="py-2">
                      {locale === 'en' && kot.title_en ? kot.title_en : kot.title}
                      {locale === 'en' && !kot.title_en && (
                        <span className="ml-2 text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 flex-inline items-center gap-1">
                           Geen EN vertaling
                        </span>
                      )}
                    </td>
                    <td>{kot.status}</td>
                    <td>{kot.availability_status}</td>
                    <td>€{kot.price}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link className="text-primary hover:underline" href={`/admin/koten/${kot.id}`}>
                          Beheren
                        </Link>
                        <button
                          className="text-red-500 hover:text-red-700 text-sm"
                          onClick={() => deleteKot(kot.id, kot.title)}
                        >
                          Verwijder
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-text-muted">
                      Geen koten gevonden.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
              <span className="text-text-muted">{filtered.length} resultaten · pagina {page} van {totalPages}</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  ← Vorige
                </button>
                <button
                  className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  Volgende →
                </button>
              </div>
            </div>
          )}
        </section>
      </AdminShell>
    </AdminGuard>
  );
}


