import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { env } = getRequestContext();
    if (!env || !env.DB) {
        return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    try {
        const { results } = await env.DB.prepare(
            'SELECT * FROM contract_templates ORDER BY updated_at DESC'
        ).run();

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { env } = getRequestContext();
    if (!env || !env.DB) {
        return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    try {
        const data = await req.json();
        const { name, content, is_default } = data as any;

        if (!name || !content) {
            return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
        }

        if (is_default) {
            // Unset other defaults if this one is set to default
            await env.DB.prepare('UPDATE contract_templates SET is_default = false WHERE is_default = true').run();
        }

        const { success } = await env.DB.prepare(
            'INSERT INTO contract_templates (name, content, is_default) VALUES (?, ?, ?)'
        ).bind(name, content, is_default === true).run();

        if (!success) {
            return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Template created' });

    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
