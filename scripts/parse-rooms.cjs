const fs = require('fs');
const text = fs.readFileSync('scripts/pdf_text.txt', 'utf8');

// Find unique room codes
const pattern = /29A?\/\d{4}|31\/\d{4}/g;
const allMatches = text.match(pattern) || [];
const rooms = [...new Set(allMatches)].sort();

// Extract room sizes from the PDF text - look for patterns near room codes
const lines = text.split('\n');
const roomSizes = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const codeMatch = line.match(/(29A?\/\d{4}|31\/\d{4})/);
  if (codeMatch) {
    const code = codeMatch[1];
    // Look in surrounding lines for a size
    for (let j = Math.max(0, i-3); j <= Math.min(lines.length-1, i+3); j++) {
      const sizeMatch = lines[j].match(/opp[. =]*?([\d.,]+)\s*m/i);
      if (sizeMatch && !roomSizes[code]) {
        roomSizes[code] = parseFloat(sizeMatch[1].replace(',', '.'));
      }
    }
  }
}

console.log('=== UNIQUE ROOMS ===');
console.log('Total:', rooms.length);
rooms.forEach(r => {
  const sz = roomSizes[r];
  console.log(r + (sz ? ' - ' + sz + 'm2' : ''));
});

// Group by floor based on room code structure
// XX/YYZZ where YY = floor (00=ground, 01=1st, 02=2nd, 03=3rd/attic), ZZ = room number
const byFloor = {};
rooms.forEach(r => {
  const m = r.match(/(29A?|31)\/(\d{2})(\d{2})/);
  if (m) {
    const floor = parseInt(m[2]);
    if (!byFloor[floor]) byFloor[floor] = [];
    byFloor[floor].push(r);
  }
});

console.log('\n=== BY FLOOR ===');
Object.entries(byFloor).sort(([a],[b]) => parseInt(a)-parseInt(b)).forEach(([floor, rooms]) => {
  console.log(`Floor ${floor}: ${rooms.join(', ')} (${rooms.length} rooms)`);
});

// Build JSON output
const building = {
  address: "Naamsestraat 29, 3000 Leuven",
  metadata: {
    totalRooms: rooms.length
  },
  floors: Object.entries(byFloor).sort(([a],[b]) => parseInt(a)-parseInt(b)).map(([level, roomCodes]) => {
    const lvl = parseInt(level);
    const floorNames = {'-1': 'Kelder', 0: 'Gelijkvloers', 1: '1e Verdieping', 2: '2e Verdieping', 3: 'Zolder'};
    return {
      floorName: floorNames[lvl] || `Verdieping ${lvl}`,
      level: lvl,
      totalRooms: roomCodes.length,
      rooms: roomCodes.map((code, idx) => {
        const m = code.match(/(29A?|31)\/(\d{2})(\d{2})/);
        const wing = m[1] === '31' ? 'right_wing' : 'left_wing';
        const roomNum = parseInt(m[3]);
        // Simple grid layout: 4 columns, rows of 4
        const col = (roomNum - 1) % 4;
        const row = Math.floor((roomNum - 1) / 4);
        return {
          id: code,
          location: wing,
          size_m2: roomSizes[code] || null,
          coordinates: {
            x: col * 120 + (wing === 'right_wing' ? 520 : 50),
            y: row * 80 + 80
          },
          width: 100,
          height: 65
        };
      })
    };
  })
};

fs.writeFileSync('scripts/building_data.json', JSON.stringify(building, null, 2));
console.log('\nBuilding data saved to scripts/building_data.json');
