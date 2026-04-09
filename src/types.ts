export type Vestiging = {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  description: string;
  description_en?: string | null;
  image_url?: string | null;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type KotStatus = "draft" | "published" | "archived";

export type RentType = {
  id: string;
  name: string;
  name_en?: string | null;
  slug: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Kot = {
  id: string;
  vestiging_id: string;
  title: string;
  title_en?: string | null;
  description: string;
  description_en?: string | null;
  description_raw?: string | null;
  description_polished?: string | null;
  price: number;
  image_url?: string | null;
  availability_status: "available" | "reserved" | "rented" | "hidden";
  status: KotStatus;
  is_highlighted?: boolean | number;
  published_at?: string | null;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
  rent_types?: RentType[];
  rent_type_ids?: string[];
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
  company_name: string;
  company_legal_name: string;
  notice_active?: boolean | number | null;
  notice_text?: string | null;
  popup_active?: boolean | number | null;
  popup_title?: string | null;
  popup_text?: string | null;
  booking_url?: string | null;
  contact_domain?: string | null;
};

export type FaqItem = {
  id: string;
  question: string;
  question_en?: string | null;
  answer: string;
  answer_en?: string | null;
  category: string;
  category_en?: string | null;
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
  updated_at?: string;
};

export type BuildingFloor = {
  id: string;
  vestiging_id: string;
  floor_name: string;
  level: number;
  order_index: number;
  created_at: string;
  rooms?: BuildingRoom[];
};

export type BuildingRoom = {
  id: string;
  floor_id: string;
  kot_id?: string | null;
  room_label: string;
  location?: string | null;
  size_m2?: number | null;
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  availability_status: "available" | "reserved" | "rented" | "hidden";
  created_at: string;
  updated_at: string;
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
  updated_at?: string;
};
