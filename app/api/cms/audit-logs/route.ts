import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/cms/server";
import { query } from "../../../../lib/db";
import { canManageVestigingen } from "../../../../lib/cms/permissions";

export async function GET() {
  const { user, role } = await getUserFromRequest();
  if (!user || !canManageVestigingen(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await query(
    "select * from audit_logs order by created_at desc limit 200"
  );
  return NextResponse.json({ data });
}

