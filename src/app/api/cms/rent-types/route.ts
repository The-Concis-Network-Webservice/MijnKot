import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canManageVestigingen } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";

export async function GET() {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await query("select * from rent_types order by order_index asc");
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, name_en, slug, order_index } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Missing required fields: name, slug." }, { status: 400 });
  }

  const inserted = await queryOne<any>(
    "insert into rent_types (name, name_en, slug, order_index) values ($1, $2, $3, $4) returning *",
    [name, name_en || null, slug, order_index || 0]
  );

  if (!inserted) {
    return NextResponse.json({ error: "Failed to create rent type." }, { status: 400 });
  }

  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "rent_types",
    entityId: String(inserted.id),
    changes: inserted
  });

  return NextResponse.json({ data: inserted });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, name, name_en, slug, order_index } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const updated = await queryOne<any>(
    "update rent_types set name = $1, name_en = $2, slug = $3, order_index = $4, updated_at = datetime('now') where id = $5 returning *",
    [name, name_en || null, slug, order_index || 0, id]
  );

  if (!updated) {
    return NextResponse.json({ error: "Failed to update rent type." }, { status: 400 });
  }

  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "rent_types",
    entityId: String(id),
    changes: updated
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const deleted = await queryOne<any>(
    "delete from rent_types where id = $1 returning *",
    [id]
  );

  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete rent type." }, { status: 400 });
  }

  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "rent_types",
    entityId: String(id),
    changes: deleted
  });

  return NextResponse.json({ data: deleted });
}
