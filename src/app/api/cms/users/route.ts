import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canManageUsers } from "@/shared/lib/cms/permissions";
import { query } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";

export async function GET(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageUsers(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await query("select id, email, full_name, role, created_at from users order by created_at desc");
  const assignments = await query("select user_id, vestiging_id from user_vestigingen");
  return NextResponse.json({ profiles: users, assignments });
}

export async function PATCH(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageUsers(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, role: nextRole, vestigingIds } = body as {
    id?: string;
    role?: string;
    vestigingIds?: string[];
  };
  if (!id || !nextRole) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  await query("update users set role = $1 where id = $2", [nextRole, id]);
  if (vestigingIds) {
    await query("delete from user_vestigingen where user_id = $1", [id]);
    if (vestigingIds.length > 0) {
      for (const vestigingId of vestigingIds) {
        await query(
          "insert into user_vestigingen (user_id, vestiging_id) values ($1, $2)",
          [id, vestigingId]
        );
      }
    }
  }
  await logAudit({
    actorId: user.id,
    action: "update",
    entityType: "users",
    entityId: id,
    changes: { role: nextRole, vestigingIds }
  });
  return NextResponse.json({ success: true });
}


