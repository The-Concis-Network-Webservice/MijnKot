'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminShell } from '../../../_components/admin-shell';
import { PageHeader } from '../../../_components/page-header';
import { AdminGuard } from '../../../_components/admin-guard';
import { useToast } from '../../../_components/toast';

interface Template {
    id: string;
    name: string;
}

export default function GenerateContractPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { push } = useToast();

    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [kot, setKot] = useState<any>(null);

    const [formData, setFormData] = useState({
        template_id: '',
    });

    useEffect(() => {
        // Load Templates and Kot Data
        Promise.all([
            fetch('/api/admin/templates').then(r => r.json()),
            fetch(`/api/cms/koten?id=${id}`).then(r => r.json())
        ]).then(([templatesData, kotData]) => {
            setTemplates(templatesData || []);
            if (templatesData && templatesData.length > 0) {
                // Find default or use first
                const defaultTemplate = templatesData.find((t: any) => t.is_default) || templatesData[0];
                setFormData(prev => ({ ...prev, template_id: defaultTemplate.id }));
            }
            setKot(kotData.data?.[0]);
            setLoading(false);
        });
    }, [id]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);

        try {
            const res = await fetch('/api/admin/contracts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kot_id: id,
                    ...formData,
                    kot_data: {
                        price: kot?.price,
                        address: kot?.vestigingen?.address // Assuming join, but might need separate fetch if not joined
                    }
                })
            });

            const data = await res.json();

            if (res.ok) {
                push('Contract generated successfully!');
                // Show the signing link
                prompt("Contract Link Generated! Send this to the tenant (they will fill in their details):", `${window.location.origin}/sign/${data.token}`);
                router.push(`/admin/koten/${id}`);
            } else {
                alert(data.error || 'Failed to generate contract');
            }
        } catch (err) {
            console.error(err);
            alert('Error generating contract');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <AdminGuard><AdminShell>Loading...</AdminShell></AdminGuard>;

    return (
        <AdminGuard>
            <AdminShell>
                <PageHeader
                    title="Generate Contract"
                    description={`Create a rental contract for ${kot?.title}`}
                    crumbs={[
                        { label: "Koten", href: "/admin/koten" },
                        { label: kot?.title, href: `/admin/koten/${id}` },
                        { label: "Generate Contract" }
                    ]}
                />

                <div className="max-w-2xl bg-white p-6 rounded-2xl border border-gray-200 mt-6">
                    <form onSubmit={handleGenerate} className="space-y-4">
                        {/* Template is auto-selected */}
                        <div className="hidden">
                            <label className="block text-sm font-medium mb-1">Select Template</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={formData.template_id}
                                onChange={e => setFormData({ ...formData, template_id: e.target.value })}
                                required
                            >
                                <option value="">-- Select Template --</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tenant details will be filled by the tenant at signing time */}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={generating}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold w-full disabled:opacity-50"
                            >
                                {generating ? 'Generating...' : 'Maak contract'}
                            </button>
                        </div>
                    </form>
                </div>
            </AdminShell>
        </AdminGuard>
    );
}
