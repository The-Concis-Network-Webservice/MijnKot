import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canEditContent } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";
import type { BuildingRoom } from "@/types";

export async function GET(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const floorId = url.searchParams.get("floor_id");
  if (!floorId) {
    return NextResponse.json({ error: "floor_id is required" }, { status: 400 });
  }
  const data = await query<BuildingRoom>(
    "select * from building_rooms where floor_id = $1 order by created_at asc",
    [floorId]
  );
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const {
    floor_id, room_label, pos_x = 0, pos_y = 0,
    width = 100, height = 65, location, size_m2,
    availability_status = "available", kot_id,
  } = body;

  if (!floor_id || !room_label) {
    return NextResponse.json({ error: "floor_id and room_label are required" }, { status: 400 });
  }

  const room = await queryOne<BuildingRoom>(
    `insert into building_rooms
       (floor_id, kot_id, room_label, location, size_m2, pos_x, pos_y, width, height, availability_status)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning *`,
    [floor_id, kot_id ?? null, room_label, location ?? null, size_m2 ?? null,
     pos_x, pos_y, width, height, availability_status]
  );

  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "building_room",
    entityId: room?.id ?? "",
    changes: { floor_id, room_label, availability_status },
  });

  revalidatePath("/admin");
  return NextResponse.json({ data: room }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, room_label, pos_x, pos_y, width, height, location, size_m2, availability_status, kot_id } = body;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const existing = await queryOne<BuildingRoom>(
    "select * from building_rooms where id = $1",
    [id]
  );
  if (!existing) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const updated = await queryOne<BuildingRoom>(
    `update building_rooms set
      room_label = $1,
      pos_x = $2,
      pos_y = $3,
      width = $4,
      height = $5,
      location = $6,
      size_m2 = $7,
      availability_status = $8,
      kot_id = $9
     where id = $10
     returning *`,
    [
      room_label ?? existing.room_label,
      pos_x ?? existing.pos_x,
      pos_y ?? existing.pos_y,
      width ?? existing.width,
      height ?? existing.height,
      location !== undefined ? location : existing.location,
      size_m2 !== undefined ? size_m2 : existing.size_m2,
      availability_status ?? existing.availability_status,
      kot_id !== undefined ? kot_id : existing.kot_id,
      id,
    ]
  );

  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "building_room",
    entityId: id,
    changes: { room_label, pos_x, pos_y, availability_status, kot_id },
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

  await query("delete from building_rooms where id = $1", [id]);

  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "building_room",
    entityId: id,
    changes: null,
  });

  revalidatePath("/admin");
  return NextResponse.json({ success: true });
}
