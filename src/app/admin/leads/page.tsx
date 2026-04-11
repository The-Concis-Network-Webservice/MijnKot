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
    const [filterSource, setFilterSource] = useState<string>('all');
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

    const filteredLeads = leads.filter(l => 
        filterSource === 'all' ? true : l.source === filterSource
    );

    const sources = ['all', 'modal', 'erasmus_short_term', 'academic_year', 'prebooking_next_year'];

    const getSourceName = (s: string) => {
        return s === 'modal' ? 'Nieuwsbrief' : 
               s === 'erasmus_short_term' ? 'Erasmus' : 
               s === 'academic_year' ? 'Academiejaar' : 
               s === 'prebooking_next_year' ? 'Voorboek' : s;
    };

    const exportToCSV = () => {
        if (filteredLeads.length === 0) return;
        
        const headers = ['Email', 'Naam', 'Telefoon', 'Bron', 'Datum'];
        const csvRows = [headers.join(',')];
        
        filteredLeads.forEach(lead => {
            const dateStr = new Date(lead.created_at).toLocaleDateString('nl-BE', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            const row = [
                `"${lead.email.replace(/"/g, '""')}"`,
                `"${(lead.name || '').replace(/"/g, '""')}"`,
                `"${(lead.phone || '').replace(/"/g, '""')}"`,
                `"${getSourceName(lead.source)}"`,
                `"${dateStr}"`
            ];
            csvRows.push(row.join(','));
        });
        
        const csvData = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const csvUrl = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = csvUrl;
        
        const filenameSource = filterSource === 'all' ? 'alle' : filterSource;
        link.setAttribute('download', `leads_${filenameSource}_${new Date().toISOString().split('T')[0]}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminGuard>
            <AdminShell>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h1 className="text-3xl font-display font-bold text-text-main">{t('admin.leads.title', "Leads & Aanmeldingen")}</h1>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto whitespace-nowrap shrink-0">
                                {sources.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setFilterSource(s); setPage(1); }}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            filterSource === s 
                                                ? 'bg-white text-primary-600 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {s === 'all' ? 'Alles' : 
                                         s === 'modal' ? 'Nieuwsbrief' : 
                                         s === 'erasmus_short_term' ? 'Erasmus' : 
                                         s === 'academic_year' ? 'Academiejaar' : 'Voorboek'}
                                    </button>
                                ))}
                            </div>
                            
                            <button
                                onClick={exportToCSV}
                                disabled={filteredLeads.length === 0}
                                className="px-4 py-1.5 bg-primary-600/10 text-primary-700 hover:bg-primary-600 hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 border border-primary-600/20 hover:border-transparent"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {t('admin.leads.export_csv', "Download CSV")}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">{t('admin.leads.loading', 'Laden...')}</div>
                        ) : filteredLeads.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                <p>{t('admin.leads.no_leads', "Geen leads gevonden voor dit filter.")}</p>
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
                                            <th className="px-6 py-4 font-medium text-gray-500">{t('admin.leads.date', "Datum")}</th>
                                            <th className="px-6 py-4 font-medium text-gray-500 text-right">{t('admin.leads.actions', "Acties")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-text-main">{lead.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{lead.name || '-'}</td>
                                                <td className="px-6 py-4 text-gray-600">{lead.phone || '-'}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                                        lead.source === 'erasmus_short_term' ? 'bg-amber-50 text-amber-700' :
                                                        lead.source === 'prebooking_next_year' ? 'bg-sky-50 text-sky-700' :
                                                        lead.source === 'academic_year' ? 'bg-indigo-50 text-indigo-700' :
                                                        'bg-blue-50 text-blue-700'
                                                    }`}>
                                                        {lead.source === 'modal' ? 'Nieuwsbrief' : 
                                                         lead.source === 'erasmus_short_term' ? 'Erasmus' : 
                                                         lead.source === 'academic_year' ? 'Academiejaar' : 
                                                         lead.source === 'prebooking_next_year' ? 'Voorboek' : lead.source}
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
                                {filteredLeads.length > PAGE_SIZE && (
                                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-sm">
                                        <span className="text-gray-500">
                                            {t('admin.leads.pagination_info', "{{total}} leads · pagina {{page}} van {{pages}}", { 
                                                total: filteredLeads.length, 
                                                page, 
                                                pages: Math.ceil(filteredLeads.length / PAGE_SIZE) 
                                            })}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40" onClick={() => setPage(p => p - 1)} disabled={page === 1}>{t('admin.leads.prev', '← Vorige')}</button>
                                            <button className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40" onClick={() => setPage(p => p + 1)} disabled={page === Math.ceil(filteredLeads.length / PAGE_SIZE)}>{t('admin.leads.next', 'Volgende →')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }</div>
                </div>
            </AdminShell>
        </AdminGuard>
    );
}
