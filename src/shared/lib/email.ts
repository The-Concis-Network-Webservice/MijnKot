import { siteConfig } from './config';

export async function sendWelcomeEmail(email: string, name?: string) {
    const apiKey = process.env.RESEND;

    if (!apiKey) {
        console.warn("Resend API key missing, skipping email.");
        return { success: false, error: "Missing API key" };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: `${siteConfig.company.name} <onboarding@resend.dev>`, // Update this if you have a verified domain
                to: [email],
                subject: `Welkom bij ${siteConfig.company.name}! 🏠`,
                html: `
<<<<<<< HEAD
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welkom ${name ? name : ''}!</h1>
            <p>Bedankt voor je interesse in ${siteConfig.company.name}.</p>
            <p>We hebben je aanmelding goed ontvangen. Je bent nu als eerste op de hoogte van nieuwe koten.</p>
            <br/>
            <p>Met vriendelijke groeten,</p>
            <p>Het ${siteConfig.company.name} Team</p>
          </div>
=======
<body style="font-family: sans-serif; line-height: 1.6; color: #434341; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdfcfb;">
            <div style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e0d5; overflow: hidden; box-shadow: 0 4px 12px rgba(77, 89, 53, 0.08);">
                <div style="background-color: #4d5935; padding: 30px 40px; text-align: left;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Welkom ${name ? name : ''}!</h1>
                </div>
                
                <div style="padding: 40px;">
                    <p style="font-size: 16px; margin-bottom: 24px;">Bedankt voor je interesse in ${siteConfig.company.name}.</p>
                    
                    <div style="margin: 24px 0; padding: 24px; background-color: #e7e0d5; border-radius: 12px; border-left: 4px solid #4d5935;">
                        <p style="margin: 0; font-size: 16px; font-weight: 500; color: #4d5935;">
                            We hebben je aanmelding goed ontvangen. Je bent nu als eerste op de hoogte van nieuwe koten in ons aanbod.
                        </p>
                    </div>
                    
                    <p style="font-size: 16px;">Zodra er een kamer beschikbaar komt die matcht met jouw wensen, sturen we je direct een berichtje.</p>
                    
                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e7e0d5;">
                        <p style="margin: 0; font-size: 15px;">Met vriendelijke groeten,</p>
                        <p style="margin: 4px 0; font-weight: bold; color: #4d5935; font-size: 16px;">Het ${siteConfig.company.name} Team</p>
                    </div>
                </div>
            </div>
          </body>
>>>>>>> 62bca002805acc84314a797b4a0f682491dc3707
        `,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Resend API Error:", errorData);
            return { success: false, error: errorData };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error };
    }
}
