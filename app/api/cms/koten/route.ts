import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getUserFromRequest } from "../../../../lib/cms/server";
import { rateLimit } from "../../../../lib/cms/rate-limit";
import { canEditContent } from "../../../../lib/cms/permissions";
import { query, queryOne } from "../../../../lib/db";
import { logAudit, logAvailabilityChange } from "../../../../lib/audit";

export async function GET(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    const item = await query("select * from koten where id = $1", [id]);
    return NextResponse.json({ data: item });
  }
  const vestigingId = url.searchParams.get("vestiging_id");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");
  let where = "where 1=1";
  const params: Array<string | number> = [];
  if (vestigingId) {
    params.push(vestigingId);
    where += ` and vestiging_id = $${params.length}`;
  }
  if (status) {
    params.push(status);
    where += ` and status = $${params.length}`;
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    where += ` and (lower(title) like $${params.length} or lower(description) like $${params.length})`;
  }
  const data = await query(
    `select * from koten ${where} order by is_highlighted desc, created_at desc`,
    params
  );
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limit = rateLimit(`koten:${user.id}`, 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const body = await request.json();
  const {
    vestiging_id,
    title,
    title_en,
    description,
    description_en,
    price,
    availability_status,
    status,
    scheduled_publish_at,
    is_highlighted
  } = body;
  const scheduledAt =
    scheduled_publish_at ? new Date(scheduled_publish_at).toISOString() : null;
  if (!vestiging_id || !title || !description || price === undefined) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (Number.isNaN(Number(price))) {
    return NextResponse.json({ error: "Invalid price." }, { status: 400 });
  }

  // Validate Max 3 Highlights
  if (is_highlighted) {
    const res = await queryOne<{ count: number }>(
      "select count(*) as count from koten where is_highlighted = 1 and archived_at is null"
    );
    if ((res?.count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Maximum 3 highlights allowed. Please unhighlight another kot first." },
        { status: 400 }
      );
    }
  }

  const inserted = await queryOne(
    "insert into koten (vestiging_id, title, title_en, description, description_en, price, availability_status, status, scheduled_publish_at, is_highlighted) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *",
    [
      vestiging_id,
      title,
      title_en ?? null,
      description,
      description_en ?? null,
      price,
      availability_status,
      status ?? "draft",
      scheduledAt,
      is_highlighted ?? false
    ]
  );
  if (!inserted) {
    return NextResponse.json({ error: "Failed to create kot." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "koten",
    entityId: (inserted as any).id,
    changes: inserted as unknown as Record<string, unknown>
  });
  revalidatePath('/');
  revalidatePath('/koten');
  return NextResponse.json({ data: inserted });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, action } = body as { id?: string; action?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const current = await queryOne<{ availability_status: string }>(
    "select availability_status from koten where id = $1",
    [id]
  );
  if (action === "archive") {
    await query(
      "update koten set status = 'archived', archived_at = datetime('now') where id = $1",
      [id]
    );
    await logAudit({
      actorId: user.id,
      action: "archive",
      entityType: "koten",
      entityId: id
    });
    revalidatePath('/');
    revalidatePath(`/koten/${id}`);
    revalidatePath('/koten');
    return NextResponse.json({ success: true });
  }
  if (action === "publish") {
    await query(
      "update koten set status = 'published', published_at = datetime('now') where id = $1",
      [id]
    );
    await logAudit({
      actorId: user.id,
      action: "publish",
      entityType: "koten",
      entityId: id
    });
    revalidatePath('/');
    revalidatePath(`/koten/${id}`);
    revalidatePath('/koten');
    return NextResponse.json({ success: true });
  }
  if (action === "schedule") {
    const { scheduled_publish_at } = body;
    if (!scheduled_publish_at) {
      return NextResponse.json(
        { error: "scheduled_publish_at is required." },
        { status: 400 }
      );
    }
    await query(
      "update koten set status = 'scheduled', scheduled_publish_at = $1 where id = $2",
      [new Date(scheduled_publish_at).toISOString(), id]
    );
    await logAudit({
      actorId: user.id,
      action: "schedule",
      entityType: "koten",
      entityId: id,
      changes: { scheduled_publish_at }
    });
    revalidatePath('/');
    revalidatePath(`/koten/${id}`);
    revalidatePath('/koten');
    return NextResponse.json({ success: true });
  }
  const {
    title,
    title_en,
    description,
    description_en,
    description_raw,
    description_polished,
    price,
    availability_status,
    status,
    scheduled_publish_at,
    is_highlighted
  } = body;

  // Validate Max 3 Highlights
  if (is_highlighted) {
    const res = await queryOne<{ count: number }>(
      "select count(*) as count from koten where is_highlighted = 1 and archived_at is null and id != $1",
      [id]
    );
    if ((res?.count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Maximum 3 highlights allowed. Please unhighlight another kot first." },
        { status: 400 }
      );
    }
  }

  const updated = await queryOne(
    "update koten set title = $1, title_en = $2, description = $3, description_en = $4, description_raw = $5, description_polished = $6, price = $7, availability_status = $8, status = $9, scheduled_publish_at = $10, is_highlighted = $11 where id = $12 returning *",
    [
      title,
      title_en ?? null,
      description,
      description_en ?? null,
      description_raw ?? null,
      description_polished ?? null,
      price,
      availability_status,
      status,
      scheduled_publish_at ? new Date(scheduled_publish_at).toISOString() : null,
      is_highlighted ?? false,
      id
    ]
  );
  if (!updated) {
    return NextResponse.json({ error: "Failed to update kot." }, { status: 400 });
  }
  if (current && current.availability_status !== availability_status) {
    await logAvailabilityChange({
      kotId: id,
      oldStatus: current.availability_status,
      newStatus: availability_status,
      changedBy: user.id
    });
  }
  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "koten",
    entityId: id,
    changes: updated as unknown as Record<string, unknown>
  });
  revalidatePath('/');
  revalidatePath(`/koten/${id}`);
  revalidatePath('/koten');
  return NextResponse.json({ data: updated });
}
