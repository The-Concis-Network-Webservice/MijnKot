import { NextResponse } from "next/server";
import { execute, queryOne } from "@/shared/lib/db";

export const runtime = 'edge';

export async function GET() {
  try {
    const email = 'plaatsbeschrijvingvanmijnkot@gmail.com';
    const fullName = 'Plaatsbeschrijving';
    // Using the same hash as other admins for now
    const passwordHash = '100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=';
    const role = 'super_admin';

    // Check if exists
    const existing = await queryOne("SELECT id FROM users WHERE email = $1", [email]);
    if (existing) {
      return NextResponse.json({ message: "User already exists", id: existing.id });
    }

    const id = crypto.randomUUID();
    await execute(
      "INSERT INTO users (id, email, full_name, password_hash, role) VALUES ($1, $2, $3, $4, $5)",
      [id, email, fullName, passwordHash, role]
    );

    return NextResponse.json({ message: "User added successfully", id, email });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
