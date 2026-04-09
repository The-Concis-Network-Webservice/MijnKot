import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { canManageUsers } from "@/shared/lib/cms/permissions";
import { query } from "@/shared/lib/db";
import { logAudit } from "@/shared/lib/audit";
import { hashPassword } from "@/shared/lib/auth";

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

export async function POST(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageUsers(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, password, full_name, role: nextRole } = await request.json();

  if (!email || !password || !nextRole) {
    return NextResponse.json({ error: "Email, password and role are required." }, { status: 400 });
  }

  // Check if user exists
  const existing = await query("select id from users where email = $1", [email]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "User already exists with this email." }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);
  const id = crypto.randomUUID();

  await query(
    "insert into users (id, email, password_hash, full_name, role) values ($1, $2, $3, $4, $5)",
    [id, email, hashedPassword, full_name, nextRole]
  );

  await logAudit({
    actorId: user.id,
    action: "create",
    entityType: "users",
    entityId: id,
    changes: { email, role: nextRole, full_name }
  });

  return NextResponse.json({ id, success: true });
}

export async function DELETE(request: Request) {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageUsers(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required." }, { status: 400 });
  }

  if (id === user.id) {
    return NextResponse.json({ error: "You cannot delete yourself." }, { status: 400 });
  }

  await query("delete from user_vestigingen where user_id = $1", [id]);
  await query("delete from users where id = $1", [id]);

  await logAudit({
    actorId: user.id,
    action: "delete",
    entityType: "users",
    entityId: id
  });

  return NextResponse.json({ success: true });
}


