'use client';

import { useState, useEffect } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { useTranslation } from "react-i18next";

type Lead = {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    source: string;
    created_at: string;
};

const PAGE_SIZE = 25;

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const { t } = useTranslation();

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/cms/leads");
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.leads.delete_confirm', "Weet je zeker dat je deze lead wilt verwijderen?"))) return;

        try {
            const res = await fetch("/api/cms/leads", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                await fetchLeads();
            } else {
                alert(t('admin.leads.delete_error', "Fout bij het verwijderen van de lead."));
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert(t('admin.leads.delete_network_error', "Netwerkfout bij het verwijderen."));
        }
    };

    return (
        <AdminGuard>
            <AdminShell>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-display font-bold text-text-main mb-8">{t('admin.leads.title', "Leads & Aanmeldingen")}</h1>

                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">{t('admin.leads.loading', 'Laden...')}</div>
                        ) : leads.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                <p>{t('admin.leads.no_leads', "Nog geen leads ontvangen.")}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-medium text-gray-500">{t('admin.leads.email', "Email")}</th>
                                            <th className="px-6 py-4 font-medium text-gray-500">{t('admin.leads.name', "Naam")}</th>
                                            <th className="px-6 py-4 font-medium text-gray-500">{t('admin.leads.phone', "Telefoon")}</th>
                                            <th className="px-6 py-4 font-medium text-gray-500">{t('admin.leads.source', "Bron")}</th>
                                            <th className="px-6 py-4 font-medium text-gray-500 text-right">{t('admin.leads.actions', "Acties")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-text-main">{lead.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{lead.name || '-'}</td>
                                                <td className="px-6 py-4 text-gray-600">{lead.phone || '-'}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                                        {lead.source}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                    {new Date(lead.created_at).toLocaleDateString('nl-BE', {
                                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleDelete(lead.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title={t('admin.common.delete', "Verwijder lead")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {leads.length > PAGE_SIZE && (
                                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-sm">
                                        <span className="text-gray-500">
                                            {t('admin.leads.pagination_info', "{{total}} leads · pagina {{page}} van {{pages}}", { 
                                                total: leads.length, 
                                                page, 
                                                pages: Math.ceil(leads.length / PAGE_SIZE) 
                                            })}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40" onClick={() => setPage(p => p - 1)} disabled={page === 1}>{t('admin.leads.prev', '← Vorige')}</button>
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40" onClick={() => setPage(p => p + 1)} disabled={page === Math.ceil(leads.length / PAGE_SIZE)}>{t('admin.leads.next', 'Volgende →')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </AdminShell>
        </AdminGuard>
    );
}
