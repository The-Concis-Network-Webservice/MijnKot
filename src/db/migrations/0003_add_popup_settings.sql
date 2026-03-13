-- Add lead capture popup fields to site_settings
ALTER TABLE site_settings ADD COLUMN popup_active INTEGER DEFAULT 0;
ALTER TABLE site_settings ADD COLUMN popup_title TEXT;
ALTER TABLE site_settings ADD COLUMN popup_text TEXT;
