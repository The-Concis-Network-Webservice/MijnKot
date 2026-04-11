INSERT INTO vestigingen (id, name, address, city, postal_code, description, description_en, image_url, archived_at, created_at, updated_at)
SELECT lower(hex(randomblob(16))), 'Dreefstraat 106', 'Dreefstraat 106', city, postal_code, description, description_en, image_url, null, datetime('now'), datetime('now')
FROM vestigingen WHERE name LIKE '%Dreefstraat 104%';

INSERT INTO vestigingen (id, name, address, city, postal_code, description, description_en, image_url, archived_at, created_at, updated_at)
SELECT lower(hex(randomblob(16))), 'Minkelerstraat 106', 'Minkelerstraat 106', city, postal_code, description, description_en, image_url, null, datetime('now'), datetime('now')
FROM vestigingen WHERE name LIKE '%Minkelerstraat%';

UPDATE vestigingen 
SET name = 'Minkelerstraat 104', address = 'Minkelerstraat 104' 
WHERE name LIKE '%Minkelerstraat%' AND name != 'Minkelerstraat 106';
