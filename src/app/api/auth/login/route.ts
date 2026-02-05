import { NextResponse } from "next/server";

export const runtime = 'edge';

import { queryOne } from "@/shared/lib/db";
import { createSession, setSessionCookie, verifyPassword } from "@/shared/lib/auth";
import type { UserRole } from "@/types";

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
};

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }
  const user = await queryOne<UserRow>(
    "select id, email, password_hash, role from users where email = $1",
    [email]
  );
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const token = await createSession({
    id: user.id,
    email: user.email,
    role: user.role
  });
  setSessionCookie(token);
  return NextResponse.json({ success: true });
}


