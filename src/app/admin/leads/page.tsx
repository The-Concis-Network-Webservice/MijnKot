'use client';

import { useState, useEffect } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { Mail, Phone, User, Download } from "lucide-react";

type Lead = {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    source: string;
    created_at: string;
};

const PAGE_SIZE = 25;

function exportCsv(leads: Lead[]) {
    const header = ["Naam", "Email", "Telefoon", "Bron", "Datum"];
    const rows = leads.map((l) => [
        l.name ?? "",
        l.email,
        l.phone ?? "",
        l.source,
        new Date(l.created_at).toLocaleString("nl-BE"),
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchLeads() {
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
        fetchLeads();
    }, []);

    const paginated = leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(leads.length / PAGE_SIZE);

    return (
        <AdminGuard>
            <AdminShell>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <PageHeader
                        title="Leads & Aanmeldingen"
                        description={`${leads.length} aanmeldingen via de nieuwsbrief popup`}
                        actions={
                            leads.length > 0 ? (
                                <button
                                    onClick={() => exportCsv(leads)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Exporteer CSV
                                </button>
                            ) : undefined
                        }
                    />

                    {/* Summary cards */}
                    {!loading && leads.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Totaal</p>
                                <p className="text-3xl font-bold text-text-main">{leads.length}</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Met telefoon</p>
                                <p className="text-3xl font-bold text-text-main">
                                    {leads.filter((l) => l.phone).length}
                                </p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Vandaag</p>
                                <p className="text-3xl font-bold text-text-main">
                                    {leads.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Laden...</div>
                        ) : leads.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                                <Mail className="w-8 h-8 text-gray-300" />
                                <p>Nog geen aanmeldingen ontvangen.</p>
                                <p className="text-xs text-gray-400">Aanmeldingen via de nieuwsbrief popup verschijnen hier automatisch.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-medium text-gray-500">
                                                <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Naam</span>
                                            </th>
                                            <th className="px-6 py-4 font-medium text-gray-500">
                                                <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email</span>
                                            </th>
                                            <th className="px-6 py-4 font-medium text-gray-500">
                                                <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />Telefoon</span>
                                            </th>
                                            <th className="px-6 py-4 font-medium text-gray-500">Bron</th>
                                            <th className="px-6 py-4 font-medium text-gray-500">Datum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginated.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-text-main">
                                                    {lead.name || <span className="text-gray-400 font-normal">—</span>}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    <a href={`mailto:${lead.email}`} className="hover:text-primary-600 transition-colors">
                                                        {lead.email}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {lead.phone ? (
                                                        <a href={`tel:${lead.phone}`} className="hover:text-primary-600 transition-colors">
                                                            {lead.phone}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {leads.length > PAGE_SIZE && (
                                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-sm">
                                        <span className="text-gray-500">
                                            {leads.length} aanmeldingen · pagina {page} van {totalPages}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                                onClick={() => setPage(p => p - 1)}
                                                disabled={page === 1}
                                            >
                                                ← Vorige
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                                onClick={() => setPage(p => p + 1)}
                                                disabled={page === totalPages}
                                            >
                                                Volgende →
                                            </button>
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
