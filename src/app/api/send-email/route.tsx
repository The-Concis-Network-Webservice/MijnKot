import { NextResponse } from 'next/server';
import { generateContactEmailHtml } from '@/shared/emails/contact-template';
import { siteConfig } from '@/shared/lib/config';
<<<<<<< HEAD
=======
import { getSiteSettings } from '@/shared/lib/queries';
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { name, email, message, phone, subject } = payload;

        console.log('Received contact form submission:', { name, email, subject });

        // Basic validation
        if (!name || !email || !message) {
            console.warn('Missing required fields:', { name, email, message: !!message });
            return NextResponse.json(
                { error: 'Naam, email en bericht zijn verplicht.' },
                { status: 400 }
            );
        }

        const html = generateContactEmailHtml({
            name,
            email,
            message,
            phone,
            subject
        });

        if (!process.env.RESEND) {
            console.error('RESEND API key is missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

<<<<<<< HEAD
        const toEmail = process.env.CONTACT_EMAIL || siteConfig.company.contact.email;
=======
        const settings = await getSiteSettings();
        const toEmail = settings.contact_email || process.env.CONTACT_EMAIL || siteConfig.company.contact.email;
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
        console.log(`Sending email to: ${toEmail}`);

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND}`,
            },
            body: JSON.stringify({
                from: `${siteConfig.company.name} Contact <onboarding@resend.dev>`,
                to: [toEmail],
                subject: subject ? `Nieuw bericht: ${subject}` : `Nieuw bericht van ${name} - ${siteConfig.company.name}`,
                html: html,
                reply_to: email,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Resend error:', errorData);
            return NextResponse.json({ error: 'Failed to send email', details: errorData }, { status: res.status });
        }

        const data = await res.json();
        console.log('Email sent successfully:', data);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Server error handling contact form:', error);
        return NextResponse.json(
            { error: 'Er is een fout opgetreden bij het versturen van de email.' },
            { status: 500 }
        );
    }
}
