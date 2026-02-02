import { NextResponse } from "next/server";

export const runtime = 'edge';

import { clearSessionCookie } from "../../../../lib/auth";

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ success: true });
}

