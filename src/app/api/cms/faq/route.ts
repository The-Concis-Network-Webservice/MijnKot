import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canEditContent } from "@/shared/lib/cms/permissions";
import { query, queryOne } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";

export async function GET() {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await query(
    "select * from faq_items order by category asc, order_index asc"
  );
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { question, answer, category, order_index } = body;
  if (!question || !answer || !category) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const inserted = await queryOne<any>(
    "insert into faq_items (question, answer, category, order_index) values ($1, $2, $3, $4) returning *",
    [question, answer, category, order_index ?? 0]
  );
  if (!inserted) {
    return NextResponse.json({ error: "Failed to create FAQ." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "faq_items",
    entityId: String(inserted.id),
    changes: inserted
  });
  return NextResponse.json({ data: inserted });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, question, answer, category, order_index } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const updated = await queryOne<any>(
    "update faq_items set question = $1, answer = $2, category = $3, order_index = $4 where id = $5 returning *",
    [question, answer, category, order_index ?? 0, id]
  );
  if (!updated) {
    return NextResponse.json({ error: "Failed to update FAQ." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "faq_items",
    entityId: String(id),
    changes: updated
  });
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
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const deleted = await queryOne(
    "delete from faq_items where id = $1 returning id",
    [id]
  );
  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete FAQ." }, { status: 400 });
  }
  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "faq_items",
    entityId: String(id)
  });
  return NextResponse.json({ success: true });
}


