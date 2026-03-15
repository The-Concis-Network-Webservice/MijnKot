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
  question_en: "",
  answer: "",
  answer_en: "",
  category: "",
  category_en: "",
  order_index: "0"
};

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"nl" | "en">("nl");
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
        question_en: form.question_en,
        answer: form.answer,
        answer_en: form.answer_en,
        category: form.category,
        category_en: form.category_en,
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
    const cat = activeTab === "en" 
      ? (item.category_en || item.category || "Other")
      : (item.category || "Overig");
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
          <section id="faq-form" className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ring-1 ring-gray-900/5 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-text-main">
                {editingId 
                  ? (activeTab === "en" ? "Edit FAQ item" : "FAQ aanpassen") 
                  : (activeTab === "en" ? "Add FAQ item" : "Nieuwe FAQ toevoegen")}
              </h2>
              {editingId && (
                <button 
                  onClick={() => { setEditingId(null); setForm(emptyForm); }}
                  className="text-xs text-text-muted hover:text-red-500 font-medium"
                >
                  {activeTab === "en" ? "Cancel" : "Annuleren"}
                </button>
              )}
            </div>
            
            {editingId && (
              <div className="mb-6 bg-primary-50 border border-primary-100 rounded-xl p-3 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <span className="text-primary-500 font-bold text-[10px] uppercase tracking-widest">
                    {activeTab === "en" ? "Current Category:" : "Huidige Categorie:"}
                  </span>
                  <span className="font-semibold text-primary-900">
                    {activeTab === "en" ? (form.category_en || form.category) : form.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 opacity-50 grayscale hover:grayscale-0 transition-all">
                   <span className="text-[10px] text-primary-400 italic">
                     {activeTab === "en" ? "Pre-filled from your selection" : "Pre-filled vanuit je selectie"}
                   </span>
                </div>
              </div>
            )}
            <div className="mb-6">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                {activeTab === "en" ? "Quick Select Category" : "Snelkeuze Categorie"}
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(items.map((i) => i.category?.trim()))).filter(Boolean).map((cat) => {
                  // Veel robuustere lookup voor de vertaling
                  const catLower = cat.toLowerCase();
                  const itemWithCatEn = items.find(i => 
                    i.category?.trim().toLowerCase() === catLower && 
                    i.category_en?.trim()
                  );
                  const catEn = itemWithCatEn?.category_en || cat;
                  const isTranslated = !!itemWithCatEn;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ 
                        ...form, 
                        category: cat,
                        category_en: isTranslated ? catEn : "" 
                      })}
                      className={`text-xs px-2 py-1 rounded-md border transition-colors flex items-center gap-1.5 ${
                        form.category === cat 
                          ? 'bg-primary-100 border-primary-300 text-primary-900 shadow-sm transition-all scale-105' 
                          : 'bg-secondary-50 border-secondary-200 text-secondary-600 hover:border-secondary-300'
                      }`}
                      title={isTranslated ? `English: ${catEn}` : "Geen Engelse vertaling gevonden"}
                    >
                      {activeTab === "en" ? (isTranslated ? catEn : cat) : cat}
                      {activeTab === "en" && !isTranslated && (
                        <span className="text-[10px] text-amber-500 font-bold">!</span>
                      )}
                      {activeTab === "nl" && isTranslated && (
                        <span className="opacity-40 text-[9px] font-mono">EN</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 border-b border-gray-100 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("nl")}
                className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "nl" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-text-muted hover:text-text-main"
                }`}
              >
                Nederlands 🇳🇱
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "en" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-text-muted hover:text-text-main"
                }`}
              >
                English 🇬🇧
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {activeTab === "nl" ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Vraag (NL)</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-50 focus:border-primary transition-all outline-none"
                      placeholder="Stel hier de vraag in het Nederlands..."
                      value={form.question}
                      onChange={(event) =>
                        setForm({ ...form, question: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Categorie (NL)</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-50 focus:border-primary transition-all outline-none"
                      placeholder="Bijv. Huurovereenkomst..."
                      value={form.category}
                      onChange={(event) =>
                        setForm({ ...form, category: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Antwoord (NL)</label>
                    <RichTextEditor
                      placeholder="Typ hier het antwoord in het Nederlands (Markdown ondersteund)..."
                      value={form.answer}
                      onChange={(value) => setForm({ ...form, answer: value })}
                      minHeight="200px"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Question (EN)</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-50 focus:border-primary transition-all outline-none"
                      placeholder="Enter the question in English..."
                      value={form.question_en}
                      onChange={(event) =>
                        setForm({ ...form, question_en: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Category (EN)</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-50 focus:border-primary transition-all outline-none"
                      placeholder="E.g. Rental Agreement..."
                      value={form.category_en}
                      onChange={(event) =>
                        setForm({ ...form, category_en: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Answer (EN)</label>
                    <RichTextEditor
                      placeholder="Enter the answer in English (Markdown supported)..."
                      value={form.answer_en}
                      onChange={(value) => setForm({ ...form, answer_en: value })}
                      minHeight="200px"
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-50 flex flex-wrap items-end justify-between gap-6">
                <div className="w-32 space-y-1">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {activeTab === "en" ? "Order" : "Volgorde"}
                  </label>
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-50 focus:border-primary transition-all outline-none h-11"
                    type="number"
                    value={form.order_index}
                    onChange={(event) =>
                      setForm({ ...form, order_index: event.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="bg-primary hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 h-11"
                    disabled={loading}
                    type="submit"
                  >
                    {loading
                      ? (activeTab === "en" ? "Saving..." : "Opslaan...")
                      : editingId
                        ? (activeTab === "en" ? "Save Changes" : "Wijzigingen opslaan")
                        : (activeTab === "en" ? "Add FAQ" : "FAQ toevoegen")}
                  </button>
                  {editingId ? (
                    <button
                      className="text-sm font-semibold text-text-muted hover:text-text-main transition-colors px-4 py-2.5"
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                      }}
                    >
                      Annuleren
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">
              {activeTab === "en" ? "Existing items" : "Bestaande items"}
            </h2>
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
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-text-main">
                              {activeTab === "en" ? (item.question_en || item.question) : item.question}
                            </p>
                            {activeTab === "en" && !item.question_en && (
                              <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                                GEEN VERTALING
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-text-muted prose prose-sm max-w-none">
                            <ReactMarkdown>
                              {activeTab === "en" ? (item.answer_en || item.answer) : item.answer}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm flex-shrink-0">
                          <button
                            className="text-primary-600 font-medium hover:text-primary-800 transition-colors"
                            onClick={() => {
                              // Zoek de beste Engelse categorienaam voor deze categorie
                              const catEn = items.find(i => i.category === item.category && i.category_en)?.category_en || item.category_en || "";
                              
                              setEditingId(item.id);
                              setForm({
                                question: item.question,
                                question_en: item.question_en || "",
                                answer: item.answer,
                                answer_en: item.answer_en || "",
                                category: item.category,
                                category_en: catEn || "",
                                order_index: String(item.order_index)
                              });
                              // Scroll naar boven naar het formulier
                              document.getElementById('faq-form')?.scrollIntoView({ behavior: 'smooth' });
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


