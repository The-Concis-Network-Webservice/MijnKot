-- Add notice fields to site_settings
ALTER TABLE site_settings ADD COLUMN notice_active INTEGER DEFAULT 0;
ALTER TABLE site_settings ADD COLUMN notice_text TEXT;
