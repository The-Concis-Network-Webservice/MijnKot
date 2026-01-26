"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import type { AuditLog } from "../../../types";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const loadLogs = async () => {
    const res = await fetch("/api/cms/audit-logs");
    const payload = await res.json();
    setLogs(payload.data ?? []);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <AdminGuard>
      <AdminShell>
        <PageHeader
          title="Audit logs"
          description="Read-only activity history across the CMS."
          crumbs={[{ label: "CMS", href: "/admin" }, { label: "Audit logs" }]}
        />
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-text-muted">
                <tr>
                  <th className="py-2">Time</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Actor</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-gray-100">
                    <td className="py-2">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>{log.action}</td>
                    <td>
                      {log.entity_type} / {log.entity_id}
                    </td>
                    <td>{log.actor_id ?? "system"}</td>
                  </tr>
                ))}
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-text-muted">
                      No audit logs yet.
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

