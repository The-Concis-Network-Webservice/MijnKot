/**
 * Creates a kot for every building_room that has no kot_id yet,
 * and links them together.
 *
 * Usage:
 *   node scripts/seed-koten-for-rooms.cjs --sql > scripts/seed_koten_for_rooms.sql
 *   wrangler d1 execute mijnkot --local --file=scripts/seed_koten_for_rooms.sql
 */

const VESTIGING_ID = "ce3bd461f11895258095c5494c23b588";
const DEFAULT_PRICE = 500;
const NOW = new Date().toISOString().replace("T", " ").split(".")[0];

const ROOMS = [
  { room_id: "858242760b12605a", room_label: "29/1" },
  { room_id: "29300052fee8b06b", room_label: "29/10" },
  { room_id: "069181d4aa4c5ce3", room_label: "29/11" },
  { room_id: "2981c8b99f6e9b21", room_label: "29/12" },
  { room_id: "3d2fd4d3f12dd5c1", room_label: "29/13" },
  { room_id: "13a2fc73208220fb", room_label: "29/14" },
  { room_id: "9c14e6234810f757", room_label: "29/15" },
  { room_id: "d897eeb3acb5d9ee", room_label: "29/16" },
  { room_id: "feef803bfb50c015", room_label: "29/17" },
  { room_id: "704d36069c063358", room_label: "29/18" },
  { room_id: "9ae96415f16fe46d", room_label: "29/19" },
  { room_id: "55672986352c4085", room_label: "29/2" },
  { room_id: "9e5805171d08737c", room_label: "29/20" },
  { room_id: "c3d17c2009d86a77", room_label: "29/21" },
  { room_id: "f95acbf2fa9b4dad", room_label: "29/22" },
  { room_id: "d79753f9765e1b83", room_label: "29/23" },
  { room_id: "2a5fb36806f26df5", room_label: "29/24" },
  { room_id: "401875125a6e63d5", room_label: "29/25" },
  { room_id: "480bf885a684035e", room_label: "29/26" },
  { room_id: "f24f9cd77e9ba609", room_label: "29/27" },
  { room_id: "8829d32998374e57", room_label: "29/28" },
  { room_id: "60fed91f6400ffcb", room_label: "29/29" },
  { room_id: "a22e28b421debdbb", room_label: "29/3" },
  { room_id: "b6c88fb511bd5a01", room_label: "29/30" },
  { room_id: "967534289140a8f6", room_label: "29/31" },
  { room_id: "5cd3a0b6b875ed6b", room_label: "29/4" },
  { room_id: "e583de104c36e4e6", room_label: "29/40" },
  { room_id: "318f87cb963f55a7", room_label: "29/41" },
  { room_id: "722bd853740ba6ab", room_label: "29/42" },
  { room_id: "0c182324d0105d8b", room_label: "29/43" },
  { room_id: "c06e69165b3ab191", room_label: "29/44" },
  { room_id: "620bd0929b1897ee", room_label: "29/45" },
  { room_id: "4f3bcf34cc62ad9d", room_label: "29/5" },
  { room_id: "3a69ff7f9bd598a8", room_label: "29/6" },
  { room_id: "aacd83e51de9ab70", room_label: "29/7" },
  { room_id: "9d85e514691e8f1e", room_label: "29/8" },
  { room_id: "fd607efd11f9fc7d", room_label: "29/9" },
  { room_id: "bf96b6a3c243a92c", room_label: "31/1" },
  { room_id: "b3272486a223a345", room_label: "31/10" },
  { room_id: "89b7e80b4b186d48", room_label: "31/11" },
  { room_id: "cc09b8c181b8fcfc", room_label: "31/12" },
  { room_id: "864cb67e3c5f94b0", room_label: "31/2" },
  { room_id: "1f2337b8aacf41e5", room_label: "31/3" },
  { room_id: "d077a5af341c3918", room_label: "31/4" },
  { room_id: "41aa86fba9666d58", room_label: "31/5" },
  { room_id: "2c6da9598ffb429b", room_label: "31/6" },
  { room_id: "6c21fd57327e3f6a", room_label: "31/7" },
  { room_id: "4e1f7e823c8eb1c2", room_label: "31/8" },
  { room_id: "4da15b7a9585fd79", room_label: "31/9" },
];

function randomId() {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function generateSQL() {
  const lines = [
    "-- Koten aanmaken voor elke kamer en koppelen via kot_id",
    `-- Vestiging: ${VESTIGING_ID}`,
    "",
  ];

  for (const { room_id, room_label } of ROOMS) {
    const kot_id = randomId();
    const title = `Kamer ${room_label}`;
    lines.push(
      `INSERT INTO koten (id, vestiging_id, title, description, price, availability_status, status, created_at, updated_at) ` +
        `VALUES ('${kot_id}', '${VESTIGING_ID}', '${title}', '', ${DEFAULT_PRICE}, 'available', 'published', '${NOW}', '${NOW}');`
    );
    lines.push(
      `UPDATE building_rooms SET kot_id = '${kot_id}' WHERE id = '${room_id}';`
    );
    lines.push("");
  }

  return lines.join("\n");
}

const fs = require("fs");
const sql = generateSQL();
const outPath = "scripts/seed_koten_for_rooms.sql";
fs.writeFileSync(outPath, sql);
console.log(`SQL written to ${outPath}`);
console.log(`Run: wrangler d1 execute mijnkot --local --file=${outPath}`);
