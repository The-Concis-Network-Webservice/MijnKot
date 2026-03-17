import { NextRequest, NextResponse } from "next/server";
import { query } from "@/shared/lib/db";
import type { Kot } from "@/types";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const vestigingId = searchParams.get("vestiging_id");
        
        let sql = "select * from koten where status = 'published' and archived_at is null";
        const params: any[] = [];
        
        if (vestigingId) {
            sql += " and vestiging_id = $1";
            params.push(vestigingId);
        }
        
        sql += " order by is_highlighted desc, created_at desc";
        
        const data = await query<Kot>(sql, params);
        return NextResponse.json({ data });
    } catch (err) {
        console.error("Error in public koten API:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
