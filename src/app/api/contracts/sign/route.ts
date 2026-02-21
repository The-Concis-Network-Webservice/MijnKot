import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
// Helper to convert ArrayBuffer to Base64 (Standard Web API compatible)
function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function GET(req: NextRequest) {
    const { env } = getRequestContext();
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    if (!env || !env.DB) {
        return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { results } = await env.DB.prepare(
        'SELECT * FROM contracts WHERE token = ?'
    ).bind(token).run();

    if (!results || results.length === 0) {
        return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const contract = results[0];
    return NextResponse.json(contract);
}

export async function POST(req: NextRequest) {
    const { env } = getRequestContext();
    if (!env || !env.DB) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    try {
        const formData = await req.formData();
        const token = formData.get('token') as string;
        const signature = formData.get('signature') as string; // Base64 png
        const pdf = formData.get('pdf') as File;

        if (!token || !signature || !pdf) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // 1. Verify Contract
        const { results } = await env.DB.prepare('SELECT * FROM contracts WHERE token = ?').bind(token).run();
        if (!results || results.length === 0) {
            return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
        }
        const contract = results[0] as any;

        // 2. Storage Strategy (Assuming PDF storage logic discussed locally, skipping for brevity but keeping signature)

        // 3. Send Email via Resend (using fetch to avoid node-streams in Edge)
        const resendApiKey = env?.RESEND_API_KEY || process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error('RESEND_API_KEY not configured');
        } else if (!contract.tenant_email) {
            console.error('No tenant email available');
        } else {
            try {
                const pdfArrayBuffer = await pdf.arrayBuffer();
                const pdfBase64 = arrayBufferToBase64(pdfArrayBuffer);

                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Mijn Kot <noreply@mijnkot.be>', // Ensure this is a verified sender in Resend
                        to: [contract.tenant_email],
                        subject: 'Your Signed Rental Contract',
                        html: `
                            <h1>Contract Signed</h1>
                            <p>Dear ${contract.tenant_first_name},</p>
                            <p>Thank you for signing your contract. Please find the signed PDF attached.</p>
                        `,
                        attachments: [
                            {
                                filename: 'contract.pdf',
                                content: pdfBase64
                            }
                        ]
                    })
                });

                const emailResult = await emailResponse.json();

                if (!emailResponse.ok) {
                    console.error('Failed to send email:', emailResult);
                } else {
                    console.log('Email sent successfully:', emailResult);
                }
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Don't fail the request if email fails, but log it.
            }
        }

        // 4. Update Database
        await env.DB.prepare(`
        UPDATE contracts 
        SET status = 'signed', 
            signature_data = ?, 
            signed_at = datetime('now'),
            signer_ip = ?
        WHERE id = ?
    `).bind(
            signature, // Save signature image data just in case
            req.headers.get('CF-Connecting-IP') || req.headers.get('x-forwarded-for') || 'unknown',
            contract.id
        ).run();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
