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
                from: 'Mijn-Kot <onboarding@resend.dev>', // Update this if you have a verified domain
                to: [email],
                subject: 'Welkom bij Mijn-Kot! 🏠',
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welkom ${name ? name : ''}!</h1>
            <p>Bedankt voor je interesse in Mijn-Kot.</p>
            <p>We hebben je aanmelding goed ontvangen. Je bent nu als eerste op de hoogte van nieuwe koten.</p>
            <br/>
            <p>Met vriendelijke groeten,</p>
            <p>Het Mijn-Kot Team</p>
          </div>
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
