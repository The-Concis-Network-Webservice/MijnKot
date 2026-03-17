import { NextResponse } from "next/server";
import { execute } from "@/shared/lib/db";

export const runtime = 'edge';

export async function GET() {
  try {
    const email = 'plaatsbeschrijvingvanmijnkot@gmail.com';
    const newToken = 'MijnKotReset2026';
    const newExpiry = '2026-03-30T12:00:00.000Z'; // 2 more weeks

    await execute(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
      [newToken, newExpiry, email]
    );

    return NextResponse.json({ message: "Token forced successfully", email, newToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
