import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/shared/lib/db";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { email, name, phone } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        // Check for existing lead
        const existing = await queryOne("select id from leads where email = $1", [email]);

        if (existing) {
            // Update existing lead (optional: only if name or phone provided)
            await queryOne(
                "update leads set name = coalesce($1, name), phone = coalesce($2, phone) where email = $3 returning id",
                [name || null, phone || null, email]
            );
        } else {
            // Insert new lead
            await queryOne(
                "insert into leads (email, name, phone) values ($1, $2, $3) returning id",
                [email, name || null, phone || null]
            );
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Error saving lead:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

