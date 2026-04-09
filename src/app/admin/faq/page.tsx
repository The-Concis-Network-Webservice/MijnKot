"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import { useTranslation } from "react-i18next";
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
  const { push } = useToast();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

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
    const res = await fetch("/api/cms/faq", {
      method: editingId ? "PATCH" : "POST",
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
      setError(payload.error ?? "Toevoegen van FAQ mislukt.");
    } else {
      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
      push(editingId ? "FAQ item bijgewerkt." : "FAQ item toegevoegd.");
    }
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Dit FAQ item verwijderen?")) return;
    await fetch("/api/cms/faq", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    await loadItems();
    push("FAQ item verwijderd.");
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="max-w-4xl space-y-8">
          <PageHeader
            title={t('admin.view.faq', 'FAQ')}
            description={t('faq.description', 'Beheer veelgestelde vragen.')}
            crumbs={[{ label: "CMS", href: "/admin" }, { label: t('admin.view.faq', 'FAQ') }]}
          />
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">{t('admin.faq.create', 'FAQ item toevoegen')}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-800">Vraag (NL)</label>
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Vraag"
                    value={form.question}
                    onChange={(event) =>
                      setForm({ ...form, question: event.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-primary-800 italic">Question (EN)</label>
                    <button 
                      type="button"
                      onClick={async () => {
                        const res = await fetch('/api/cms/translate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ text: form.question })
                        });
                        const { translated } = await res.json();
                        if (translated) setForm({ ...form, question_en: translated });
                      }}
                      className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                    >
                      Suggest English
                    </button>
                  </div>
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    placeholder="English question"
                    value={form.question_en}
                    onChange={(event) =>
                      setForm({ ...form, question_en: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-800">Antwoord (NL)</label>
                  <textarea
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Antwoord"
                    value={form.answer}
                    onChange={(event) =>
                      setForm({ ...form, answer: event.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-primary-800 italic">Answer (EN)</label>
                    <button 
                      type="button"
                      onClick={async () => {
                        const res = await fetch('/api/cms/translate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ text: form.answer })
                        });
                        const { translated } = await res.json();
                        if (translated) setForm({ ...form, answer_en: translated });
                      }}
                      className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                    >
                      Suggest English
                    </button>
                  </div>
                  <textarea
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    placeholder="English answer"
                    value={form.answer_en}
                    onChange={(event) =>
                      setForm({ ...form, answer_en: event.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-800">{t('admin.common.category', 'Categorie')} (NL)</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="Categorie"
                      value={form.category}
                      onChange={(event) =>
                        setForm({ ...form, category: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-primary-800 italic">Category (EN)</label>
                      <button 
                        type="button"
                        onClick={async () => {
                          const res = await fetch('/api/cms/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: form.category })
                          });
                          const { translated } = await res.json();
                          if (translated) setForm({ ...form, category_en: translated });
                        }}
                        className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                      >
                        Suggest English
                      </button>
                    </div>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                      placeholder="English category"
                      value={form.category_en}
                      onChange={(event) =>
                        setForm({ ...form, category_en: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-800">Volgorde</label>
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Volgorde"
                    type="number"
                    value={form.order_index}
                    onChange={(event) =>
                      setForm({ ...form, order_index: event.target.value })
                    }
                    required
                  />
                </div>
              </div>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex items-center gap-3">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                  disabled={loading}
                  type="submit"
                >
                  {loading
                    ? t('admin.common.saving', 'Opslaan...')
                    : editingId
                      ? t('admin.common.save_changes', 'Wijzigingen opslaan')
                      : t('admin.common.add', 'Toevoegen')}
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
                    Annuleren
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">{t('admin.faq.existing', 'Bestaande items')}</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-primary-900">
                      {locale === 'en' && item.question_en ? item.question_en : item.question}
                    </p>
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">
                      {locale === 'en' && item.answer_en ? item.answer_en : item.answer}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                       <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                        {locale === 'en' && item.category_en ? item.category_en : item.category}
                      </span>
                      {locale === 'en' && (!item.question_en || !item.answer_en) && (
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                          Vertaling ontbreekt
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm shrink-0">
                    <button
                      className="text-primary-600 hover:text-primary-700 font-medium"
                      onClick={() => {
                        setEditingId(item.id);
                        setForm({
                          question: item.question,
                          question_en: item.question_en ?? "",
                          answer: item.answer,
                          answer_en: item.answer_en ?? "",
                          category: item.category,
                          category_en: item.category_en ?? "",
                          order_index: String(item.order_index)
                        });
                      }}
                    >
                      Bewerken
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 font-medium"
                      onClick={() => deleteItem(item.id)}
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 ? (
                <p className="text-sm text-text-muted">
                  Nog geen FAQ items.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}


