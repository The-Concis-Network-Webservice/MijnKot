import { NextResponse } from "next/server";
import { queryOne, execute } from "@/shared/lib/db";
import { generateResetEmailHtml } from "@/shared/emails/reset-template";
import { siteConfig } from "@/shared/lib/config";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { email: rawEmail } = await request.json();
    const email = rawEmail?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is verplicht." }, { status: 400 });
    }

    console.log(`[FORGOT_PASSWORD_DEBUG] Starting request for: ${email}`);

    // Check if user exists
    const user = await queryOne<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    console.log(`[FORGOT_PASSWORD_DEBUG] User lookup result:`, user ? 'Found' : 'Not Found');

    // Security: Don't reveal if user exists or not
    if (!user) {
      console.log(`[FORGOT_PASSWORD] User not found: ${email}`);
      return NextResponse.json({ success: true, message: "Als dit account bestaat, is er een herstel-email verzonden." });
    }

    // Generate token (32 chars hex)
    const token = crypto.randomUUID().replace(/-/g, '');
    const expiryDate = new Date(Date.now() + 3600000 * 24); // 24 hours from now
    const expiry = expiryDate.toISOString();

    // Store token
    await execute(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
      [token, expiry, user.id]
    );
    console.log(`[FORGOT_PASSWORD_DEBUG] Token stored successfully.`);

    // Send email
    const resetUrl = `${new URL(request.url).origin}/admin/reset-password?token=${token}`;
    console.log(`[FORGOT_PASSWORD_DEBUG] Reset URL generated: ${resetUrl}`);
    const html = generateResetEmailHtml({
      email,
      resetUrl,
      expiryHours: 24
    });

    if (!process.env.RESEND) {
        console.error('RESEND API key is missing');
        return NextResponse.json({ error: 'Server configuratiefout' }, { status: 500 });
    }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND}`,
            },
            body: JSON.stringify({
                from: `${siteConfig.company.name} Admin <onboarding@resend.dev>`,
                to: [email],
                subject: `Wachtwoord herstellen - ${siteConfig.company.name}`,
                html: html,
            }),
        });

        console.log(`[FORGOT_PASSWORD_DEBUG] Resend status: ${res.status}`);

        if (!res.ok) {
            const errorData = await res.json();
            console.error('[FORGOT_PASSWORD_DEBUG] Resend error details:', JSON.stringify(errorData));
            
            return NextResponse.json({ 
                error: 'Fout bij verzenden email via de mailservice.', 
                details: errorData 
            }, { status: 500 });
        }

    return NextResponse.json({ success: true, message: "Herstel-email verzonden." });

  } catch (error: any) {
    console.error('[FORGOT_PASSWORD_CRITICAL_ERROR]', error.message || error);
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ 
      error: "Er is een interne fout opgetreden.", 
      message: error.message || "Onbekende fout" 
    }, { status: 500 });
  }
}
