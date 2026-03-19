/**
 * Seed floor plan data for Naamsestraat 29, Leuven
 * Extracted from: OMV_2024130246_vergunde_plannen (3).pdf
 *
 * Usage:
 *   node scripts/seed-floor-plan.cjs <vestiging_id>
 *   e.g. node scripts/seed-floor-plan.cjs abc123
 *
 * OR generate SQL to run with wrangler:
 *   node scripts/seed-floor-plan.cjs --sql > scripts/seed_floor_plan.sql
 *   wrangler d1 execute mijnkot --local --file=scripts/seed_floor_plan.sql
 */

const BUILDING_DATA = {
  address: "Naamsestraat 29-31, 3000 Leuven",
  floors: [
    {
      floor_name: "Gelijkvloers",
      level: 0,
      rooms: [
        // Building 29A ground floor
        { room_label: "29A/0001", location: "street", size_m2: null, pos_x: 30,  pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0002", location: "street", size_m2: null, pos_x: 145, pos_y: 40,  width: 100, height: 65 },
        // Building 31 ground floor
        { room_label: "31/0002", location: "street",    size_m2: null,   pos_x: 420, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0003", location: "courtyard", size_m2: 20.17,  pos_x: 530, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0004", location: "courtyard", size_m2: null,   pos_x: 640, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0005", location: "street",    size_m2: 10.05,  pos_x: 420, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0006", location: "courtyard", size_m2: null,   pos_x: 530, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0007", location: "courtyard", size_m2: null,   pos_x: 640, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0008", location: "street",    size_m2: null,   pos_x: 420, pos_y: 200, width: 100, height: 65 },
      ],
    },
    {
      floor_name: "1e Verdieping",
      level: 1,
      rooms: [
        // 29A wing (left) - 7 rooms
        { room_label: "29A/0101", location: "street",    size_m2: 14.61, pos_x: 30,  pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0102", location: "street",    size_m2: 10.93, pos_x: 145, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0103", location: "street",    size_m2: 15.20, pos_x: 260, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0104", location: "courtyard", size_m2: null,  pos_x: 30,  pos_y: 120, width: 100, height: 65 },
        { room_label: "29A/0105", location: "courtyard", size_m2: null,  pos_x: 145, pos_y: 120, width: 100, height: 65 },
        { room_label: "29A/0106", location: "courtyard", size_m2: null,  pos_x: 260, pos_y: 120, width: 100, height: 65 },
        { room_label: "29A/0107", location: "courtyard", size_m2: null,  pos_x: 30,  pos_y: 200, width: 100, height: 65 },
        // 31 wing (right) - 9 rooms
        { room_label: "31/0101", location: "street",    size_m2: 12.00, pos_x: 420, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0102", location: "street",    size_m2: null,  pos_x: 530, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0103", location: "street",    size_m2: null,  pos_x: 640, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0104", location: "street",    size_m2: 15.51, pos_x: 420, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0105", location: "courtyard", size_m2: 12.00, pos_x: 530, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0106", location: "courtyard", size_m2: null,  pos_x: 640, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0107", location: "courtyard", size_m2: 15.51, pos_x: 420, pos_y: 200, width: 100, height: 65 },
        { room_label: "31/0108", location: "courtyard", size_m2: 12.00, pos_x: 530, pos_y: 200, width: 100, height: 65 },
        { room_label: "31/0109", location: "street",    size_m2: 12.00, pos_x: 640, pos_y: 200, width: 100, height: 65 },
      ],
    },
    {
      floor_name: "2e Verdieping",
      level: 2,
      rooms: [
        // 29A wing (left) - 8 rooms
        { room_label: "29A/0201", location: "street",    size_m2: 12.08, pos_x: 30,  pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0202", location: "street",    size_m2: null,  pos_x: 145, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0203", location: "street",    size_m2: null,  pos_x: 260, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0204", location: "courtyard", size_m2: null,  pos_x: 30,  pos_y: 120, width: 100, height: 65 },
        { room_label: "29A/0205", location: "courtyard", size_m2: 10.16, pos_x: 145, pos_y: 120, width: 100, height: 65 },
        { room_label: "29A/0206", location: "courtyard", size_m2: null,  pos_x: 260, pos_y: 120, width: 100, height: 65 },
        { room_label: "29A/0207", location: "street",    size_m2: null,  pos_x: 30,  pos_y: 200, width: 100, height: 65 },
        { room_label: "29A/0208", location: "street",    size_m2: null,  pos_x: 145, pos_y: 200, width: 100, height: 65 },
        // 31 wing (right) - 6 rooms
        { room_label: "31/0201", location: "street",    size_m2: null,  pos_x: 420, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0202", location: "street",    size_m2: null,  pos_x: 530, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0203", location: "street",    size_m2: null,  pos_x: 640, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0204", location: "courtyard", size_m2: 15.51, pos_x: 420, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0205", location: "courtyard", size_m2: 15.51, pos_x: 530, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/0206", location: "courtyard", size_m2: 15.51, pos_x: 640, pos_y: 120, width: 100, height: 65 },
      ],
    },
    {
      floor_name: "Zolder",
      level: 3,
      rooms: [
        // 29A wing (left) - 4 rooms
        { room_label: "29A/0301", location: "street",    size_m2: 12.91, pos_x: 30,  pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0302", location: "street",    size_m2: 12.91, pos_x: 145, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0303", location: "courtyard", size_m2: 12.91, pos_x: 260, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29A/0304", location: "courtyard", size_m2: 12.91, pos_x: 30,  pos_y: 120, width: 100, height: 65 },
        // 31 wing (right) - 3 rooms
        { room_label: "31/0301", location: "street",    size_m2: 14.61, pos_x: 420, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0302", location: "street",    size_m2: 14.79, pos_x: 530, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/0303", location: "courtyard", size_m2: 12.15, pos_x: 640, pos_y: 40,  width: 100, height: 65 },
      ],
    },
  ],
};

function randomId() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateSQL(vestigingId) {
  const lines = [
    '-- Floor plan seed for Naamsestraat 29, Leuven',
    `-- Vestiging ID: ${vestigingId}`,
    '',
  ];

  for (let fi = 0; fi < BUILDING_DATA.floors.length; fi++) {
    const floor = BUILDING_DATA.floors[fi];
    const floorId = randomId();
    lines.push(`-- Floor: ${floor.floor_name}`);
    lines.push(`insert into building_floors (id, vestiging_id, floor_name, level, order_index) values ('${floorId}', '${vestigingId}', '${floor.floor_name}', ${floor.level}, ${fi});`);
    lines.push('');
    for (const room of floor.rooms) {
      const roomId = randomId();
      const sz = room.size_m2 !== null && room.size_m2 !== undefined ? room.size_m2 : 'null';
      const loc = room.location ? `'${room.location}'` : 'null';
      lines.push(
        `insert into building_rooms (id, floor_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status) ` +
        `values ('${roomId}', '${floorId}', '${room.room_label}', ${loc}, ${sz}, ${room.pos_x}, ${room.pos_y}, ${room.width}, ${room.height}, 'available');`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

const args = process.argv.slice(2);
const sqlMode = args.includes('--sql');

if (sqlMode) {
  const vestigingId = args.find(a => !a.startsWith('--')) || 'REPLACE_WITH_VESTIGING_ID';
  process.stdout.write(generateSQL(vestigingId));
} else {
  const vestigingId = args[0];
  if (!vestigingId) {
    console.error('Usage: node scripts/seed-floor-plan.cjs <vestiging_id>');
    console.error('   or: node scripts/seed-floor-plan.cjs --sql [vestiging_id] > seed.sql');
    process.exit(1);
  }

  console.log('Generating SQL seed for vestiging:', vestigingId);
  const sql = generateSQL(vestigingId);
  const fs = require('fs');
  const outPath = 'scripts/seed_floor_plan.sql';
  fs.writeFileSync(outPath, sql);
  console.log('SQL written to:', outPath);
  console.log('Run: wrangler d1 execute mijnkot --local --file=' + outPath);
}
