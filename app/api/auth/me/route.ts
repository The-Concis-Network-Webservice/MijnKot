import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { query } from "../../../../lib/db";
import type { UserRole, Vestiging } from "../../../../types";

type AssignmentRow = { vestiging_id: string };

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null, role: null, vestigingen: [] });
  }
  let vestigingen: Vestiging[] = [];
  if (session.role === "super_admin") {
    vestigingen = await query<Vestiging>("select * from vestigingen where archived_at is null");
  } else {
    const assigned = await query<AssignmentRow>(
      "select vestiging_id from user_vestigingen where user_id = $1",
      [session.id]
    );
    if (assigned.length > 0) {
      const ids = assigned.map((row) => row.vestiging_id);
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
      vestigingen = await query<Vestiging>(
        `select * from vestigingen where id in (${placeholders}) and archived_at is null`,
        ids
      );
    }
  }
  return NextResponse.json({
    user: { id: session.id, email: session.email },
    role: session.role as UserRole,
    vestigingen
  });
}

