import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { getSession } from "../../../../lib/auth";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Auth check
    const user = await getSession();
    if (!user || user.role === 'viewer') { // Assuming viewer can't see leads? Or maybe they can.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const leads = await query("select * from leads order by created_at desc");
        return NextResponse.json(leads);
    } catch (err) {
        console.error("Error fetching leads:", err);
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }
}
