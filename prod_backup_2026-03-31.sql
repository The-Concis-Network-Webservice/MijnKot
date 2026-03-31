PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE test (id text primary key);
CREATE TABLE users (
  id text primary key default (lower(hex(randomblob(16)))),
  email text unique not null,
  full_name text,
  password_hash text not null,
  role text not null check (role in ('super_admin','admin','editor','viewer')) default 'viewer',
  created_at text not null default (datetime('now'))
);
INSERT INTO "users" ("id","email","full_name","password_hash","role","created_at") VALUES('e5b2777ae3e9e78f38ba07d59edc2e2f','theconcisnetwork@gmail.com','The Concis Network','100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=','super_admin','2026-03-16 13:35:28');
INSERT INTO "users" ("id","email","full_name","password_hash","role","created_at") VALUES('5f450acf7930d87cd7390b8e6b374fbe','dominique.noblet@telenet.be','Dominique Noblet','100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=','super_admin','2026-03-16 13:35:28');
INSERT INTO "users" ("id","email","full_name","password_hash","role","created_at") VALUES('045b4acf2529aadcc1482613242564b9','stephane.maniet@gmail.com','Stephane Maniet','100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=','super_admin','2026-03-16 13:35:28');
CREATE TABLE vestigingen (
  id text primary key default (lower(hex(randomblob(16)))),
  name text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  description text not null,
  description_en text,
  archived_at text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
, image_url TEXT);
INSERT INTO "vestigingen" ("id","name","address","city","postal_code","description","description_en","archived_at","created_at","updated_at","image_url") VALUES('ce3bd461f11895258095c5494c23b588','Naamsestraat 29A','Naamsestraat 29A','Leuven','3000',replace('Dit gebouw biedt unieke studentenkamers in het hart van Leuven. Je woont hier op een toplocatie, op wandelafstand van de universiteit, winkels en het bruisende stadsleven.\n\nHet gebouw beschikt over een gezellige centrale buitenruimte met vijf aparte ingangen die elk toegang geven tot verschillende kamers. Daarnaast is er een recent vernieuwde gemeenschappelijke keuken met televisie, ideaal om samen te koken en te ontspannen.\n\nEr is bovendien een veilige en afgesloten fietsenstalling voorzien.\n\nComfort in elke kamer\n\nAlle kamers zijn uitgerust met:\n\nDubbele beglazing\n\nKotnet (internetverbinding)\n\nParlofoon\n\nAansluitmogelijkheid voor kabeltelevisie\n\nWarm en koud water\n\nDe douches en toiletten zijn gemeenschappelijk en worden netjes onderhouden.','\n',char(10)),replace('Located in the heart of Leuven, Naamsestraat 29A offers unique student rooms in a prime location — within walking distance of the university, shops, and the vibrant city centre.\n\nThe building features a cosy central outdoor area with five separate entrances, each leading to different rooms. There is also a recently renovated communal kitchen with television, ideal for cooking together and relaxing.\n\nA secure, enclosed bicycle storage is also available.\n\nComfort in every room\n\nAll rooms are equipped with:\n\nDouble glazing\n\nKotnet (internet connection)\n\nVideo intercom\n\nCable television connection\n\nHot and cold water\n\nThe shared showers and toilets are communally maintained and kept clean.','\n',char(10)),NULL,'2026-02-23 09:55:31','2026-03-23 11:50:48',NULL);
INSERT INTO "vestigingen" ("id","name","address","city","postal_code","description","description_en","archived_at","created_at","updated_at","image_url") VALUES('d51d0e166e3387f845dd7ae64b1490c5','J.P. Minckelersstraat 79','J.P. Minckelersstraat 79','Leuven','3000',replace('Gelegen op een ideale locatie vlak bij het centrum van Leuven, biedt J.P. Minckelersstraat 79 een gevarieerd aanbod aan studentenkamers voor elke woonwens en elk budget.\n\nJe kan kiezen uit twee types:\n\nStandaard studentenkamer met gedeeld sanitair — betaalbaar en gezellig\n\nStudio met privébadkamer — meer privacy en comfort\n\nDe residentie combineert een centrale ligging met een rustige woonomgeving, op wandelafstand van de universiteit, winkels en openbaar vervoer.\n\nSfeer & voorzieningen\n\nVeilige en afgesloten fietsenstalling\n\nGemeenschappelijke ruimtes netjes onderhouden\n\nVlakbij openbaar vervoer','\n',char(10)),replace('Ideally located close to the centre of Leuven, J.P. Minckelersstraat 79 offers a varied range of student rooms to suit every lifestyle and budget.\n\nYou can choose from two types:\n\nStandard student room with shared bathroom — affordable and sociable\n\nStudio with private bathroom — more privacy and comfort\n\nThe residence combines a central location with a quiet living environment, within walking distance of the university, shops, and public transport.\n\nFacilities & amenities\n\nSecure, enclosed bicycle storage\n\nCommunal areas kept clean and well-maintained\n\nClose to public transport','\n',char(10)),NULL,'2026-02-23 10:00:25','2026-03-23 11:50:48',NULL);
INSERT INTO "vestigingen" ("id","name","address","city","postal_code","description","description_en","archived_at","created_at","updated_at","image_url") VALUES('637f58e754b17199ea92ac04c79e74da','Dreefstraat 104','Dreefstraat 104',' Heverlee','3001',replace('Dreefstraat 104 in Heverlee biedt nieuwe, moderne en volledig gemeubelde studentenkamers — klaar om in te trekken. De residentie is rustig gelegen, vlakbij de campus en op een vlotte afstand van het bruisende centrum van Leuven.\n\nBeschikbare oppervlaktes\n\n12 m²\n\n14 m²\n\n17 m²\n\n18 m²\n\n21 m²\n\n35 m²\n\nZo vind je altijd een kamer die perfect aansluit bij jouw wensen en budget.\n\nGemeenschappelijke voorzieningen\n\nRuime gemeenschappelijke keuken volledig uitgerust\n\nGezellige living met televisie\n\nVeilige fietsenstalling\n\nAlle kamers zijn modern ingericht en instapklaar.','\n',char(10)),replace('Dreefstraat 104 in Heverlee offers new, modern, and fully furnished student rooms — ready to move in. The residence is quietly situated, close to the campus and within easy reach of the lively centre of Leuven.\n\nAvailable sizes\n\n12 m²\n\n14 m²\n\n17 m²\n\n18 m²\n\n21 m²\n\n35 m²\n\nThere is always a room that perfectly matches your needs and budget.\n\nCommunal facilities\n\nFully equipped communal kitchen\n\nCosy living room with television\n\nSecure bicycle storage\n\nAll rooms are modern and move-in ready.','\n',char(10)),NULL,'2026-02-23 10:05:34','2026-03-23 11:50:48',NULL);
INSERT INTO "vestigingen" ("id","name","address","city","postal_code","description","description_en","archived_at","created_at","updated_at","image_url") VALUES('04cb31a0552a92bec75648fe4f2a2e32','J.P. Minckelersstraat 104 – 106','J.P. Minckelersstraat 104 – 106','Leuven','3000',replace('J.P. Minckelersstraat 104–106 is één van de meest complete studentenresidenties van Mijn-Kot. Het gebouw biedt een breed gamma aan kamerformats, van compacte kamers tot ruime studio''s en duplexen — allemaal modern ingericht en volledig gemeubeld.\n\nDuplexkamers met privé-sanitair\n\nRuime, lichte duplexkamers in oppervlaktes van 14 m², 16 m², 17 m², 20 m², 21 m², 25 m² en 30 m². Ideaal voor wie privacy en comfort combineert met gedeelde voorzieningen.\n\nDubbele kamers\n\nVolledig van elkaar gescheiden, elk met eigen sanitair. Geschikt voor twee personen of voor wie extra ruimte wenst.\n\nRuime kamers & studio''s\n\nOppervlaktes van 21 m² tot 40 m², met toegang tot een gemeenschappelijke tuin — perfect om te ontspannen tussen de studiesessies door.\n\nGemeenschappelijke voorzieningen\n\nGemeenschappelijke keuken en gezellige living met televisie\n\nAangelegde tuin voor alle bewoners\n\nVeilige fietsenstalling','\n',char(10)),replace('J.P. Minckelersstraat 104–106 is one of the most complete student residences in the Mijn-Kot portfolio. The building offers a wide range of room formats — from compact rooms to spacious studios and duplexes — all modern and fully furnished.\n\nDuplex rooms with private bathroom\n\nBright and spacious duplexes available in 14 m², 16 m², 17 m², 20 m², 21 m², 25 m² and 30 m². Perfect for those who value privacy and comfort alongside shared facilities.\n\nDouble rooms\n\nFully separated from each other, each with private bathroom. Suitable for two people or for those who want extra space.\n\nSpacious rooms & studios\n\nSizes from 21 m² to 40 m², with access to a communal garden — ideal for relaxing between study sessions.\n\nCommunal facilities\n\nCommunal kitchen and cosy living room with television\n\nGarden accessible to all residents\n\nSecure bicycle storage','\n',char(10)),NULL,'2026-02-23 10:07:57','2026-03-23 11:50:48',NULL);
INSERT INTO "vestigingen" ("id","name","address","city","postal_code","description","description_en","archived_at","created_at","updated_at","image_url") VALUES('7a7a5111ca6df59a6c5d29e4ff25d022','test','test','test','test','est',NULL,NULL,'2026-02-23 12:30:13','2026-02-23 12:30:13','');
CREATE TABLE user_vestigingen (
  id text primary key default (lower(hex(randomblob(16)))),
  user_id text not null references users(id) on delete cascade,
  vestiging_id text not null references vestigingen(id) on delete cascade,
  created_at text not null default (datetime('now')),
  unique (user_id, vestiging_id)
);
CREATE TABLE koten (
  id text primary key default (lower(hex(randomblob(16)))),
  vestiging_id text not null references vestigingen(id) on delete cascade,
  title text not null,
  title_en text,
  description text not null,
  description_en text,
  price real not null,
  availability_status text not null default 'available',
  status text not null check (status in ('draft','scheduled','published','archived')) default 'draft',
  scheduled_publish_at text,
  published_at text,
  archived_at text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
, is_highlighted INTEGER DEFAULT 0, description_raw TEXT, description_polished TEXT);
INSERT INTO "koten" ("id","vestiging_id","title","title_en","description","description_en","price","availability_status","status","scheduled_publish_at","published_at","archived_at","created_at","updated_at","is_highlighted","description_raw","description_polished") VALUES('41498ecb706a50b787750f9f4705b203','ce3bd461f11895258095c5494c23b588','test',NULL,'test maak een test text om dit te testen lololololololololol',NULL,500,'available','published','2026-02-23T11:00:00.000Z',NULL,NULL,'2026-02-23 10:16:18','2026-02-23 11:38:31',1,'test maak een test text om dit te testen lololololololololol','');
INSERT INTO "koten" ("id","vestiging_id","title","title_en","description","description_en","price","availability_status","status","scheduled_publish_at","published_at","archived_at","created_at","updated_at","is_highlighted","description_raw","description_polished") VALUES('63ed6ca6158eb4dacdfd0f6c7008221a','d51d0e166e3387f845dd7ae64b1490c5','Test Minck',NULL,'Test Minck',NULL,200,'reserved','draft','2026-02-23T11:00:00.000Z',NULL,NULL,'2026-02-23 10:28:42','2026-02-23 10:29:35',0,NULL,NULL);
INSERT INTO "koten" ("id","vestiging_id","title","title_en","description","description_en","price","availability_status","status","scheduled_publish_at","published_at","archived_at","created_at","updated_at","is_highlighted","description_raw","description_polished") VALUES('1b34219126b86ca82237514462c6e8d0','04cb31a0552a92bec75648fe4f2a2e32','Test 2',NULL,'Test 2',NULL,3333,'available','published','2026-02-23T11:00:00.000Z',NULL,NULL,'2026-02-23 13:27:57','2026-02-23 13:27:57',0,NULL,NULL);
CREATE TABLE media_assets (
  id text primary key default (lower(hex(randomblob(16)))),
  r2_key text not null,
  public_url text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes integer not null,
  width integer,
  height integer,
  created_by text references users(id) on delete set null,
  created_at text not null default (datetime('now'))
);
CREATE TABLE kot_photos (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete cascade,
  image_url text not null,
  order_index integer not null default 0,
  media_asset_id text references media_assets(id) on delete set null
);
CREATE TABLE site_settings (
  id text primary key default (lower(hex(randomblob(16)))),
  hero_title text not null,
  hero_title_en text,
  hero_subtitle text not null,
  hero_subtitle_en text,
  hero_cta_label text not null,
  hero_cta_label_en text,
  hero_cta_href text not null,
  contact_email text not null,
  contact_phone text not null,
  contact_address text not null
, company_name TEXT, company_legal_name TEXT, notice_active INTEGER DEFAULT 0, notice_text TEXT, popup_active INTEGER DEFAULT 0, popup_title TEXT, popup_text TEXT, booking_url TEXT);
INSERT INTO "site_settings" ("id","hero_title","hero_title_en","hero_subtitle","hero_subtitle_en","hero_cta_label","hero_cta_label_en","hero_cta_href","contact_email","contact_phone","contact_address","company_name","company_legal_name","notice_active","notice_text","popup_active","popup_title","popup_text","booking_url") VALUES('7cdc9728-1dfe-44b2-a51f-187614eca186','Vind een studentenkot dat voelt als thuis','Find a student room that feels like home','Wij selecteren kwalitatieve koten in heel België met transparante prijzen, geverifieerde verhuurders en locaties dicht bij het campusleven.','We curate high-quality koten across Belgium with transparent pricing, verified landlords, and locations that keep you close to campus life.','Bekijk vestigingen','Explore locations','/vestigingen','dominique@mijn-kot.be','','Naamsestraat 29A, 3000 Leuven',NULL,'Mijn-Kot',0,NULL,0,NULL,NULL,NULL);
CREATE TABLE faq_items (
  id text primary key default (lower(hex(randomblob(16)))),
  question text not null,
  question_en text,
  answer text not null,
  answer_en text,
  category text not null,
  order_index integer not null default 0
);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('21e60dc93ff28a8a3eb851c5dfa45b08','Ik heb een kamer gehuurd, krijg ik de contactgegevens van de huidige huurder?','I have rented a room, do I get the contact details of the current tenant?','Wij geven geen contactgegevens van onze huurders omwille van de privacy door. Wij kunnen wel je boodschap doorsturen. Het staat de huidige bewoner vrij om hierop te reageren.','We do not share contact details of our tenants for privacy reasons. We can, however, forward your message. The current resident is free to respond to it.','Huurovereenkomst',2);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('a1c67780110398bbbcefd4830c2e2c8f','Ik huur nu al een kamer bij jullie maar zou volgend jaar graag een andere willen huren.','I already rent a room from you but would like to rent a different one next year.','Interne wissels zijn uiteraard perfect mogelijk. Contacteer ons voor een bezoek van een andere kamer! Je kan hiervoor makkelijk en snel online een afspraak boeken.','Internal swaps are perfectly possible. Contact us for a visit to another room! You can easily and quickly book an appointment online for this.','Huurovereenkomst',3);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('3e48122a2f78f647f120ec8b1245a153','Krijg ik mijn waarborg terug na afloop van het contract?','Do I get my deposit back after the contract ends?','Indien je kamer in orde is en volledig gepoetst, zal deze uiteraard worden terugbetaald door ons. Je mag niets achterlaten. We kunnen dit enkel via overschrijving doen en dus niet cash.','If your room is in order and completely cleaned, it will naturally be refunded by us. You must not leave anything behind. We can only do this via bank transfer and not in cash.','Waarborg',4);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('ca5ca98514096cd845c5c962f4610e73','Wat zijn de afmetingen van de matras?','What are the dimensions of the mattress?','Deze bedragen 90cm x 200cm.','These are 90cm x 200cm.','Faciliteiten',5);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('76f6547803a17ab2d5e7c003c8674015','Ik studeer niet aan de KUL, kan ik dan wel op internet?','I am not a student at the KUL, can I still access the internet?','Ja dit is geen probleem, wij bieden Telenet internet aan.','Yes, this is no problem, we provide Telenet internet.','Internet',6);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('f1bfcafe33d0542e87b98f12950b6612','Ik zou graag een grotere bureau of bed plaatsen. Halen jullie mijn oud bed weg?','I would like to place a larger desk or bed. Do you take away my old bed?','Neen, als huurder ben je zelf verantwoordelijk voor alles wat er in je kamer staat. Indien je een ander bed wil plaatsen kan dit, maar dan moet je zelf het originele bed weghalen. Zorg er natuurlijk wel voor dat de originele meubels er op het einde van je contract weer staan.','No, as a tenant you are responsible for everything in your room. If you want to place another bed, this is possible, but you must remove the original bed yourself. Make sure, of course, that the original furniture is back in place at the end of your contract.','Faciliteiten',7);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('e56f514c6d9803845b2904ce78aa842d','Hoe werkt mijn internet?','How does my internet work?',replace(replace('Wij gebruiken Telenet Fiber 200 waardoor je zeer snel kan surfen.\r\n\r\nOm gebruik te kunnen maken van het internet is het volgende nodig: Een UTP-kabel die je in de muur en in je pc moet steken. Deze kabel vind je in elke elektrozaak. Routers verstoren het internet en zijn niet toegestaan.\r\n\r\nOndervind je toch nog problemen, neem dan contact op met Telenet.','\r',char(13)),'\n',char(10)),replace(replace('We use Telenet Fiber 200, which allows for very fast surfing.\r\n\r\nTo use the internet, the following is required: An ethernet cable that you need to plug into the wall and into your PC. You can find this cable in any electronics store. Routers interfere with the internet and are not permitted.\r\n\r\nIf you still experience problems, please contact Telenet.','\r',char(13)),'\n',char(10)),'Internet',8);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('1c58255cfffab66b83297ff8b733e7ec','Wanneer kan ik ten vroegste op mijn kamer?','When is the earliest I can move into my room?','Huidige huurder heeft een contract tot 14/09. Van zodra wij de sleutels hebben ontvangen van de huidige huurder berichten wij u en dit ten laatste op 14/09. indien dit eerder gebeurt wordt u ook eerder gecontacteerd voor een eventuele afspraak om de sleutels te komen halen de sleutels kunnen ook per post worden opgestuurd en kan u ook eerder binnentreden.','The current tenant has a contract until 14/09. As soon as we have received the keys from the current tenant, we will notify you, at the latest by 14/09. If this happens earlier, you will also be contacted earlier for a possible appointment to pick up the keys. The keys can also be sent by post, allowing you to enter earlier.','Huurovereenkomst',9);
INSERT INTO "faq_items" ("id","question","question_en","answer","answer_en","category","order_index") VALUES('416a00e763692d234b57730c50afcc16','Mag ik een eigen koelkast en/of microgolfoven op mijn kamer installeren?','Can I install my own refrigerator and/or microwave in my room?','Ja, je betaalt hier geen extra huur voor.','Yes, you do not pay any extra rent for this.','Faciliteiten',10);
CREATE TABLE availability_history (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete cascade,
  old_status text not null,
  new_status text not null,
  changed_by text references users(id) on delete set null,
  changed_at text not null default (datetime('now'))
);
CREATE TABLE audit_logs (
  id text primary key default (lower(hex(randomblob(16)))),
  actor_id text references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  changes text,
  created_at text not null default (datetime('now'))
);
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('4b90f4b71530a6551c7b23047b3a8362',NULL,'publish','koten','1941ff1a-d025-4c5e-9436-8760cdf36a07',NULL,'2026-02-02 14:08:13');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('55516a74165be9dfbed0105796e71e25',NULL,'publish','koten','7bf482f6-eb67-4626-8def-2d7952d747a5',NULL,'2026-02-02 17:14:51');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('86173b97bde14fae2d336fa62c3386c1',NULL,'publish','koten','196329a4-57ba-4a78-8c35-570cf58b7cbf',NULL,'2026-02-02 17:16:25');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('cbc04eeec35e9c3c562a68537de88bd6',NULL,'publish','koten','196329a4-57ba-4a78-8c35-570cf58b7cbf',NULL,'2026-02-02 17:16:36');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('8bed0205151bcd2ea0f4b3c538535524',NULL,'update','koten','196329a4-57ba-4a78-8c35-570cf58b7cbf','{"id":"196329a4-57ba-4a78-8c35-570cf58b7cbf","vestiging_id":"55942650-5896-43d0-b27a-3f44aae352dc","title":"Zonnige Studio 1","title_en":null,"description":"Zonnige studio met grote ramen, eigen badkamer en compacte kitchenette. \nDeze studio biedt onder andere:\n* Grote ramen voor veel lichtinval\n* Een eigen badkamer voor optimaal comfort\n* Een compacte kitchenette voor basisvoorzieningen\nNeem contact op voor meer informatie over deze studio.","description_en":null,"price":395,"availability_status":"available","status":"published","scheduled_publish_at":null,"published_at":"2026-02-02 17:16:36","archived_at":null,"created_at":"2026-01-26 12:25:25","updated_at":"2026-02-02 17:19:31","is_highlighted":1,"description_raw":"Zonnige studio met grote ramen, eigen badkamer en compacte kitchenette. \nDeze studio biedt onder andere:\n* Grote ramen voor veel lichtinval\n* Een eigen badkamer voor optimaal comfort\n* Een compacte kitchenette voor basisvoorzieningen\nNeem contact op voor meer informatie over deze studio.","description_polished":"Zonnige studio met grote ramen, eigen badkamer en compacte kitchenette. \nDeze studio biedt onder andere:\n* Grote ramen voor veel lichtinval\n* Een eigen badkamer voor optimaal comfort\n* Een compacte kitchenette voor basisvoorzieningen\nNeem contact op voor meer informatie over deze studio."}','2026-02-02 17:19:31');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('c0afec26abffbe830db234c010c36fb0',NULL,'publish','koten','196329a4-57ba-4a78-8c35-570cf58b7cbf',NULL,'2026-02-02 17:19:31');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('2acb074f639ab8ab3f6d861de92469fb',NULL,'update','vestigingen','55942650-5896-43d0-b27a-3f44aae352dc','{"id":"55942650-5896-43d0-b27a-3f44aae352dc","name":"Leuven Center","address":"Naamsestraat 10","city":"Leuven","postal_code":"3000","description":"Gelegen in het hart van Leuven, op wandelafstand van KU Leuven, bibliotheken en gezellige studentenpleinen.","description_en":"Located in the heart of Leuven, walking distance from KU Leuven, libraries, and cozy student squares.","archived_at":null,"created_at":"2026-01-26 12:25:25","updated_at":"2026-02-21 10:47:57"}','2026-02-21 10:47:57');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('207d4b1873319b5391e9cbbf5fed7b6a',NULL,'update','site_settings','3e7351cd-f41f-47c3-9ae1-8da03a8bea88','{"id":"3e7351cd-f41f-47c3-9ae1-8da03a8bea88","hero_title":"Vind jouw ideale kot in Leuven & Heverlee","hero_title_en":"Find a student room that feels like home","hero_subtitle":"Ontdek comfortabele studentenkamers, studio’s en duplexkamers op toplocaties. Comfortabel wonen, veilig en zorgeloos – dichtbij campus en voorzieningen.","hero_subtitle_en":"We curate high-quality koten across Belgium with transparent pricing, verified landlords, and locations that keep you close to campus life.","hero_cta_label":"Bekijk vestigingen","hero_cta_label_en":"Explore locations","hero_cta_href":"/vestigingen","contact_email":"hello@mijn-kot.be","contact_phone":"+32 2 555 1234","contact_address":"Wetstraat 88, 1040 Brussel"}','2026-02-23 09:18:10');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('42ada0c951a08124bd76ba1c0d177b85',NULL,'update','site_settings','3e7351cd-f41f-47c3-9ae1-8da03a8bea88','{"id":"3e7351cd-f41f-47c3-9ae1-8da03a8bea88","hero_title":"Vind jouw ideale kot in Leuven","hero_title_en":"Find a student room that feels like home","hero_subtitle":"Ontdek comfortabele studentenkamers, studio’s en duplexkamers op toplocaties. Comfortabel wonen, veilig en zorgeloos – dichtbij campus en voorzieningen.","hero_subtitle_en":"We curate high-quality koten across Belgium with transparent pricing, verified landlords, and locations that keep you close to campus life.","hero_cta_label":"Bekijk vestigingen","hero_cta_label_en":"Explore locations","hero_cta_href":"/vestigingen","contact_email":"hello@mijn-kot.be","contact_phone":"+32 2 555 1234","contact_address":"Wetstraat 88, 1040 Brussel"}','2026-02-23 09:19:21');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('30d1c16e735566fa15a593ac038c10e9',NULL,'update','site_settings','3e7351cd-f41f-47c3-9ae1-8da03a8bea88','{"id":"3e7351cd-f41f-47c3-9ae1-8da03a8bea88","hero_title":"Vind jouw ideale kot in Leuven","hero_title_en":"Find a student room that feels like home","hero_subtitle":"Ontdek comfortabele studentenkamers, studio’s en duplexkamers op toplocaties. Comfortabel wonen, veilig en zorgeloos – dichtbij campus en voorzieningen.","hero_subtitle_en":"We curate high-quality koten across Belgium with transparent pricing, verified landlords, and locations that keep you close to campus life.","hero_cta_label":"Bekijk vestigingen","hero_cta_label_en":"Explore locations","hero_cta_href":"/vestigingen","contact_email":"dominique@mijn-kot.be","contact_phone":"+32 2 555 1234","contact_address":"Wetstraat 88, 1040 Brussel"}','2026-02-23 09:20:21');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('1fcbaac44cf50969e20177d9bd111229',NULL,'update','site_settings','3e7351cd-f41f-47c3-9ae1-8da03a8bea88','{"id":"3e7351cd-f41f-47c3-9ae1-8da03a8bea88","hero_title":"Vind jouw ideale kot in Leuven","hero_title_en":"Find a student room that feels like home","hero_subtitle":"Ontdek comfortabele studentenkamers, studio’s en duplexkamers op toplocaties. Comfortabel wonen, veilig en zorgeloos – dichtbij campus en voorzieningen.","hero_subtitle_en":"We curate high-quality koten across Belgium with transparent pricing, verified landlords, and locations that keep you close to campus life.","hero_cta_label":"Bekijk vestigingen","hero_cta_label_en":"Explore locations","hero_cta_href":"/vestigingen","contact_email":"dominique@mijn-kot.be","contact_phone":"+32 486 59 82 70","contact_address":"Naamsestraat 29, 3000 Leuven"}','2026-02-23 09:26:12');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('ff86c5665dd57cec24a788d065c0784f',NULL,'delete','faq_items','51823579-1f5b-42e2-8bf4-7f29571c8dce',NULL,'2026-02-24 08:59:06');
INSERT INTO "audit_logs" ("id","actor_id","action","entity_type","entity_id","changes","created_at") VALUES('dd3096faa11367c8e22e0436556326d2',NULL,'delete','faq_items','49a87b8f-8d5f-4666-b090-302de5383fae',NULL,'2026-02-24 08:59:11');
CREATE TABLE leads (
  id text primary key default (lower(hex(randomblob(16)))),
  email text not null,
  name text,
  source text default 'modal',
  created_at text not null default (datetime('now'))
);
CREATE TABLE contract_templates (
  id text primary key default (lower(hex(randomblob(16)))),
  name text not null,
  content text not null,
  is_default boolean default false,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);
