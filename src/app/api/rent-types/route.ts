import { NextResponse } from "next/server";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { query } from "@/shared/lib/db";

export async function GET() {
  const data = await query("select id, name, name_en, slug, order_index from rent_types order by order_index asc, name asc");
  return NextResponse.json({ data });
}
