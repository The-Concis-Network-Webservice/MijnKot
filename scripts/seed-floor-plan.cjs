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
      floor_name: "Naamsestraat 29",
      level: 0,
      rooms: [
        // Sectie A: kamers 1–21
        { room_label: "29/1",  location: null, size_m2: null, pos_x: 30,  pos_y: 40,  width: 100, height: 65 },
        { room_label: "29/2",  location: null, size_m2: null, pos_x: 145, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29/3",  location: null, size_m2: null, pos_x: 260, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29/4",  location: null, size_m2: null, pos_x: 30,  pos_y: 120, width: 100, height: 65 },
        { room_label: "29/5",  location: null, size_m2: null, pos_x: 145, pos_y: 120, width: 100, height: 65 },
        { room_label: "29/6",  location: null, size_m2: null, pos_x: 260, pos_y: 120, width: 100, height: 65 },
        { room_label: "29/7",  location: null, size_m2: null, pos_x: 30,  pos_y: 200, width: 100, height: 65 },
        { room_label: "29/8",  location: null, size_m2: null, pos_x: 145, pos_y: 200, width: 100, height: 65 },
        { room_label: "29/9",  location: null, size_m2: null, pos_x: 260, pos_y: 200, width: 100, height: 65 },
        { room_label: "29/10", location: null, size_m2: null, pos_x: 30,  pos_y: 280, width: 100, height: 65 },
        { room_label: "29/11", location: null, size_m2: null, pos_x: 145, pos_y: 280, width: 100, height: 65 },
        { room_label: "29/12", location: null, size_m2: null, pos_x: 260, pos_y: 280, width: 100, height: 65 },
        { room_label: "29/13", location: null, size_m2: null, pos_x: 30,  pos_y: 360, width: 100, height: 65 },
        { room_label: "29/14", location: null, size_m2: null, pos_x: 145, pos_y: 360, width: 100, height: 65 },
        { room_label: "29/15", location: null, size_m2: null, pos_x: 260, pos_y: 360, width: 100, height: 65 },
        { room_label: "29/16", location: null, size_m2: null, pos_x: 30,  pos_y: 440, width: 100, height: 65 },
        { room_label: "29/17", location: null, size_m2: null, pos_x: 145, pos_y: 440, width: 100, height: 65 },
        { room_label: "29/18", location: null, size_m2: null, pos_x: 260, pos_y: 440, width: 100, height: 65 },
        { room_label: "29/19", location: null, size_m2: null, pos_x: 30,  pos_y: 520, width: 100, height: 65 },
        { room_label: "29/20", location: null, size_m2: null, pos_x: 145, pos_y: 520, width: 100, height: 65 },
        { room_label: "29/21", location: null, size_m2: null, pos_x: 260, pos_y: 520, width: 100, height: 65 },
        // Sectie D: kamers 22–25
        { room_label: "29/22", location: null, size_m2: null, pos_x: 420, pos_y: 360, width: 100, height: 65 },
        { room_label: "29/23", location: null, size_m2: null, pos_x: 535, pos_y: 360, width: 100, height: 65 },
        { room_label: "29/24", location: null, size_m2: null, pos_x: 650, pos_y: 360, width: 100, height: 65 },
        { room_label: "29/25", location: null, size_m2: null, pos_x: 765, pos_y: 360, width: 100, height: 65 },
        // Sectie C: kamers 26–31
        { room_label: "29/26", location: null, size_m2: null, pos_x: 420, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29/27", location: null, size_m2: null, pos_x: 535, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29/28", location: null, size_m2: null, pos_x: 650, pos_y: 40,  width: 100, height: 65 },
        { room_label: "29/29", location: null, size_m2: null, pos_x: 420, pos_y: 120, width: 100, height: 65 },
        { room_label: "29/30", location: null, size_m2: null, pos_x: 535, pos_y: 120, width: 100, height: 65 },
        { room_label: "29/31", location: null, size_m2: null, pos_x: 650, pos_y: 120, width: 100, height: 65 },
        // Sectie B: kamers 40–45
        { room_label: "29/40", location: null, size_m2: null, pos_x: 30,  pos_y: 640, width: 100, height: 65 },
        { room_label: "29/41", location: null, size_m2: null, pos_x: 145, pos_y: 640, width: 100, height: 65 },
        { room_label: "29/42", location: null, size_m2: null, pos_x: 260, pos_y: 640, width: 100, height: 65 },
        { room_label: "29/43", location: null, size_m2: null, pos_x: 375, pos_y: 640, width: 100, height: 65 },
        { room_label: "29/44", location: null, size_m2: null, pos_x: 490, pos_y: 640, width: 100, height: 65 },
        { room_label: "29/45", location: null, size_m2: null, pos_x: 605, pos_y: 640, width: 100, height: 65 },
      ],
    },
    {
      floor_name: "Naamsestraat 31",
      level: 0,
      rooms: [
        // Sectie E: kamers 1–12
        { room_label: "31/1",  location: null, size_m2: null, pos_x: 30,  pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/2",  location: null, size_m2: null, pos_x: 145, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/3",  location: null, size_m2: null, pos_x: 260, pos_y: 40,  width: 100, height: 65 },
        { room_label: "31/4",  location: null, size_m2: null, pos_x: 30,  pos_y: 120, width: 100, height: 65 },
        { room_label: "31/5",  location: null, size_m2: null, pos_x: 145, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/6",  location: null, size_m2: null, pos_x: 260, pos_y: 120, width: 100, height: 65 },
        { room_label: "31/7",  location: null, size_m2: null, pos_x: 30,  pos_y: 200, width: 100, height: 65 },
        { room_label: "31/8",  location: null, size_m2: null, pos_x: 145, pos_y: 200, width: 100, height: 65 },
        { room_label: "31/9",  location: null, size_m2: null, pos_x: 260, pos_y: 200, width: 100, height: 65 },
        { room_label: "31/10", location: null, size_m2: null, pos_x: 30,  pos_y: 280, width: 100, height: 65 },
        { room_label: "31/11", location: null, size_m2: null, pos_x: 145, pos_y: 280, width: 100, height: 65 },
        { room_label: "31/12", location: null, size_m2: null, pos_x: 260, pos_y: 280, width: 100, height: 65 },
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
