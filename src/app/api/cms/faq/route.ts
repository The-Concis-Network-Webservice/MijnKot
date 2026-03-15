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
  const { question, question_en, answer, answer_en, category, category_en, order_index } = body;
  if (!question || !answer || !category) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const inserted = await queryOne<any>(
    "insert into faq_items (question, question_en, answer, answer_en, category, category_en, order_index) values ($1, $2, $3, $4, $5, $6, $7) returning *",
    [question, question_en, answer, answer_en, category, category_en, order_index ?? 0]
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

  try {
    const body = await request.json();
    const { id, question, question_en, answer, answer_en, category, category_en, order_index } = body;
    
    console.log("FAQ PATCH request:", { id, question, category, category_en, order_index });

    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const updated = await queryOne<any>(
      "update faq_items set question = $1, question_en = $2, answer = $3, answer_en = $4, category = $5, category_en = $6, order_index = $7 where id = $8 returning *",
      [question, question_en, answer, answer_en, category, category_en, order_index ?? 0, id]
    );
    
    if (!updated) {
       console.error("FAQ Update failed: No row updated for ID", id);
       return NextResponse.json({ error: "Failed to update FAQ (no row matches ID)." }, { status: 400 });
    }

    console.log("FAQ Updated successfully:", updated.id);
    
    await logAudit({
      actorId: user.id,
      action: "update",
      entityType: "faq_items",
      entityId: String(id),
      changes: updated
    });
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("FAQ Update crash:", err);
    return NextResponse.json({ error: "Database error during FAQ update." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, category } = body;
    
    if (category) {
      console.log("FAQ Category DELETE request:", category);
      await query(
        "delete from faq_items where category = $1",
        [category]
      );
      
      await logAudit({
        actorId: user.id,
        action: "delete_category",
        entityType: "faq_items",
        entityId: category,
        changes: { category }
      });
      
      return NextResponse.json({ success: true, deletedCategory: category });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id or category." }, { status: 400 });
    }

    console.log("FAQ DELETE request:", id);
    const deleted = await queryOne<{id: string}>(
      "delete from faq_items where id = $1 returning id",
      [id]
    );

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete FAQ (not found)." }, { status: 400 });
    }

    await logAudit({
      actorId: user.id,
      action: "delete",
      entityType: "faq_items",
      entityId: String(id)
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FAQ Delete crash:", err);
    return NextResponse.json({ error: "Database error during FAQ deletion." }, { status: 500 });
  }
}


