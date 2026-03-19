# Handoff: Plattegrond Feature — MijnKot

**Branch:** `Feature--Location-map`
**Gebouw:** Naamsestraat 29-31, Leuven
**Status:** Werkend lokaal, nog niet gecommit/gepusht

---

## Wat is gebouwd

Een interactief kamerbeheersysteem geïntegreerd in het bestaande admin panel (`/admin/vestigingen/[id]`).

### Functies
- Alle verdiepingen tegelijk zichtbaar (Gelijkvloers, 1e/2e Verdieping, Zolder)
- Kamers als gekleurde tegels: 🟢 Beschikbaar · 🟡 Gereserveerd · 🔴 Verhuurd
- Split view: linker vleugel (Nr. 29) vs rechter vleugel (Nr. 31)
- Dubbelklik op kamer = snel beschikbaar ↔ verhuurd wisselen
- Klikken = detail panel rechts voor bewerken (naam, status, m², locatie, koppeling aan kot)
- Verdiepingen en kamers toevoegen/verwijderen

### Data uit PDF
48 kamers geëxtraheerd uit `public/OMV_2024130246_vergunde_plannen (3).pdf`:
- Gelijkvloers: 9 ruimtes
- 1e Verdieping: 16 kamers
- 2e Verdieping: 14 kamers
- Zolder: 7 kamers

---

## Nieuwe bestanden

| Bestand | Beschrijving |
|---------|-------------|
| `src/app/admin/_components/floor-plan-manager.tsx` | Hoofdcomponent — gebouwoverzicht met alle kamers |
| `src/app/admin/_components/floor-plan-svg.tsx` | SVG component (niet meer actief gebruikt) |
| `src/app/admin/_components/rich-text-editor.tsx` | Was ontbrekend — simpele textarea implementatie |
| `src/app/api/cms/floor-plans/route.ts` | API: CRUD voor verdiepingen |
| `src/app/api/cms/floor-rooms/route.ts` | API: CRUD voor kamers |
| `src/db/migrations/add_building_floor_plans.sql` | DB migratie |
| `scripts/extract-floor-plan.js` | PDF tekst extractor (eenmalig gebruik) |
| `scripts/parse-rooms.cjs` | Kamerdata uit PDF halen |
| `scripts/seed-floor-plan.cjs` | Seed script |
| `scripts/seed_floor_plan.sql` | Gegenereerde SQL seed (voor lokaal) |
| `scripts/pdf_text.txt` | Geëxtraheerde tekst uit PDF |
| `scripts/building_data.json` | Kamerdata als JSON |

### Gewijzigde bestanden
| Bestand | Wijziging |
|---------|-----------|
| `src/types.ts` | `BuildingFloor` en `BuildingRoom` types toegevoegd |
| `src/db/schema.d1.sql` | `building_floors` en `building_rooms` tabellen toegevoegd |
| `src/app/admin/vestigingen/[id]/page.tsx` | `FloorPlanManager` sectie toegevoegd |

---

## Lokaal opstarten (op andere PC)

### 1. Repo clonen / branch ophalen
```bash
git fetch origin
git checkout Feature--Location-map
npm install
```

### 2. Dependencies
`pdf-parse` is al geïnstalleerd als dev dependency.

### 3. Twee terminals starten
```bash
# Terminal 1
npm run dev          # Next.js op poort 3001

# Terminal 2
npm run dev:wrangler # Cloudflare proxy op poort 3000 (met D1 database)
```

### 4. DB migratie toepassen (eenmalig per machine)
```bash
npx wrangler d1 execute mijnkot --local --file=src/db/migrations/add_building_floor_plans.sql
```

### 5. Kamers seeden voor Naamsestraat
De vestiging ID van Naamsestraat 29 is `ce3bd461f11895258095c5494c23b588` (op deze PC).
Op een andere PC kan de ID anders zijn als je de DB opnieuw aanmaakt.

```bash
# Zoek eerst het juiste ID op via de admin UI (/admin/vestigingen)
# Dan:
node scripts/seed-floor-plan.cjs <vestiging_id>
npx wrangler d1 execute mijnkot --local --file=scripts/seed_floor_plan.sql
```

### 6. Navigeer naar
```
http://localhost:3000/admin/vestigingen/[id]
```
Scroll naar **"Plattegrond"** sectie.

---

## Nog te doen / ideeën

- [ ] **Huurdernaam tonen** in de kamertegel (via koppeling aan `koten.title`)
- [ ] **Prijs tonen** in de kamertegel
- [ ] **Huurcontract koppeling** — vanuit kamer direct naar contract
- [ ] **Exporteren** — overzicht als PDF of Excel (zoals de huidige spreadsheet)
- [ ] **Zoeken/filteren** — kamers filteren op status of vleugel
- [ ] **Migratie remote** toepassen wanneer live gaat:
  ```bash
  npx wrangler d1 execute mijnkot --remote --file=src/db/migrations/add_building_floor_plans.sql
  ```
- [ ] **Kamernummers** — optioneel veld toevoegen voor interne nummering (1, 2, 3... ipv 29A/0101)
- [ ] **Foto per kamer** — link naar foto's in de media library

---

## DB tabellen (nieuw)

```sql
building_floors (id, vestiging_id, floor_name, level, order_index, created_at)
building_rooms  (id, floor_id, kot_id, room_label, location, size_m2,
                 pos_x, pos_y, width, height, availability_status,
                 created_at, updated_at)
```

`kot_id` is optioneel — koppelt een fysieke kamer aan een bestaand kot-listing.

---

## Snelle referentie

```
Admin URL:      http://localhost:3000/admin
Vestigingen:    http://localhost:3000/admin/vestigingen
API floor-plans: /api/cms/floor-plans?vestiging_id=xxx
API floor-rooms: /api/cms/floor-rooms?floor_id=xxx
```
