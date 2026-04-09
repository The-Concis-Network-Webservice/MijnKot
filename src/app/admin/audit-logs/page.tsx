"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useTranslation } from "react-i18next";
import type { AuditLog } from "@/types";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const { t } = useTranslation();

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
          title={t('admin.audit_logs.title', 'Systeemlogboeken')}
          description={t('admin.audit_logs.description', 'Activiteitsgeschiedenis van het CMS (alleen lezen).')}
          crumbs={[{ label: "CMS", href: "/admin" }, { label: t('admin.view.logs', 'Logboeken') }]}
        />
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-text-muted">
                <tr>
                  <th className="py-2">{t('admin.common.time', 'Tijdstip')}</th>
                  <th>{t('admin.common.action', 'Actie')}</th>
                  <th>{t('admin.common.entity', 'Entiteit')}</th>
                  <th>{t('admin.common.user', 'Gebruiker')}</th>
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
                    <td>{log.actor_id ?? t('admin.common.system', 'systeem')}</td>
                  </tr>
                ))}
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-text-muted">
                      {t('admin.audit_logs.empty', 'Nog geen logboeken.')}
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


