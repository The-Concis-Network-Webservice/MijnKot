import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../../lib/cms/server";
import { canEditContent } from "../../../../../lib/cms/permissions";
import { rateLimit } from "../../../../../lib/cms/rate-limit";
import { query } from "../../../../../lib/db";
import { logAudit } from "../../../../../lib/audit";

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limit = rateLimit(`koten-bulk:${user.id}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const body = await request.json();
  const { ids, action, availability_status } = body as {
    ids?: string[];
    action?: "publish" | "archive" | "availability";
    availability_status?: string;
  };
  if (!ids || ids.length === 0 || !action) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (action === "availability") {
    if (!availability_status) {
      return NextResponse.json({ error: "Missing availability_status." }, { status: 400 });
    }
    const placeholders = ids.map((_, i) => `$${i + 2}`).join(",");
    await query(
      `update koten set availability_status = $1 where id in (${placeholders})`,
      [availability_status, ...ids]
    );
    await logAudit({
      actorId: user.id,
      action: "bulk-availability",
      entityType: "koten",
      entityId: ids[0],
      changes: { ids, availability_status }
    });
    return NextResponse.json({ success: true });
  }
  if (action === "publish") {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
    await query(
      `update koten set status = 'published', published_at = datetime('now') where id in (${placeholders})`,
      ids
    );
    await logAudit({
      actorId: user.id,
      action: "bulk-publish",
      entityType: "koten",
      entityId: ids[0],
      changes: { ids }
    });
    return NextResponse.json({ success: true });
  }
  if (action === "archive") {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
    await query(
      `update koten set status = 'archived', archived_at = datetime('now') where id in (${placeholders})`,
      ids
    );
    await logAudit({
      actorId: user.id,
      action: "bulk-archive",
      entityType: "koten",
      entityId: ids[0],
      changes: { ids }
    });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}

