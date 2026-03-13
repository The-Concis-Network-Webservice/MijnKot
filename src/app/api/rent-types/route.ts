import { NextResponse } from "next/server";

export const runtime = 'edge';

import { query } from "@/shared/lib/db";

export async function GET() {
  try {
    const data = await query("select * from rent_types order by order_index asc");
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch rent types:", error);
    return NextResponse.json({ error: "Failed to fetch rent types" }, { status: 500 });
  }
}
