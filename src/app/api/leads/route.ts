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

        // Check for existing lead
        const existingLead = await queryOne(
            "select id, name from leads where email = $1",
            [email]
        );

        if (existingLead) {
            console.log(`Lead already exists for email: ${email}. Updating name if provided.`);
            
            // Only update name if a new one is provided
            if (name) {
                await queryOne(
                    "update leads set name = $1 where email = $2",
                    [name, email]
                );
            }
            
            return NextResponse.json({ success: true, message: "Lead updated" });
        }

        // Insert new lead
        await queryOne(
            "insert into leads (email, name) values ($1, $2) returning id",
            [email, name || null]
        );

        // Send welcome email only for first-time signups
        if (process.env.RESEND) {
            console.log(`Sending welcome email to new lead: ${email}`);
            const emailResult = await sendWelcomeEmail(email, name);
            if (!emailResult.success) {
                console.error('Failed to send welcome email:', emailResult.error);
            } else {
                console.log('Welcome email sent successfully');
            }
        } else {
            console.warn('RESEND API key missing, skipping welcome email for new lead');
        }

        return NextResponse.json({ success: true, message: "Lead created" });
    } catch (err: any) {
        console.error("Error processing lead:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

