"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { useAdmin } from "../AdminProvider";
import { canEditContent } from "../../../lib/cms/permissions";
import type { Kot } from "../../../types";

export default function AdminKotenPage() {
  const { activeVestigingId, role } = useAdmin();
  const [koten, setKoten] = useState<Kot[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
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

  const bulkAction = async (
    action: "publish" | "archive" | "availability",
    availability_status?: string
  ) => {
    if (selected.length === 0) return;
    if (action === "archive" && !confirm("Archive selected koten?")) return;
    await fetch("/api/cms/koten/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ids: selected, action, availability_status })
    });
    setSelected([]);
    await loadKoten();
    push("Bulk action completed.");
  };

  return (
    <AdminGuard>
      <AdminShell>
        <PageHeader
          title="Koten"
          description="Search, filter, and manage all koten."
          crumbs={[{ label: "CMS", href: "/admin" }, { label: "Koten" }]}
          actions={
            canEditContent(role) ? (
              <Link
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                href="/admin/koten/new"
              >
                New kot
              </Link>
            ) : null
          }
        />
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 flex-1"
              placeholder="Search koten..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="draft">draft</option>
              <option value="scheduled">scheduled</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("publish")}
            >
              Publish selected
            </button>
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("archive")}
            >
              Archive selected
            </button>
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("availability", "available")}
            >
              Mark available
            </button>
            <button
              className="border border-gray-200 rounded-lg px-3 py-1"
              onClick={() => bulkAction("availability", "hidden")}
            >
              Hide
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
                  <th className="py-2">Title</th>
                  <th>Status</th>
                  <th>Availability</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((kot) => (
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
                    <td className="py-2">{kot.title}</td>
                    <td>{kot.status}</td>
                    <td>{kot.availability_status}</td>
                    <td>€{kot.price}</td>
                    <td className="text-right">
                      <Link className="text-primary hover:underline" href={`/admin/koten/${kot.id}`}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-text-muted">
                      No koten found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </AdminShell>
    </AdminGuard>
  );
}

