import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "../../../../lib/cms/server";
import { canEditContent } from "../../../../lib/cms/permissions";
import { rateLimit } from "../../../../lib/cms/rate-limit";
import { query, queryOne } from "../../../../lib/db";
import { logAudit } from "../../../../lib/audit";

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limit = rateLimit(`media:${user.id}`, 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const body = await request.json();
  const { r2_key, public_url, file_name, mime_type, size_bytes, width, height } =
    body;
  if (!r2_key || !public_url || !file_name || !mime_type || !size_bytes) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const inserted = await queryOne(
    "insert into media_assets (r2_key, public_url, file_name, mime_type, size_bytes, width, height, created_by) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *",
    [r2_key, public_url, file_name, mime_type, size_bytes, width ?? null, height ?? null, user.id]
  );
  if (!inserted) {
    return NextResponse.json({ error: "Failed to create media." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "media_assets",
    entityId: (inserted as any).id,
    changes: inserted as unknown as Record<string, unknown>
  });
  return NextResponse.json({ data: inserted });
}

export async function GET() {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await query("select * from media_assets order by created_at desc");
  return NextResponse.json({ data });
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
  const references = await query(
    "select id from kot_photos where media_asset_id = $1",
    [id]
  );
  if (references.length > 0) {
    return NextResponse.json(
      { error: "Media is referenced by kot photos." },
      { status: 400 }
    );
  }
  const deleted = await queryOne(
    "delete from media_assets where id = $1 returning id",
    [id]
  );
  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete media." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "media_assets",
    entityId: id
  });
  return NextResponse.json({ success: true });
}

