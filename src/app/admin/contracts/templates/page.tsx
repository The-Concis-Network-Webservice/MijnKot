'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RichTextEditor } from '../../_components/rich-text-editor';

interface Template {
    id: string;
    name: string;
    content: string;
    is_default: boolean;
    updated_at: string;
}

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        is_default: false,
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/admin/templates');
            if (res.ok) {
                const data = await res.json();
                setTemplates(data as Template[]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsCreating(false);
                setFormData({ name: '', content: '', is_default: false });
                fetchTemplates();
            } else {
                alert('Failed to save template');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving template');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto text-slate-800">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Contract Templates</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    {isCreating ? 'Cancel' : 'New Template'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4">Create New Template</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Template Name</label>
                            <input
                                type="text"
                                required
                                className="w-full border p-2 rounded"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Content (HTML & Markdown supported)
                                <span className="text-gray-500 text-xs ml-2">
                                    Placeholders: {'{{tenant_firstname}}'}, {'{{tenant_lastname}}'}, {'{{kot_address}}'}, {'{{price}}'}, etc.
                                </span>
                            </label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={val => setFormData({ ...formData, content: val })}
                                placeholder="Contract content..."
                                minHeight="400px"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
                            />
                            <label htmlFor="is_default">Set as Default Template</label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Save Template
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-4">
                    {templates.length === 0 ? (
                        <p className="text-gray-500">No templates found.</p>
                    ) : templates.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded shadow border border-slate-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    {t.name}
                                    {t.is_default && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Default</span>}
                                </h3>
                                <p className="text-xs text-gray-500">Last updated: {new Date(t.updated_at).toLocaleDateString()}</p>
                            </div>
                            {/* Add Edit/Delete buttons later */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
