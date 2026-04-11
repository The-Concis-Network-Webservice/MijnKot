INSERT INTO vestigingen (id, name, address, city, postal_code, description, description_en, image_url, archived_at, created_at, updated_at)
SELECT lower(hex(randomblob(16))), 'J.P. Minckelersstraat 106', 'J.P. Minckelersstraat 106', city, postal_code, description, description_en, image_url, null, datetime('now'), datetime('now')
FROM vestigingen WHERE name LIKE '%Minckelersstraat%104%';

UPDATE vestigingen 
SET name = 'J.P. Minckelersstraat 104', address = 'J.P. Minckelersstraat 104' 
WHERE name LIKE '%Minckelersstraat%104%' AND name != 'J.P. Minckelersstraat 106';