CREATE TABLE contracts (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete restrict,
  template_id text references contract_templates(id),
  status text not null check (status in ('draft','pending_signature','signed','voided')) default 'draft',
  tenant_first_name text,
  tenant_last_name text,
  tenant_email text,
  contract_html text not null,
  token text unique not null,
  signature_data text,
  signed_pdf_url text,
  signed_at text,
  signer_ip text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);
CREATE TABLE rent_types (
  id text primary key default (lower(hex(randomblob(16)))),
  name text not null,
  name_en text,
  slug text not null unique,
  order_index integer not null default 0,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);
INSERT INTO "rent_types" ("id","name","name_en","slug","order_index","created_at","updated_at") VALUES('91ea07ed3fa84a7b37e6a22714fc12c6','Academiejaar','Academic Year','academiejaar',0,'2026-03-19 15:24:23','2026-03-19 15:24:23');
INSERT INTO "rent_types" ("id","name","name_en","slug","order_index","created_at","updated_at") VALUES('92e4e635682bc60303f15ac7b99f8f74','Semester','Semester','semester',1,'2026-03-19 15:24:23','2026-03-19 15:24:23');
INSERT INTO "rent_types" ("id","name","name_en","slug","order_index","created_at","updated_at") VALUES('3dd1cc1c866bdd2bd3f0ba0779ae0469','Erasmus','Erasmus','erasmus',2,'2026-03-19 15:24:23','2026-03-19 15:24:23');
CREATE TABLE kot_rent_types (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete cascade,
  rent_type_id text not null references rent_types(id) on delete cascade,
  unique (kot_id, rent_type_id)
);
CREATE TABLE floor_plan_tokens (
  id text primary key default (lower(hex(randomblob(16)))),
  vestiging_id text not null references vestigingen(id) on delete cascade,
  token text not null unique,
  expires_at text not null,
  created_at text not null default (datetime('now'))
);
CREATE TABLE building_floors (
  id text primary key default (lower(hex(randomblob(16)))),
  vestiging_id text not null references vestigingen(id) on delete cascade,
  floor_name text not null,
  level integer not null default 0,
  order_index integer not null default 0,
  created_at text not null default (datetime('now'))
);
CREATE TABLE building_rooms (
  id text primary key default (lower(hex(randomblob(16)))),
  floor_id text not null references building_floors(id) on delete cascade,
  kot_id text references koten(id) on delete set null,
  room_label text not null,
  location text,
  size_m2 real,
  pos_x real not null default 0,
  pos_y real not null default 0,
  width real not null default 100,
  height real not null default 65,
  availability_status text not null default 'available',
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);
CREATE INDEX idx_koten_vestiging_id on koten(vestiging_id);
CREATE INDEX idx_kot_photos_kot_id on kot_photos(kot_id);
CREATE INDEX idx_kot_photos_media_asset_id on kot_photos(media_asset_id);
CREATE INDEX idx_user_vestigingen_user_id on user_vestigingen(user_id);
CREATE INDEX idx_user_vestigingen_vestiging_id on user_vestigingen(vestiging_id);
CREATE INDEX idx_availability_history_kot_id on availability_history(kot_id);
CREATE INDEX idx_audit_logs_entity on audit_logs(entity_type, entity_id);
CREATE INDEX idx_contracts_kot_id on contracts(kot_id);
CREATE INDEX idx_contracts_token on contracts(token);
CREATE INDEX idx_kot_rent_types_kot on kot_rent_types(kot_id);
CREATE INDEX idx_kot_rent_types_rent_type on kot_rent_types(rent_type_id);
CREATE INDEX idx_floor_plan_tokens_vestiging on floor_plan_tokens(vestiging_id);
CREATE INDEX idx_floor_plan_tokens_token on floor_plan_tokens(token);
CREATE INDEX idx_building_floors_vestiging on building_floors(vestiging_id);
CREATE INDEX idx_building_rooms_floor on building_rooms(floor_id);
CREATE INDEX idx_building_rooms_kot on building_rooms(kot_id);
CREATE TRIGGER set_vestigingen_updated_at
before update on vestigingen
for each row
begin
  update vestigingen set updated_at = datetime('now') where id = old.id;
end;
CREATE TRIGGER set_koten_updated_at
before update on koten
for each row
begin
  update koten set updated_at = datetime('now') where id = old.id;
end;
CREATE TRIGGER set_contract_templates_updated_at
before update on contract_templates
for each row
begin
  update contract_templates set updated_at = datetime('now') where id = old.id;
end;
CREATE TRIGGER set_contracts_updated_at
before update on contracts
for each row
begin
  update contracts set updated_at = datetime('now') where id = old.id;
end;
CREATE TRIGGER set_rent_types_updated_at
before update on rent_types
for each row
begin
  update rent_types set updated_at = datetime('now') where id = old.id;
end;
CREATE TRIGGER set_building_rooms_updated_at
before update on building_rooms
for each row
begin
  update building_rooms set updated_at = datetime('now') where id = old.id;
end;
