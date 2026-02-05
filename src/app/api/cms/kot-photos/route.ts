import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canEditContent } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";

export async function GET(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const kotId = url.searchParams.get("kot_id");
  if (!kotId) {
    return NextResponse.json({ error: "Missing kot_id." }, { status: 400 });
  }
  const data = await query(
    "select * from kot_photos where kot_id = $1 order by order_index asc",
    [kotId]
  );
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { kot_id, image_url, order_index, media_asset_id } = body;
  if (!kot_id || !image_url) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const inserted = await queryOne(
    "insert into kot_photos (kot_id, image_url, order_index, media_asset_id) values ($1, $2, $3, $4) returning *",
    [kot_id, image_url, order_index ?? 0, media_asset_id ?? null]
  );
  if (!inserted) {
    return NextResponse.json({ error: "Failed to add photo." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "kot_photos",
    entityId: (inserted as any).id,
    changes: inserted as unknown as Record<string, unknown>
  });
  return NextResponse.json({ data: inserted });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, order_index } = body;
  if (!id || order_index === undefined) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const updated = await queryOne(
    "update kot_photos set order_index = $1 where id = $2 returning *",
    [order_index, id]
  );
  if (!updated) {
    return NextResponse.json({ error: "Failed to update photo." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "kot_photos",
    entityId: id,
    changes: updated
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const deleted = await queryOne(
    "delete from kot_photos where id = $1 returning id",
    [id]
  );
  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete photo." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "kot_photos",
    entityId: id
  });
  return NextResponse.json({ success: true });
}


