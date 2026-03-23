import { notFound } from "next/navigation";
import { query, queryOne } from "@/shared/lib/db";
import type { BuildingFloor, BuildingRoom, Vestiging } from "@/types";

export const runtime = "edge";

type RoomWithPrice = BuildingRoom & { price: number | null };

const STATUS = {
  available: {
    label: "Beschikbaar",
    cardBg: "bg-emerald-50",
    cardBorder: "border-emerald-300",
    dot: "bg-emerald-500",
    labelColor: "text-emerald-700",
    statBg: "bg-emerald-50 border-emerald-200",
    statText: "text-emerald-800",
    statDot: "bg-emerald-500",
  },
  reserved: {
    label: "Gereserveerd",
    cardBg: "bg-amber-50",
    cardBorder: "border-amber-300",
    dot: "bg-amber-500",
    labelColor: "text-amber-700",
    statBg: "bg-amber-50 border-amber-200",
    statText: "text-amber-800",
    statDot: "bg-amber-500",
  },
  rented: {
    label: "Verhuurd",
    cardBg: "bg-rose-50",
    cardBorder: "border-rose-300",
    dot: "bg-rose-500",
    labelColor: "text-rose-700",
    statBg: "bg-rose-50 border-rose-200",
    statText: "text-rose-800",
    statDot: "bg-rose-500",
  },
  hidden: {
    label: "Verborgen",
    cardBg: "bg-slate-50",
    cardBorder: "border-slate-200",
    dot: "bg-slate-300",
    labelColor: "text-slate-400",
    statBg: "bg-slate-50 border-slate-200",
    statText: "text-slate-600",
    statDot: "bg-slate-400",
  },
} as const;

