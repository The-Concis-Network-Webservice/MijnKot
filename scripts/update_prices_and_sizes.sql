-- Prijzen bijwerken via building_rooms → koten koppeling
-- Naamsestraat 29
UPDATE koten SET price = 548 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/1');
UPDATE koten SET price = 685 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/3');
UPDATE koten SET price = 638 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/4');
UPDATE koten SET price = 638 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/5');
UPDATE koten SET price = 698 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/6');
UPDATE koten SET price = 698 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/7');
UPDATE koten SET price = 632 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/8');
UPDATE koten SET price = 645 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/9');
UPDATE koten SET price = 633 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/10');
UPDATE koten SET price = 635 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/11');
UPDATE koten SET price = 636 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/12');
UPDATE koten SET price = 688 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/13');
UPDATE koten SET price = 672 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/14');
UPDATE koten SET price = 660 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/15');
UPDATE koten SET price = 660 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/16');
UPDATE koten SET price = 691 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/19');
UPDATE koten SET price = 691 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/20');
UPDATE koten SET price = 714 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/21');
UPDATE koten SET price = 620 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/22');
UPDATE koten SET price = 631 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/23');
UPDATE koten SET price = 662 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/24');
UPDATE koten SET price = 672 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/25');
UPDATE koten SET price = 525 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/26');
UPDATE koten SET price = 638 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/28');
UPDATE koten SET price = 575 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/29');
UPDATE koten SET price = 677 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '29/30');

-- Naamsestraat 31
UPDATE koten SET price = 605 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/1');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/2');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/3');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/4');
UPDATE koten SET price = 636 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/5');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/6');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/7');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/8');
UPDATE koten SET price = 698 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/9');
UPDATE koten SET price = 535 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/10');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/11');
UPDATE koten SET price = 595 WHERE id = (SELECT kot_id FROM building_rooms WHERE room_label = '31/12');

-- Oppervlaktes bijwerken in building_rooms
-- Naamsestraat 29
UPDATE building_rooms SET size_m2 = 21 WHERE room_label = '29/3';
UPDATE building_rooms SET size_m2 = 14 WHERE room_label = '29/4';
UPDATE building_rooms SET size_m2 = 14 WHERE room_label = '29/5';
UPDATE building_rooms SET size_m2 = 20 WHERE room_label = '29/7';
UPDATE building_rooms SET size_m2 = 14 WHERE room_label = '29/8';
UPDATE building_rooms SET size_m2 = 18 WHERE room_label = '29/9';
UPDATE building_rooms SET size_m2 = 13 WHERE room_label = '29/10';
UPDATE building_rooms SET size_m2 = 14 WHERE room_label = '29/11';
UPDATE building_rooms SET size_m2 = 14 WHERE room_label = '29/12';
UPDATE building_rooms SET size_m2 = 20 WHERE room_label = '29/13';
UPDATE building_rooms SET size_m2 = 25 WHERE room_label = '29/22';
UPDATE building_rooms SET size_m2 = 22 WHERE room_label = '29/25';
UPDATE building_rooms SET size_m2 = 11 WHERE room_label = '29/26';
UPDATE building_rooms SET size_m2 = 16 WHERE room_label = '29/28';
UPDATE building_rooms SET size_m2 = 11 WHERE room_label = '29/29';
UPDATE building_rooms SET size_m2 = 18 WHERE room_label = '29/30';

-- Naamsestraat 31
UPDATE building_rooms SET size_m2 = 20 WHERE room_label = '31/1';
UPDATE building_rooms SET size_m2 = 12 WHERE room_label = '31/2';
UPDATE building_rooms SET size_m2 = 12 WHERE room_label = '31/3';
UPDATE building_rooms SET size_m2 = 18 WHERE room_label = '31/4';
UPDATE building_rooms SET size_m2 = 20 WHERE room_label = '31/5';
UPDATE building_rooms SET size_m2 = 12 WHERE room_label = '31/6';
UPDATE building_rooms SET size_m2 = 12 WHERE room_label = '31/7';
UPDATE building_rooms SET size_m2 = 12 WHERE room_label = '31/8';
UPDATE building_rooms SET size_m2 = 20 WHERE room_label = '31/9';
UPDATE building_rooms SET size_m2 = 12 WHERE room_label = '31/11';
UPDATE building_rooms SET size_m2 = 12 WHERE room_label = '31/12';
