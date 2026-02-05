"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
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
    const res = await fetch("/api/cms/faq", {
      method: editingId ? "PATCH" : "POST",
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
      setError(payload.error ?? "Failed to add FAQ.");
    } else {
      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
      push(editingId ? "FAQ item updated." : "FAQ item added.");
    }
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this FAQ item?")) return;
    await fetch("/api/cms/faq", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    await loadItems();
    push("FAQ item deleted.");
  };

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
              <textarea
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                placeholder="Answer"
                value={form.answer}
                onChange={(event) =>
                  setForm({ ...form, answer: event.target.value })
                }
                rows={4}
                required
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Category"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  required
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
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
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold">{item.question}</p>
                    <p className="text-sm text-text-muted">{item.answer}</p>
                    <span className="text-xs text-text-muted">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <button
                      className="text-primary"
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
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 ? (
                <p className="text-sm text-text-muted">
                  No FAQ items yet.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}


