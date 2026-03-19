"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { AdminShell } from "../_components/admin-shell";
import { PageHeader } from "../_components/page-header";
import { useToast } from "../_components/toast";
import type { SiteSettings } from "@/types";
import { siteConfig } from "@/shared/lib/config";

const emptySettings: SiteSettings = {
  id: "",
  hero_title: "",
  hero_subtitle: "",
  hero_cta_label: "",
  hero_cta_href: "",
  contact_email: siteConfig.company.contact.email,
  contact_phone: siteConfig.company.contact.phone,
  contact_address: `${siteConfig.company.address.street}, ${siteConfig.company.address.postalCode} ${siteConfig.company.address.city}`,
  company_name: siteConfig.company.name,
  company_legal_name: siteConfig.company.legalName
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [rentTypes, setRentTypes] = useState<RentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [rentTypesLoading, setRentTypesLoading] = useState(false);
  const [newRentType, setNewRentType] = useState({ name: "", slug: "", order_index: 0 });
  const [activeTab, setActiveTab] = useState<"general" | "categories" | "popups" | "security">("general");
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  const loadSettings = async () => {
    const res = await fetch("/api/cms/settings");
    const payload = await res.json();
    if (payload.data) {
      setSettings(payload.data);
    }
  };

  const loadRentTypes = async () => {
    setRentTypesLoading(true);
    const res = await fetch("/api/cms/rent-types");
    const payload = await res.json();
    setRentTypes(payload.data ?? []);
    setRentTypesLoading(false);
  };

  useEffect(() => {
    loadSettings();
    loadRentTypes();
  }, []);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      push("New passwords do not match.", "error");
      return;
    }
    if (passwordData.new.length < 8) {
      push("Password must be at least 8 characters.", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });
      const data = await res.json();
      if (!res.ok) {
        push(data.error || "Failed to update password.", "error");
      } else {
        push("Password reset successfully.");
        setPasswordData({ current: "", new: "", confirm: "" });
      }
    } catch (err) {
      push("Network error.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const saveSettings = async () => {
// ... existing saveSettings code ...
// I will keep the original implementation but I'm just showing some context in thought.
// I'll actually use the full replacement approach as usual.
    setLoading(true);
    setError(null);
    const payload = {
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      hero_cta_label: settings.hero_cta_label,
      hero_cta_href: settings.hero_cta_href,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      contact_address: settings.contact_address,
      company_name: settings.company_name,
      company_legal_name: settings.company_legal_name
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

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Company Name</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={settings.company_name}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      company_name: event.target.value
                    })
                  }
                  placeholder={siteConfig.company.name}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Legal Company Name</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={settings.company_legal_name}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      company_legal_name: event.target.value
                    })
                  }
                  placeholder={siteConfig.company.legalName}
                />
              </div>
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-8 py-3 rounded-lg font-semibold shadow-md active:scale-95 mt-4"
              disabled={loading}
              onClick={saveSettings}
            >
              Algemeen
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === "categories"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-text-muted hover:text-text-main hover:bg-surface-subtle"
              }`}
            >
              Categorieën
            </button>
            <button
              onClick={() => setActiveTab("popups")}
              className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === "popups"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-text-muted hover:text-text-main hover:bg-surface-subtle"
              }`}
            >
              Popups & Meldingen
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === "security"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-text-muted hover:text-text-main hover:bg-surface-subtle"
              }`}
            >
              Beveiliging
            </button>
          </div>

          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-primary-900 mb-2">Homepagina Content</h3>
                <label className="text-sm font-semibold">Hero title</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  value={settings.hero_title}
                  onChange={(event) =>
                    setSettings({ ...settings, hero_title: event.target.value })
                  }
                />
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

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Company Name</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                      value={settings.company_name}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          company_name: event.target.value
                        })
                      }
                      placeholder={siteConfig.company.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Legal Company Name</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                      value={settings.company_legal_name}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          company_legal_name: event.target.value
                        })
                      }
                      placeholder={siteConfig.company.legalName}
                    />
                  </div>
                </div>
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <button
                  className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-8 py-3 rounded-lg font-semibold shadow-md active:scale-95 mt-4"
                  disabled={loading}
                  onClick={saveSettings}
                >
                  {loading ? "Saving..." : "Save settings"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "popups" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary-900">Website Melding (Top Bar)</h3>
                    <p className="text-sm text-primary-600">Toon een belangrijke mededeling bovenaan elke pagina.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.notice_active}
                      onChange={(e) => setSettings({ ...settings, notice_active: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className={`space-y-4 transition-all duration-300 ${!settings.notice_active ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-800">Bericht tekst</label>
                    <textarea
                      placeholder="Bijv: Opgelet: nog maar enkele kamers beschikbaar voor academiejaar 2024-2025!"
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                      rows={2}
                      value={settings.notice_text}
                      onChange={(e) => setSettings({ ...settings, notice_text: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary-900">Nieuwsbrief Popup (Lead Capture)</h3>
                    <p className="text-sm text-primary-600">De popup die vraagt om emailadres voor nieuwe koten.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.popup_active}
                      onChange={(e) => setSettings({ ...settings, popup_active: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className={`space-y-4 transition-all duration-300 ${!settings.popup_active ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-800">Popup Titel</label>
                    <input
                      placeholder="Bijv: Als eerste op de hoogte?"
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                      value={settings.popup_title}
                      onChange={(e) => setSettings({ ...settings, popup_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-800">Popup Omschrijving</label>
                    <textarea
                      placeholder="Bijv: Meld je aan voor onze lijst en ontvang direct een mailtje..."
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                      rows={3}
                      value={settings.popup_text}
                      onChange={(e) => setSettings({ ...settings, popup_text: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <button
                className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-8 py-3 rounded-lg font-semibold shadow-md active:scale-95 w-full md:w-auto"
                disabled={loading}
                onClick={saveSettings}
              >
                {loading ? "Saving..." : "Save popups"}
              </button>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="bg-white border border-border-light rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-text-main">Rent Types (Filters)</h2>
              <p className="text-sm text-text-muted">Manage the categories shown in the 'Te Huur' navigation menu.</p>
              
              <div className="space-y-4">
                {rentTypes.map((rt) => (
                  <div key={rt.id} className="flex flex-col md:flex-row gap-4 p-4 border border-border-light rounded-xl bg-surface-subtle">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold uppercase text-text-muted">Name (NL)</label>
                      <input
                        className="w-full border border-border-light rounded-lg px-3 py-2 text-sm"
                        value={rt.name}
                        onChange={(e) => {
                          const updated = rentTypes.map(item => item.id === rt.id ? { ...item, name: e.target.value } : item);
                          setRentTypes(updated);
                        }}
                        onBlur={() => updateRentType(rt)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold uppercase text-text-muted">Slug (URL)</label>
                      <input
                        className="w-full border border-border-light rounded-lg px-3 py-2 text-sm"
                        value={rt.slug}
                        onChange={(e) => {
                          const updated = rentTypes.map(item => item.id === rt.id ? { ...item, slug: e.target.value } : item);
                          setRentTypes(updated);
                        }}
                        onBlur={() => updateRentType(rt)}
                      />
                    </div>
                    <div className="w-20 space-y-2">
                      <label className="text-xs font-bold uppercase text-text-muted">Order</label>
                      <input
                        type="number"
                        className="w-full border border-border-light rounded-lg px-3 py-2 text-sm"
                        value={rt.order_index}
                        onChange={(e) => {
                          const updated = rentTypes.map(item => item.id === rt.id ? { ...item, order_index: parseInt(e.target.value) || 0 } : item);
                          setRentTypes(updated);
                        }}
                        onBlur={() => updateRentType(rt)}
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <button
                        onClick={() => deleteRentType(rt.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-4 border-2 border-dashed border-border-light rounded-xl space-y-4 bg-white">
                  <h3 className="text-sm font-bold uppercase text-text-muted">Add New Category</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      className="flex-1 border border-border-light rounded-lg px-3 py-2 text-sm"
                      placeholder="Name (e.g. Zomercursus)"
                      value={newRentType.name}
                      onChange={(e) => setNewRentType({ ...newRentType, name: e.target.value })}
                    />
                    <input
                      className="flex-1 border border-border-light rounded-lg px-3 py-2 text-sm"
                      placeholder="Slug (e.g. zomercursus)"
                      value={newRentType.slug}
                      onChange={(e) => setNewRentType({ ...newRentType, slug: e.target.value })}
                    />
                    <button
                      disabled={rentTypesLoading || !newRentType.name || !newRentType.slug}
                      onClick={addRentType}
                      className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-primary-900 border-b border-gray-100 pb-4">
                Account Beveiliging
              </h2>
              <p className="text-sm text-primary-600">
                Wijzig je wachtwoord om je account veilig te houden.
              </p>

              <form onSubmit={changePassword} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-800">Huidig Wachtwoord</label>
                  <input
                    type="password"
                    required
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-50">
                  <label className="text-sm font-semibold text-primary-800">Nieuw Wachtwoord</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  />
                  <p className="text-[10px] text-text-muted italic">Minimaal 8 tekens.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-800">Bevestig Nieuw Wachtwoord</label>
                  <input
                    type="password"
                    required
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary-500 outline-none"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-8 py-3 rounded-lg font-semibold shadow-md active:scale-95 disabled:opacity-50 mt-4"
                >
                  {passwordLoading ? "Bezig met bijwerken..." : "Wachtwoord Bijwerken"}
                </button>
              </form>
            </div>
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );

}


