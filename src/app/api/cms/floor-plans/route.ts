import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canEditContent } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";
import type { BuildingFloor, BuildingRoom } from "@/types";

export async function GET(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const vestigingId = url.searchParams.get("vestiging_id");
  if (!vestigingId) {
    return NextResponse.json({ error: "vestiging_id is required" }, { status: 400 });
  }

  const floors = await query<BuildingFloor>(
    "select * from building_floors where vestiging_id = $1 order by order_index asc, level asc",
    [vestigingId]
  );

  // Eager-load rooms for each floor
  const floorIds = floors.map((f) => f.id);
  let rooms: BuildingRoom[] = [];
  if (floorIds.length > 0) {
    const placeholders = floorIds.map((_, i) => `$${i + 1}`).join(", ");
    rooms = await query<BuildingRoom>(
      `select * from building_rooms where floor_id in (${placeholders}) order by created_at asc`,
      floorIds
    );
  }

  const roomsByFloor = new Map<string, BuildingRoom[]>();
  for (const room of rooms) {
    const list = roomsByFloor.get(room.floor_id) ?? [];
    list.push(room);
    roomsByFloor.set(room.floor_id, list);
  }

  const result = floors.map((f) => ({
    ...f,
    rooms: roomsByFloor.get(f.id) ?? [],
  }));

  return NextResponse.json({ data: result });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { vestiging_id, floor_name, level, order_index } = body;
  if (!vestiging_id || !floor_name || level === undefined) {
    return NextResponse.json({ error: "vestiging_id, floor_name, and level are required" }, { status: 400 });
  }

  const floor = await queryOne<BuildingFloor>(
    `insert into building_floors (vestiging_id, floor_name, level, order_index)
     values ($1, $2, $3, $4)
     returning *`,
    [vestiging_id, floor_name, level, order_index ?? level]
  );

  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "building_floor",
    entityId: floor?.id ?? "",
    changes: { vestiging_id, floor_name, level },
  });

  revalidatePath("/admin");
  return NextResponse.json({ data: floor }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, floor_name, level, order_index } = body;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const existing = await queryOne<BuildingFloor>(
    "select * from building_floors where id = $1",
    [id]
  );
  if (!existing) {
    return NextResponse.json({ error: "Floor not found" }, { status: 404 });
  }

  const updated = await queryOne<BuildingFloor>(
    `update building_floors set
      floor_name = $1,
      level = $2,
      order_index = $3
     where id = $4
     returning *`,
    [
      floor_name ?? existing.floor_name,
      level ?? existing.level,
      order_index ?? existing.order_index,
      id,
    ]
  );

  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "building_floor",
    entityId: id,
    changes: { floor_name, level, order_index },
  });

  revalidatePath("/admin");
  return NextResponse.json({ data: updated });
}

export async function DELETE(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await query("delete from building_floors where id = $1", [id]);

  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "building_floor",
    entityId: id,
    changes: null,
  });

  revalidatePath("/admin");
  return NextResponse.json({ success: true });
}
