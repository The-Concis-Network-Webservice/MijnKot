"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import type { SiteSettings } from "@/types";

const emptySettings: SiteSettings = {
  id: "",
  hero_title: "",
  hero_subtitle: "",
  hero_cta_label: "",
  hero_cta_href: "",
  contact_email: "",
  contact_phone: "",
  contact_address: ""
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  const loadSettings = async () => {
    const res = await fetch("/api/cms/settings");
    const payload = await res.json();
    if (payload.data) {
      setSettings(payload.data);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    setError(null);
    const payload = {
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      hero_cta_label: settings.hero_cta_label,
      hero_cta_href: settings.hero_cta_href,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      contact_address: settings.contact_address
    };
    const res = await fetch("/api/cms/settings", {
      method: settings.id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settings.id ? { id: settings.id, ...payload } : payload)
    });
    const response = await res.json();
    if (!res.ok) {
      setError(response.error ?? "Failed to save settings.");
    } else {
      await loadSettings();
      push("Settings updated.");
    }
    setLoading(false);
  };

  return (
    <AdminGuard>
      <AdminShell>
        <div className="max-w-3xl space-y-6">
          <PageHeader
            title="Site settings"
            description="Control homepage and contact content."
            crumbs={[{ label: "CMS", href: "/admin" }, { label: "Settings" }]}
          />
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Hero title</label>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                value={settings.hero_title}
                onChange={(event) =>
                  setSettings({ ...settings, hero_title: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Hero subtitle</label>
              <textarea
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                rows={3}
                value={settings.hero_subtitle}
                onChange={(event) =>
                  setSettings({ ...settings, hero_subtitle: event.target.value })
                }
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">CTA label</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={settings.hero_cta_label}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      hero_cta_label: event.target.value
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">CTA href</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={settings.hero_cta_href}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      hero_cta_href: event.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Contact email</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={settings.contact_email}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      contact_email: event.target.value
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Contact phone</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={settings.contact_phone}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      contact_phone: event.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Contact address</label>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                value={settings.contact_address}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    contact_address: event.target.value
                  })
                }
              />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
              disabled={loading}
              onClick={saveSettings}
            >
              {loading ? "Saving..." : "Save settings"}
            </button>
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}


