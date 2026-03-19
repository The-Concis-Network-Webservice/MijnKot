-- Floor plan seed for Naamsestraat 29, Leuven
-- Vestiging ID: ce3bd461f11895258095c5494c23b588

-- Floor: Gelijkvloers
insert into building_floors (id, vestiging_id, floor_name, level, order_index) values ('9673edd5b1bf1ace', 'ce3bd461f11895258095c5494c23b588', 'Gelijkvloers', 0, 0);

insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('6897c3aea0eb5a90', '9673edd5b1bf1ace', '29A/0001', 'street', null, 30, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('9b434caf25aa821a', '9673edd5b1bf1ace', '29A/0002', 'street', null, 145, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('f6c10c466043cdce', '9673edd5b1bf1ace', '31/0002', 'street', null, 420, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('0076d4f234628146', '9673edd5b1bf1ace', '31/0003', 'courtyard', 20.17, 530, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('d28f3ced88c3ecf0', '9673edd5b1bf1ace', '31/0004', 'courtyard', null, 640, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('d78d5d02a1d33389', '9673edd5b1bf1ace', '31/0005', 'street', 10.05, 420, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('08d007907ad62d5d', '9673edd5b1bf1ace', '31/0006', 'courtyard', null, 530, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('5de5f5eb83c7dd16', '9673edd5b1bf1ace', '31/0007', 'courtyard', null, 640, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('6ac19f322962046e', '9673edd5b1bf1ace', '31/0008', 'street', null, 420, 200, 100, 65, 'available');

-- Floor: 1e Verdieping
insert into building_floors (id, vestiging_id, floor_name, level, order_index) values ('a33c84375362e3cb', 'ce3bd461f11895258095c5494c23b588', '1e Verdieping', 1, 1);

insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('fdd0e17b76ad765f', 'a33c84375362e3cb', '29A/0101', 'street', 14.61, 30, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('aac89fa949fedd83', 'a33c84375362e3cb', '29A/0102', 'street', 10.93, 145, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('e9a2ff361c90d8e5', 'a33c84375362e3cb', '29A/0103', 'street', 15.2, 260, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('74519b10948279c0', 'a33c84375362e3cb', '29A/0104', 'courtyard', null, 30, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('12a97815028d82b6', 'a33c84375362e3cb', '29A/0105', 'courtyard', null, 145, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('be46eb80799851be', 'a33c84375362e3cb', '29A/0106', 'courtyard', null, 260, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('b2f6fd5d52d9031a', 'a33c84375362e3cb', '29A/0107', 'courtyard', null, 30, 200, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('dbaeab9c9cfff570', 'a33c84375362e3cb', '31/0101', 'street', 12, 420, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('d03329405cb1818a', 'a33c84375362e3cb', '31/0102', 'street', null, 530, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('b0ca49f45a0c33fb', 'a33c84375362e3cb', '31/0103', 'street', null, 640, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('ca1c4319019ade68', 'a33c84375362e3cb', '31/0104', 'street', 15.51, 420, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('a4a406986c1f7c07', 'a33c84375362e3cb', '31/0105', 'courtyard', 12, 530, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('47e72460a61d9801', 'a33c84375362e3cb', '31/0106', 'courtyard', null, 640, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('b2c886315156e863', 'a33c84375362e3cb', '31/0107', 'courtyard', 15.51, 420, 200, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('98bef0a395a67bf9', 'a33c84375362e3cb', '31/0108', 'courtyard', 12, 530, 200, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('31c58e0c14dfa8a8', 'a33c84375362e3cb', '31/0109', 'street', 12, 640, 200, 100, 65, 'available');

-- Floor: 2e Verdieping
insert into building_floors (id, vestiging_id, floor_name, level, order_index) values ('2f23f15a20ff3e1c', 'ce3bd461f11895258095c5494c23b588', '2e Verdieping', 2, 2);

insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('2d1773ecc3dc7e61', '2f23f15a20ff3e1c', '29A/0201', 'street', 12.08, 30, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('f253b2635e504d1d', '2f23f15a20ff3e1c', '29A/0202', 'street', null, 145, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('28bea0560e516242', '2f23f15a20ff3e1c', '29A/0203', 'street', null, 260, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('3a4f4609a11239d4', '2f23f15a20ff3e1c', '29A/0204', 'courtyard', null, 30, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('930098c464a1ffed', '2f23f15a20ff3e1c', '29A/0205', 'courtyard', 10.16, 145, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('24b757ebb6c58dc0', '2f23f15a20ff3e1c', '29A/0206', 'courtyard', null, 260, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('6f658d5ebcc366b5', '2f23f15a20ff3e1c', '29A/0207', 'street', null, 30, 200, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('ae16a0131a5a822d', '2f23f15a20ff3e1c', '29A/0208', 'street', null, 145, 200, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('790ce3d8616c36eb', '2f23f15a20ff3e1c', '31/0201', 'street', null, 420, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('b2d48400f0babdec', '2f23f15a20ff3e1c', '31/0202', 'street', null, 530, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('19dab1c24ed32327', '2f23f15a20ff3e1c', '31/0203', 'street', null, 640, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('1b8bbf54197e2d65', '2f23f15a20ff3e1c', '31/0204', 'courtyard', 15.51, 420, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('4600de878f4504da', '2f23f15a20ff3e1c', '31/0205', 'courtyard', 15.51, 530, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('9e11731976e7f72b', '2f23f15a20ff3e1c', '31/0206', 'courtyard', 15.51, 640, 120, 100, 65, 'available');

-- Floor: Zolder
insert into building_floors (id, vestiging_id, floor_name, level, order_index) values ('64821635c76bb50c', 'ce3bd461f11895258095c5494c23b588', 'Zolder', 3, 3);

insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('9bfc78b6b698c907', '64821635c76bb50c', '29A/0301', 'street', 12.91, 30, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('9e9b433dd74e640e', '64821635c76bb50c', '29A/0302', 'street', 12.91, 145, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('758b24ceaa6f1705', '64821635c76bb50c', '29A/0303', 'courtyard', 12.91, 260, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('796c675ee557f504', '64821635c76bb50c', '29A/0304', 'courtyard', 12.91, 30, 120, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('ee3c13e18167a1b9', '64821635c76bb50c', '31/0301', 'street', 14.61, 420, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('8684b68662114ae2', '64821635c76bb50c', '31/0302', 'street', 14.79, 530, 40, 100, 65, 'available');
insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) values ('fb0e356fc8a98f15', '64821635c76bb50c', '31/0303', 'courtyard', 12.15, 640, 40, 100, 65, 'available');
