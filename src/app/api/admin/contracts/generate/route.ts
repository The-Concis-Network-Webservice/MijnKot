import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function generateToken() {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

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
        const { kot_id, template_id, tenant_first_name, tenant_last_name, tenant_email, kot_data } = body as any;

        if (!kot_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch Template
        let templateContent = '';
        let selectedTemplateId = template_id;

        if (template_id) {
            const { results } = await env.DB.prepare('SELECT content FROM contract_templates WHERE id = ?').bind(template_id).run();
            if (!results || results.length === 0) {
                return NextResponse.json({ error: 'Template not found' }, { status: 404 });
            }
            templateContent = (results[0] as any).content as string;
        } else {
            // Fetch default or first
            const { results } = await env.DB.prepare('SELECT id, content FROM contract_templates ORDER BY is_default DESC, updated_at DESC LIMIT 1').run();
            if (!results || results.length === 0) {
                return NextResponse.json({ error: 'No templates available. Please create one first.' }, { status: 404 });
            }
            templateContent = (results[0] as any).content as string;
            selectedTemplateId = (results[0] as any).id as string;
        }

        // 2. Prepare Data for Replacement
        const placeholderData = {
            tenant_firstname: tenant_first_name || '{{tenant_firstname}}',
            tenant_lastname: tenant_last_name || '{{tenant_lastname}}',
            tenant_email: tenant_email || '{{tenant_email}}',
            kot_address: kot_data?.address || 'Unknown Address',
            price: kot_data?.price || '0',
            start_date: kot_data?.start_date || '...',
            end_date: kot_data?.end_date || '...',
            today_date: new Date().toLocaleDateString(),
            ...kot_data // specific placeholders
        };

        // 3. Generate HTML
        const generatedHtml = replacePlaceholders(templateContent, placeholderData);

        // 4. Generate Token
        const token = generateToken();

        // 5. Create Contract Record
        const result = await env.DB.prepare(`
            INSERT INTO contracts (
                kot_id, template_id, status, 
                tenant_first_name, tenant_last_name, tenant_email, 
                contract_html, token
            ) VALUES (?, ?, 'draft', ?, ?, ?, ?, ?)
        `).bind(
            kot_id, selectedTemplateId, tenant_first_name || null, tenant_last_name || null, tenant_email || null,
            generatedHtml, token
        ).run();

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to create contract record' }, { status: 500 });
        }

        // Get the ID of the inserted contract (D1 doesn't return ID easily in all runtimes, but we can query by token)
        // Actually we can generate ID in JS if we want, but schema says default randomblob.
        // Let's just return success with token.

        return NextResponse.json({ success: true, token, message: 'Contract generated' });

    } catch (error) {
        console.error('Error generating contract:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
