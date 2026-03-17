import { NextResponse } from "next/server";
import { getSession, verifyPassword, hashPassword } from "@/shared/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const db = getRequestContext().env.DB;

    // Fetch the user's current password hash
    const user = await db.prepare("SELECT password_hash FROM users WHERE id = ?")
      .bind(session.id)
      .first<{ password_hash: string }>();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Verify current password
    const isCorrect = await verifyPassword(currentPassword, user.password_hash);
    if (!isCorrect) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    // Hash the new password and update
    const newHash = await hashPassword(newPassword);
    
    await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .bind(newHash, session.id)
      .run();

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password. Please try again." },
      { status: 500 }
    );
  }
}
