import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { rateLimit } from "@/shared/lib/cms/rate-limit";
import { canManageVestigingen } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";

export async function GET(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    const item = await queryOne(
      "select * from vestigingen where id = $1",
      [id]
    );
    return NextResponse.json({ data: item, role });
  }
  const data = await query("select * from vestigingen where archived_at is null");
  return NextResponse.json({ data, role });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limit = rateLimit(`vestigingen:${user.id}`, 15, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const body = await request.json();
  const { name, address, city, postal_code, description, image_url } = body;
  if (!name || !address || !city || !postal_code || !description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const inserted = await queryOne(
    "insert into vestigingen (name, address, city, postal_code, description, image_url) values ($1, $2, $3, $4, $5, $6) returning *",
    [name, address, city, postal_code, description, image_url ?? null]
  );
  if (!inserted) {
    return NextResponse.json({ error: "Failed to create vestiging." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "vestigingen",
    entityId: (inserted as any).id,
    changes: inserted as unknown as Record<string, unknown>
  });
  revalidatePath('/');
  revalidatePath('/vestigingen');
  return NextResponse.json({ data: inserted });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, name, address, city, postal_code, description, archived_at, image_url } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const updated = await queryOne(
    "update vestigingen set name = $1, address = $2, city = $3, postal_code = $4, description = $5, image_url = $6, archived_at = $7 where id = $8 returning *",
    [name, address, city, postal_code, description, image_url ?? null, archived_at ?? null, id]
  );
  if (!updated) {
    return NextResponse.json({ error: "Failed to update vestiging." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "vestigingen",
    entityId: (updated as any).id,
    changes: updated as unknown as Record<string, unknown>
  });
  revalidatePath('/');
  revalidatePath('/vestigingen');
  return NextResponse.json({ data: updated });
}

export async function DELETE(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const deleted = await queryOne("delete from vestigingen where id = $1 returning id", [id]);
  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete vestiging." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "vestigingen",
    entityId: id
  });
  revalidatePath('/');
  revalidatePath('/vestigingen');
  return NextResponse.json({ success: true });
}


