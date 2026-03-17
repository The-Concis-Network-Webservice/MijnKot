const Database = require('better-sqlite3');
const path = require('path');

// Target the local wrangler D1 sqlite file
const sqlitePath = path.join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6915236825a7f70e57e0867968d6c7cd7ff65f409c4e5c54c45e4db7eacc4810.sqlite');

const db = new Database(sqlitePath);

const vestigingen = [
  {
    id: 'ce3bd461f11895258095c5494c23b588',
    name: 'Naamsestraat 29A',
    address: 'Naamsestraat 29A',
    city: 'Leuven',
    postal_code: '3000',
    description: `Dit gebouw biedt unieke studentenkamers in het hart van Leuven. Je woont hier op een toplocatie, op wandelafstand van de universiteit, winkels en het bruisende stadsleven.

Het gebouw beschikt over een gezellige centrale buitenruimte met vijf aparte ingangen die elk toegang geven tot verschillende kamers. Daarnaast is er een recent vernieuwde gemeenschappelijke keuken met televisie, ideaal om samen te koken en te ontspannen.

Er is bovendien een veilige en afgesloten fietsenstalling voorzien.

Comfort in elke kamer

Alle kamers zijn uitgerust met:

Dubbele beglazing

Kotnet (internetverbinding)

Parlofoon

Aansluitmogelijkheid voor kabeltelevisie

Warm en koud water

De douches en toiletten zijn gemeenschappelijk en worden netjes onderhouden.`,
    created_at: '2026-02-23 09:55:31',
    updated_at: '2026-02-23 09:55:31'
  },
  {
    id: 'd51d0e166e3387f845dd7ae64b1490c5',
    name: 'J.P. Minckelersstraat 79',
    address: 'J.P. Minckelersstraat 79',
    city: 'Leuven',
    postal_code: '3000',
    description: `Dit gebouw biedt verschillende types studentenkamers in Leuven, afgestemd op diverse woonwensen en budgetten. Je kan kiezen voor een studentenkamer met gedeeld sanitair of voor een studio met privébadkamer voor extra comfort en privacy.

De residentie is ideaal gelegen vlak bij het centrum van Leuven, op wandelafstand van universiteit, winkels en openbaar vervoer. Tegelijk geniet je hier van een rustige woonomgeving, weg van de drukte van het stadscentrum.

Een perfecte combinatie van centrale ligging and aangenaam wooncomfort voor studenten die een kot willen huren in Leuven.`,
    created_at: '2026-02-23 10:00:25',
    updated_at: '2026-02-23 10:00:25'
  },
  {
    id: '637f58e754b17199ea92ac04c79e74da',
    name: 'Dreefstraat 104',
    address: 'Dreefstraat 104',
    city: ' Heverlee',
    postal_code: '3001',
    description: `Nieuwe, moderne en volledig gemeubelde studentenkamers beschikbaar in verschillende oppervlaktes: 12 m², 14 m², 17 m², 18 m², 21 m² en 35 m². Zo vind je steeds een kamer die perfect aansluit bij jouw wensen en budget.

Elke kamer biedt hedendaags comfort in een verzorgde en aangename studentenresidentie in Heverlee.

Daarnaast is er een ruime gemeenschappelijke keuken en gezellige living met televisie voorzien, ideaal om samen te koken, studeren of ontspannen met medestudenten.`,
    created_at: '2026-02-23 10:05:34',
    updated_at: '2026-02-23 10:06:21'
  },
  {
    id: '04cb31a0552a92bec75648fe4f2a2e32',
    name: 'J.P. Minckelersstraat 104 – 106',
    address: 'J.P. Minckelersstraat 104 – 106',
    city: 'Leuven',
    postal_code: '3000',
    description: `Dit gebouw biedt een ruime keuze aan moderne, gemeubelde studentenkamers in Leuven, geschikt voor uiteenlopende woonwensen.

Er zijn nieuwe en ruime duplexkamers met privé-sanitair, beschikbaar in oppervlaktes van 14 m², 16 m², 17 m², 20 m², 21 m², 25 m² en 30 m². Deze kamers combineren comfort en privacy met toegang tot een gemeenschappelijke keuken en gezellige living met televisie.

Daarnaast zijn er dubbele kamers beschikbaar, eventueel geschikt voor twee personen. Deze kamers zijn volledig van elkaar gescheiden en beschikken over eigen sanitair, wat zorgt voor extra privacy en gebruiksgemak.

Het gebouw biedt ook verschillende ruime kamers en studio’s van 21 m² tot 40 m². Bewoners genieten hier van een gemeenschappelijke tuin en een aangename living met televisie, ideaal om te ontspannen of samen te komen met medestudenten.

Voor alle huurders is een veilige fietsenstalling voorzien.`,
    created_at: '2026-02-23 10:07:57',
    updated_at: '2026-02-23 10:07:57'
  }
];

const stmt = db.prepare(`
  INSERT INTO vestigingen (id, name, address, city, postal_code, description, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log(`Starting recovery on ${sqlitePath}...`);

db.transaction(() => {
  for (const v of vestigingen) {
    try {
      stmt.run(v.id, v.name, v.address, v.city, v.postal_code, v.description, v.created_at, v.updated_at);
      console.log(`✅ Restored: ${v.name}`);
    } catch (e) {
      console.error(`❌ Failed to restore ${v.name}: ${e.message}`);
    }
  }
})();

console.log('Recovery finished.');
db.close();
