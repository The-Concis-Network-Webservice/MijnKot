-- Clean up old admin
DELETE FROM user_vestigingen WHERE user_id = (SELECT id FROM users WHERE email = 'admin@example.com');
DELETE FROM users WHERE email = 'admin@example.com';

-- Insert or update new admins with clean hash
-- Hash for 'MijnKot2026!'
-- Part 1: iterations (100000)
-- Part 2: salt (base64)
-- Part 3: hash (base64)

INSERT OR REPLACE INTO users (id, email, full_name, password_hash, role) 
VALUES (lower(hex(randomblob(16))), 'theconcisnetwork@gmail.com', 'The Concis Network', '100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=', 'super_admin');

INSERT OR REPLACE INTO users (id, email, full_name, password_hash, role) 
VALUES (lower(hex(randomblob(16))), 'dominique.noblet@telenet.be', 'Dominique Noblet', '100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=', 'super_admin');

INSERT OR REPLACE INTO users (id, email, full_name, password_hash, role) 
VALUES (lower(hex(randomblob(16))), 'stephane.maniet@gmail.com', 'Stephane Maniet', '100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=', 'super_admin');
