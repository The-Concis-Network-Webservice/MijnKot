'use client';

import { useState, useEffect } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";

type Lead = {
    id: string;
    email: string;
    name: string | null;
    source: string;
    created_at: string;
};

const PAGE_SIZE = 25;

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

    return (
        <AdminGuard>
            <AdminShell>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-display font-bold text-text-main mb-8">Leads & Aanmeldingen</h1>

                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Laden...</div>
                        ) : leads.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                <p>Nog geen leads ontvangen.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-medium text-gray-500">Email</th>
                                            <th className="px-6 py-4 font-medium text-gray-500">Naam</th>
                                            <th className="px-6 py-4 font-medium text-gray-500">Bron</th>
                                            <th className="px-6 py-4 font-medium text-gray-500">Datum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-text-main">{lead.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{lead.name || '-'}</td>
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
                                        <span className="text-gray-500">{leads.length} leads · pagina {page} van {Math.ceil(leads.length / PAGE_SIZE)}</span>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Vorige</button>
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40" onClick={() => setPage(p => p + 1)} disabled={page === Math.ceil(leads.length / PAGE_SIZE)}>Volgende →</button>
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
