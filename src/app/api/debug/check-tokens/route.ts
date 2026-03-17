import { NextResponse } from "next/server";
import { query } from "@/shared/lib/db";

export const runtime = 'edge';

export async function GET() {
  try {
    const users = await query("SELECT email, reset_token, reset_token_expiry, password_hash FROM users");
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
