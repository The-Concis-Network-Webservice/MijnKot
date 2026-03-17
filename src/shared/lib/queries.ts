import { query, queryOne } from "./db";
<<<<<<< HEAD
import type { Kot, KotPhoto, SiteSettings, Vestiging, FaqItem } from "@/types";
=======
import type { Kot, KotPhoto, SiteSettings, Vestiging, FaqItem, RentType } from "@/types";
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
import { siteConfig } from "./config";

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await queryOne<SiteSettings>("select * from site_settings limit 1");
  
  const defaults: SiteSettings = {
    id: "",
    hero_title: "Vind jouw perfecte studentenkot",
    hero_subtitle: "Kwalitatieve kamers en studio's in de beste studentensteden van België.",
    hero_cta_label: "Bekijk aanbod",
    hero_cta_href: "/vestigingen",
    contact_email: siteConfig.company.contact.email,
    contact_phone: siteConfig.company.contact.phone,
    contact_address: `${siteConfig.company.address.street}, ${siteConfig.company.address.postalCode} ${siteConfig.company.address.city}`,
    company_name: siteConfig.company.name,
<<<<<<< HEAD
    company_legal_name: siteConfig.company.legalName
=======
    company_legal_name: siteConfig.company.legalName,
    notice_active: false,
    notice_text: "",
    popup_active: false,
    popup_title: "Als eerste op de hoogte?",
    popup_text: "Meld je aan voor onze lijst en ontvang direct een mailtje zodra er nieuwe koten vrijkomen."
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
  };

  if (!settings) return defaults;

  return {
    ...defaults,
    ...settings,
    // Ensure nested fields or specific fields don't stay empty if they exist in DB but are blank
    hero_title: settings.hero_title || defaults.hero_title,
    hero_subtitle: settings.hero_subtitle || defaults.hero_subtitle,
    hero_cta_label: settings.hero_cta_label || defaults.hero_cta_label,
    hero_cta_href: settings.hero_cta_href || defaults.hero_cta_href,
    contact_email: settings.contact_email || defaults.contact_email,
    contact_phone: settings.contact_phone ?? defaults.contact_phone,
    contact_address: settings.contact_address || defaults.contact_address,
    company_name: settings.company_name || defaults.company_name,
<<<<<<< HEAD
    company_legal_name: settings.company_legal_name || defaults.company_legal_name
=======
    company_legal_name: settings.company_legal_name || defaults.company_legal_name,
    notice_active: Boolean(settings.notice_active),
    notice_text: settings.notice_text || defaults.notice_text,
    popup_active: Boolean(settings.popup_active),
    popup_title: settings.popup_title || defaults.popup_title,
    popup_text: settings.popup_text || defaults.popup_text
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
  };
}

export async function getFaqItems() {
  return query<FaqItem>(
    "select * from faq_items order by category asc, order_index asc"
  );
}

export async function getVestigingen() {
  return query<Vestiging>("select * from vestigingen where archived_at is null");
}

export async function getLatestKoten(limit = 6, typeSlug?: string) {
  let innerQuery = "select * from koten where availability_status = 'available' and status = 'published' and archived_at is null";
  const params: any[] = [];

  if (typeSlug) {
    innerQuery = `
      select k.* from koten k
      join kot_rent_types krt on k.id = krt.kot_id
      join rent_types rt on krt.rent_type_id = rt.id
      where k.availability_status = 'available' 
      and k.status = 'published' 
      and k.archived_at is null
      and rt.slug = $1
    `;
    params.push(typeSlug);
  }

  innerQuery += ` order by is_highlighted desc, created_at desc limit $${params.length + 1}`;
  params.push(limit);

  const koten = await query<Kot>(innerQuery, params);
  if (koten.length === 0) return [];
  const ids = koten.map((k) => k.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
  const photos = await query<KotPhoto>(
    `select * from kot_photos where kot_id in (${placeholders})`,
    ids
  );
  const byKot = new Map<string, KotPhoto[]>();
  photos.forEach((photo) => {
    const list = byKot.get(photo.kot_id) ?? [];
    list.push(photo);
    byKot.set(photo.kot_id, list);
  });
  return koten.map((kot) => ({
    ...kot,
    kot_photos: byKot.get(kot.id) ?? []
  })) as Array<Kot & { kot_photos: KotPhoto[] }>;
}

export async function getAllKoten(typeSlug?: string) {
  let innerQuery = "select * from koten where status = 'published' and archived_at is null";
  const params: any[] = [];

  if (typeSlug) {
    innerQuery = `
      select k.* from koten k
      join kot_rent_types krt on k.id = krt.kot_id
      join rent_types rt on krt.rent_type_id = rt.id
      where k.status = 'published' 
      and k.archived_at is null
      and rt.slug = $1
    `;
    params.push(typeSlug);
  }

  innerQuery += " order by is_highlighted desc, created_at desc";
  
  const koten = await query<Kot>(innerQuery, params);
  if (koten.length === 0) return [];
  const ids = koten.map((k) => k.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
  const photos = await query<KotPhoto>(
    `select * from kot_photos where kot_id in (${placeholders})`,
    ids
  );
  const byKot = new Map<string, KotPhoto[]>();
  photos.forEach((photo) => {
    const list = byKot.get(photo.kot_id) ?? [];
    list.push(photo);
    byKot.set(photo.kot_id, list);
  });
  return koten.map((kot) => ({
    ...kot,
    kot_photos: byKot.get(kot.id) ?? []
  })) as Array<Kot & { kot_photos: KotPhoto[] }>;
}

export async function getRentTypes() {
  return query<RentType>("select * from rent_types order by order_index asc");
}
