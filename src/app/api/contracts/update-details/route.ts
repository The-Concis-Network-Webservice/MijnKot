import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function replacePlaceholders(template: string, data: Record<string, string>) {
    let content = template;
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
    }
    return content;
}

export async function POST(req: NextRequest) {
    const { env } = getRequestContext();
    if (!env || !env.DB) {
        return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { token, tenant_first_name, tenant_last_name, tenant_email } = body as any;

        if (!token || !tenant_first_name || !tenant_last_name || !tenant_email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch Contract
        const { results } = await env.DB.prepare('SELECT * FROM contracts WHERE token = ?').bind(token).run();
        if (!results || results.length === 0) {
            return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
        }
        const contract = results[0] as any;

        if (contract.status !== 'draft') {
            return NextResponse.json({ error: 'Contract cannot be updated' }, { status: 400 });
        }

        // 2. Fetch Template Source (to re-render with new names)
        // We need to re-fetch the template content because the current contract_html has placeholders
        // OR we can just replace placeholders in the existing contract_html if they are still there.
        // Assuming the contract_html stored in DB still has {{tenant_firstname}} etc.

        let currentHtml = contract.contract_html;

        // Re-replace placeholders with new data
        const placeholderData = {
            tenant_firstname: tenant_first_name,
            tenant_lastname: tenant_last_name,
            tenant_email: tenant_email,
        };

        const updatedHtml = replacePlaceholders(currentHtml, placeholderData);

        // 3. Update Contract
        const result = await env.DB.prepare(`
            UPDATE contracts 
            SET tenant_first_name = ?, tenant_last_name = ?, tenant_email = ?, contract_html = ?
            WHERE token = ?
        `).bind(
            tenant_first_name, tenant_last_name, tenant_email, updatedHtml, token
        ).run();

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to update contract' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Contract updated' });

    } catch (error) {
        console.error('Error updating contract:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
