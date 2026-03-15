"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { RichTextEditor } from "../_components/rich-text-editor";
import type { FaqItem } from "@/types";

const emptyForm = {
  question: "",
  answer: "",
  category: "",
  order_index: "0"
};

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  const loadItems = async () => {
    const res = await fetch("/api/cms/faq");
    const payload = await res.json();
    setItems(payload.data ?? []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const method = editingId ? "PATCH" : "POST";
    console.log(`Submitting FAQ with method ${method}:`, {
      id: editingId,
      question: form.question,
      category: form.category
    });

    const res = await fetch("/api/cms/faq", {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: editingId,
        question: form.question,
        answer: form.answer,
        category: form.category,
        order_index: Number(form.order_index)
      })
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? (editingId ? "Failed to update FAQ." : "Failed to add FAQ."));
    } else {
      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
      push(editingId ? "FAQ item updated." : "FAQ item added.");
    }
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Wilt u deze FAQ verwijderen?")) return;
    await fetch("/api/cms/faq", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    await loadItems();
    push("FAQ-item verwijderd.");
  };

  const deleteCategory = async (category: string) => {
    if (!confirm(`Wilt u de VOLLEDIGE categorie "${category}" verwijderen? Dit verwijdert alle vragen in deze groep.`)) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/cms/faq", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ category })
      });
      
      if (!res.ok) throw new Error("Verwijderen mislukt");
      
      await loadItems();
      push(`Categorie "${category}" verwijderd.`);
    } catch (err) {
      setError("Kon categorie niet verwijderen.");
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category || "Overig";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <AdminGuard>
      <AdminShell>
        <div className="max-w-4xl space-y-8">
          <PageHeader
            title="FAQ"
            description="Manage frequently asked questions."
            crumbs={[{ label: "CMS", href: "/admin" }, { label: "FAQ" }]}
          />
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Add FAQ item</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                placeholder="Question"
                value={form.question}
                onChange={(event) =>
                  setForm({ ...form, question: event.target.value })
                }
                required
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Answer</label>
                <RichTextEditor
                  placeholder="Answer"
                  value={form.answer}
                  onChange={(value) => setForm({ ...form, answer: value })}
                  minHeight="200px"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                    placeholder="Category"
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    required
                  />
                  {Array.from(new Set(items.map(i => i.category))).filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(items.map(i => i.category))).filter(Boolean).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                            form.category === cat 
                              ? 'bg-primary-100 border-primary-300 text-primary-900' 
                              : 'bg-secondary-50 border-secondary-200 text-secondary-600 hover:border-secondary-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 h-fit"
                  placeholder="Order"
                  type="number"
                  value={form.order_index}
                  onChange={(event) =>
                    setForm({ ...form, order_index: event.target.value })
                  }
                  required
                />
              </div>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex items-center gap-3">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                  disabled={loading}
                  type="submit"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Add item"}
                </button>
                {editingId ? (
                  <button
                    className="text-sm text-text-muted"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Existing items</h2>
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-primary-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                      {category}
                    </h3>
                    <button 
                      onClick={() => deleteCategory(category)}
                      className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Categorie verwijderen
                    </button>
                  </div>
                  
                  <div className="space-y-3 pl-4">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50/50 hover:bg-white border border-gray-100/50 hover:border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold mb-2 text-text-main">{item.question}</p>
                          <div className="text-sm text-text-muted prose prose-sm max-w-none">
                            <ReactMarkdown>{item.answer}</ReactMarkdown>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm flex-shrink-0">
                          <button
                            className="text-primary-600 font-medium hover:text-primary-800 transition-colors"
                            onClick={() => {
                              setEditingId(item.id);
                              setForm({
                                question: item.question,
                                answer: item.answer,
                                category: item.category,
                                order_index: String(item.order_index)
                              });
                            }}
                          >
                            Bewerken
                          </button>
                          <button
                            className="text-red-400 hover:text-red-600 transition-colors"
                            onClick={() => deleteItem(item.id)}
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {items.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-text-muted">Nog geen FAQ-items aanwezig.</p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}


