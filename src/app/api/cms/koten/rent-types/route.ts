import { NextResponse } from "next/server";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canEditContent } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";

// GET /api/cms/koten/rent-types?kot_id=xxx
export async function GET(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const kotId = searchParams.get("kot_id");
  if (!kotId) {
    return NextResponse.json({ error: "Missing kot_id." }, { status: 400 });
  }
  const data = await query<{ rent_type_id: string }>(
    "select rent_type_id from kot_rent_types where kot_id = $1",
    [kotId]
  );
  return NextResponse.json({ data: data.map(r => r.rent_type_id) });
}

// POST { kot_id, rent_type_id } - link
export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { kot_id, rent_type_id } = await request.json();
  if (!kot_id || !rent_type_id) {
    return NextResponse.json({ error: "Missing kot_id or rent_type_id." }, { status: 400 });
  }
  await queryOne(
    "insert or ignore into kot_rent_types (kot_id, rent_type_id) values ($1, $2)",
    [kot_id, rent_type_id]
  );
  await logAudit({
    actorId: user.id,
    action: "link_rent_type",
    entityType: "koten",
    entityId: kot_id,
    changes: { rent_type_id }
  });
  return NextResponse.json({ success: true });
}

// DELETE { kot_id, rent_type_id } - unlink
export async function DELETE(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { kot_id, rent_type_id } = await request.json();
  if (!kot_id || !rent_type_id) {
    return NextResponse.json({ error: "Missing kot_id or rent_type_id." }, { status: 400 });
  }
  await queryOne(
    "delete from kot_rent_types where kot_id = $1 and rent_type_id = $2",
    [kot_id, rent_type_id]
  );
  await logAudit({
    actorId: user.id,
    action: "unlink_rent_type",
    entityType: "koten",
    entityId: kot_id,
    changes: { rent_type_id }
  });
  return NextResponse.json({ success: true });
}