function RoomRow({ room }: { room: RoomWithPrice }) {
  const s = STATUS[room.availability_status] ?? STATUS.available;
  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border ${s.cardBg} ${s.cardBorder}`}
      style={{ minWidth: 148 }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
        <span className="font-semibold text-gray-800 text-sm leading-none truncate">
          {room.room_label}
        </span>
      </div>
      {room.price != null && (
        <span className="text-xs font-medium text-gray-500 flex-shrink-0">
          €{room.price}
        </span>
      )}
    </div>
  );
}

function Section({ label, rooms }: { label: string; rooms: RoomWithPrice[] }) {
  if (rooms.length === 0) return null;
  const available = rooms.filter((r) => r.availability_status === "available").length;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
          <span className="text-xs font-bold text-slate-500">{label}</span>
        </div>
        <span className="text-xs text-slate-400">
          {available}/{rooms.length} vrij
        </span>
      </div>
      {rooms.map((r) => (
        <RoomRow key={r.id} room={r} />
      ))}
    </div>
  );
}

function getRoomNumber(label: string): number {
  const n = parseInt(label.split("/").pop() ?? "0", 10);
  return isNaN(n) ? 0 : n;
}

function splitBuilding29(rooms: RoomWithPrice[]) {
  const a: RoomWithPrice[] = [];
  const b: RoomWithPrice[] = [];
  const c: RoomWithPrice[] = [];
  const d: RoomWithPrice[] = [];

  for (const r of rooms) {
    const n = getRoomNumber(r.room_label);
    if (n >= 40) b.push(r);
    else if (n >= 26) c.push(r);
    else if (n >= 22) d.push(r);
    else a.push(r);
  }

  const sort = (arr: RoomWithPrice[]) =>
    arr.sort((x, y) => getRoomNumber(x.room_label) - getRoomNumber(y.room_label));

  return { a: sort(a), b: sort(b), c: sort(c), d: sort(d) };
}

export default async function PublicFloorPlanPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  let tokenValid = false;
  if (searchParams.token) {
    // Check DB tokens first (with expiry)
    try {
      const row = await queryOne(
        "select id from floor_plan_tokens where token = $1 and vestiging_id = $2 and expires_at > datetime('now')",
        [searchParams.token, params.id]
      );
      tokenValid = !!row;
    } catch {
      // Table doesn't exist yet — fall back to env var token
    }
    // Fallback: legacy env var token (no expiry)
    if (!tokenValid && process.env.FLOOR_PLAN_TOKEN) {
      tokenValid = searchParams.token === process.env.FLOOR_PLAN_TOKEN;
    }
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12 text-center max-w-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Geen toegang</h1>
          <p className="text-slate-500 text-sm">Deze pagina is enkel toegankelijk via een geldige link.</p>
        </div>
      </div>
    );
  }

  const vestiging = await queryOne<Vestiging>(
    "SELECT * FROM vestigingen WHERE id = $1",
    [params.id]
  );
  if (!vestiging) notFound();

  const floors = await query<BuildingFloor>(
    "SELECT * FROM building_floors WHERE vestiging_id = $1 ORDER BY order_index",
    [params.id]
  );

  if (floors.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{vestiging.name}</h1>
        <p className="text-gray-400 mt-4">Geen grondplan beschikbaar.</p>
      </div>
    );
  }

  const floorIds = floors.map((f) => f.id);
  const allRooms = await query<RoomWithPrice>(
    `SELECT br.*, k.price
     FROM building_rooms br
     LEFT JOIN koten k ON br.kot_id = k.id
     WHERE br.floor_id IN (${floorIds.map((_, i) => `$${i + 1}`).join(",")})`,
    floorIds
  );

  const roomsByFloor = new Map<string, RoomWithPrice[]>();
  allRooms.forEach((r) => {
    const list = roomsByFloor.get(r.floor_id) ?? [];
    list.push(r);
    roomsByFloor.set(r.floor_id, list);
  });

  const floor29 = floors.find((f) => f.floor_name.includes("29"));
  const floor31 = floors.find((f) => f.floor_name.includes("31"));

  const rooms29 = (floor29 ? (roomsByFloor.get(floor29.id) ?? []) : []).filter(
    (r) => r.availability_status !== "hidden"
  );
  const rooms31 = (floor31 ? (roomsByFloor.get(floor31.id) ?? []) : [])
    .filter((r) => r.availability_status !== "hidden")
    .sort((a, b) => getRoomNumber(a.room_label) - getRoomNumber(b.room_label));

  const { a, b, c, d } = splitBuilding29(rooms29);
  const e = rooms31;

  const visible = [...rooms29, ...rooms31];
  const counts = {
    available: visible.filter((r) => r.availability_status === "available").length,
    reserved: visible.filter((r) => r.availability_status === "reserved").length,
    rented: visible.filter((r) => r.availability_status === "rented").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Kamerstatus · live
              </p>
              <h1 className="text-2xl font-bold text-slate-900">{vestiging.name}</h1>
              <p className="text-slate-400 mt-1 text-sm">
                {vestiging.address}, {vestiging.postal_code} {vestiging.city}
              </p>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Live</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {(["available", "reserved", "rented"] as const).map((s) => (
              <div
                key={s}
                className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${STATUS[s].statBg}`}
              >
                <div className={`w-2 h-2 rounded-full ${STATUS[s].statDot}`} />
                <span className={`font-bold text-sm ${STATUS[s].statText}`}>{counts[s]}</span>
                <span className={`text-xs ${STATUS[s].statText} opacity-80`}>{STATUS[s].label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white">
              <span className="font-bold text-sm text-slate-700">{visible.length}</span>
              <span className="text-xs text-slate-500">Totaal</span>
            </div>
          </div>
        </div>

        {/* Floor plan — 3-column grid: A | B | C/D/E */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-[auto_auto_auto] gap-x-6 items-start w-fit mx-auto">

            {/* Column 1: Section A */}
            <div className="row-span-3">
              <Section label="A" rooms={a} />
            </div>

            {/* Column 2: Section B top, then empty */}
            <div className="flex flex-col gap-4">
              <Section label="B" rooms={b} />
            </div>

            {/* Column 3: C, D, E stacked */}
            <div className="flex flex-col gap-5">
              <Section label="C" rooms={c} />

              {d.length > 0 && (
                <>
                  <div className="border-t border-dashed border-slate-100" />
                  <Section label="D" rooms={d} />
                </>
              )}

              {e.length > 0 && (
                <>
                  <div className="border-t border-dashed border-slate-100" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                      Naamsestraat 31
                    </p>
                    <Section label="E" rooms={e} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 px-1 text-xs text-slate-400">
          {(["available", "reserved", "rented"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${STATUS[s].dot}`} />
              {STATUS[s].label}
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Automatisch bijgewerkt ·{" "}
          {new Date().toLocaleDateString("nl-BE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
