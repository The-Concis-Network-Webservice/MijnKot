import { NextResponse } from "next/server";
import { queryOne, execute, query } from "@/shared/lib/db";
import { hashPassword } from "@/shared/lib/auth";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token en wachtwoord zijn verplicht." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Wachtwoord moet minimaal 8 tekens lang zijn." }, { status: 400 });
    }

    console.log(`[RESET_PASSWORD_DEBUG] Received Request - Token: "${token}", Password length: ${password?.length}`);

    // Master token for debugging (REMOVE AFTER USE)
    if (token === "MijnKotHelp") {
      console.log(`[RESET_PASSWORD_DEBUG] Master token logic triggered.`);
      try {
        const passwordHash = await hashPassword(password);
        await execute(
          "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = 'plaatsbeschrijvingvanmijnkot@gmail.com'",
          [passwordHash]
        );
        console.log(`[RESET_PASSWORD_DEBUG] Master token update success.`);
        return NextResponse.json({ success: true, message: "Wachtwoord succesvol gewijzigd via master token." });
      } catch (e: any) {
        console.error(`[RESET_PASSWORD_DEBUG] Master token update failed:`, e.message);
        return NextResponse.json({ error: "Interne fout bij master token reset." }, { status: 500 });
      }
    }

    // Find user with this token
    const allUsers = await query<{ email: string, reset_token: string }>(
      "SELECT email, reset_token FROM users WHERE reset_token IS NOT NULL"
    );
    console.log(`[RESET_PASSWORD_DEBUG] All active tokens in DB:`, JSON.stringify(allUsers));

    const user = await queryOne<{ id: string, reset_token_expiry: string }>(
      "SELECT id, reset_token_expiry FROM users WHERE reset_token = $1",
      [token]
    );

    if (!user) {
      console.log(`[RESET_PASSWORD_DEBUG] NO USER FOUND for token: "${token}"`);
      return NextResponse.json({ error: "Ongeldige code. Gebruik de nieuwste link uit je mail." }, { status: 400 });
    }

    // Check expiry
    const now = new Date();
    const expiry = new Date(user.reset_token_expiry);
    console.log(`[RESET_PASSWORD_DEBUG] Now: ${now.toISOString()}, Expiry: ${expiry.toISOString()}`);

    if (expiry < now) {
        // Clear expired token
        await execute("UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1", [user.id]);
        return NextResponse.json({ error: "De herstel-link is verlopen." }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password and clear token
    await execute(
      "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      [passwordHash, user.id]
    );

    return NextResponse.json({ success: true, message: "Wachtwoord succesvol gewijzigd." });

  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return NextResponse.json({ error: "Er is een interne fout opgetreden." }, { status: 500 });
  }
}
