import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/shared/lib/cms/server";
import { query, queryOne } from "@/shared/lib/db";

export const runtime = "edge";

const TOKEN_EXPIRY_DAYS = 90;

function generateToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function GET(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const vestigingId = url.searchParams.get("vestiging_id");
  if (!vestigingId) {
    return NextResponse.json({ error: "vestiging_id is required" }, { status: 400 });
  }

  try {
    // Return existing valid token if not expired
    const existing = await queryOne<{ token: string; expires_at: string }>(
      "select token, expires_at from floor_plan_tokens where vestiging_id = $1 and expires_at > datetime('now') order by created_at desc limit 1",
      [vestigingId]
    );

    if (existing) {
      return NextResponse.json({ token: existing.token, expires_at: existing.expires_at });
    }

    // Generate new token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

    await query(
      "insert into floor_plan_tokens (vestiging_id, token, expires_at) values ($1, $2, $3)",
      [vestigingId, token, expiresAt]
    );

    return NextResponse.json({ token, expires_at: expiresAt });
  } catch {
    // Table doesn't exist yet — fall back to env var token
    const token = process.env.FLOOR_PLAN_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Token not configured" }, { status: 500 });
    }
    return NextResponse.json({ token });
  }
}

// Regenerate token (invalidates old ones by letting them expire naturally)
export async function POST(request: Request) {
  const { user } = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { vestiging_id } = await request.json();
  if (!vestiging_id) {
    return NextResponse.json({ error: "vestiging_id is required" }, { status: 400 });
  }

  // Expire all existing tokens for this vestiging
  await query(
    "update floor_plan_tokens set expires_at = datetime('now') where vestiging_id = $1",
    [vestiging_id]
  );

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await query(
    "insert into floor_plan_tokens (vestiging_id, token, expires_at) values ($1, $2, $3)",
    [vestiging_id, token, expiresAt]
  );

  return NextResponse.json({ token, expires_at: expiresAt });
}
