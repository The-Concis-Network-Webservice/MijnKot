-- Migration: Add Rent Types
CREATE TABLE rent_types (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE kot_rent_types (
  kot_id TEXT NOT NULL REFERENCES koten(id) ON DELETE CASCADE,
  rent_type_id TEXT NOT NULL REFERENCES rent_types(id) ON DELETE CASCADE,
  PRIMARY KEY (kot_id, rent_type_id)
);

-- Seed defaults
INSERT INTO rent_types (name, slug, order_index) VALUES ('Academiejaar', 'academiejaar', 1);
INSERT INTO rent_types (name, slug, order_index) VALUES ('Semester', 'semester', 2);
INSERT INTO rent_types (name, slug, order_index) VALUES ('Erasmus', 'erasmus', 3);
