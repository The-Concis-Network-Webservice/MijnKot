-- Add missing columns to koten table
ALTER TABLE koten ADD COLUMN is_highlighted INTEGER DEFAULT 0;
ALTER TABLE koten ADD COLUMN description_raw TEXT;
ALTER TABLE koten ADD COLUMN description_polished TEXT;
