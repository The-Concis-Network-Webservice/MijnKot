import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "@/shared/lib/cms/server";
import { query } from "@/shared/lib/db";
import { canManageVestigingen } from "@/shared/lib/cms/permissions";

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


