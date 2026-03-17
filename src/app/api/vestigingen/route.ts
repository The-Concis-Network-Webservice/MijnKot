import { NextResponse } from "next/server";
import { query } from "@/shared/lib/db";
import type { Vestiging } from "@/types";

export const runtime = 'edge';

export async function GET() {
    try {
        const data = await query<Vestiging>("select * from vestigingen where archived_at is null");
        return NextResponse.json({ data });
    } catch (err) {
        console.error("Error in public vestigingen API:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
