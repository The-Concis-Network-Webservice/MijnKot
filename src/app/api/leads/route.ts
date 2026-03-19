import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/shared/lib/db";
import { sendWelcomeEmail } from "@/shared/lib/email";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { email, name } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        // Insert lead
        await queryOne(
            "insert into leads (email, name) values ($1, $2) returning id",
            [email, name || null]
        );

        // Send email (fire and forget to avoid blocking, or await if critical)
        // Since it's edge, await is safer to ensure completion before shutdown
        if (process.env.RESEND) {
            console.log(`Sending welcome email to lead: ${email}`);
            const emailResult = await sendWelcomeEmail(email, name);
            if (!emailResult.success) {
                console.error('Failed to send welcome email:', emailResult.error);
            } else {
                console.log('Welcome email sent successfully');
            }
        } else {
            console.warn('RESEND API key missing, skipping welcome email for lead');
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Error saving lead:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

