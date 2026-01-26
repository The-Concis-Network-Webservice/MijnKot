export type Vestiging = {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  description: string;
  description_en?: string | null;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type KotStatus = "draft" | "scheduled" | "published" | "archived";

export type Kot = {
  id: string;
  vestiging_id: string;
  title: string;
  title_en?: string | null;
  description: string;
  description_en?: string | null;
  price: number;
  availability_status: string;
  status: KotStatus;
  scheduled_publish_at?: string | null;
  published_at?: string | null;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type KotPhoto = {
  id: string;
  kot_id: string;
  image_url: string;
  order_index: number;
  media_asset_id?: string | null;
};

export type SiteSettings = {
  id: string;
  hero_title: string;
  hero_title_en?: string | null;
  hero_subtitle: string;
  hero_subtitle_en?: string | null;
  hero_cta_label: string;
  hero_cta_label_en?: string | null;
  hero_cta_href: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
};

export type FaqItem = {
  id: string;
  question: string;
  question_en?: string | null;
  answer: string;
  answer_en?: string | null;
  category: string;
  order_index: number;
};

export type UserRole = "super_admin" | "admin" | "editor" | "viewer";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type UserVestiging = {
  id: string;
  user_id: string;
  vestiging_id: string;
};

export type MediaAsset = {
  id: string;
  r2_key: string;
  public_url: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  width?: number | null;
  height?: number | null;
  created_by?: string | null;
  created_at: string;
};

export type AvailabilityHistory = {
  id: string;
  kot_id: string;
  old_status: string;
  new_status: string;
  changed_by?: string | null;
  changed_at: string;
};

export type AuditLog = {
  id: string;
  actor_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, unknown> | null;
  created_at: string;
};

