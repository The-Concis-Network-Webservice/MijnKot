import { siteConfig } from '../lib/config';

interface ResetEmailProps {
    email: string;
    resetUrl: string;
    expiryHours: number;
}

export function generateResetEmailHtml({
    email,
    resetUrl,
    expiryHours,
}: ResetEmailProps): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Wachtwoord herstellen - ${siteConfig.company.name}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #434341; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdfcfb;">
    <div style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e0d5; overflow: hidden; box-shadow: 0 4px 12px rgba(77, 89, 53, 0.08);">
        <div style="background-color: #4d5935; padding: 30px 40px; text-align: left;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Wachtwoord Herstellen</h1>
        </div>
        
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #434341; margin-bottom: 24px;">
                Je hebt een verzoek ingediend om je wachtwoord te herstellen voor het MijnKot admin portaal (${email}).
            </p>
            
            <div style="text-align: center; margin-bottom: 30px; margin-top: 30px;">
                <a href="${resetUrl}" style="background-color: #ca4b1c; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; transition: background-color 0.2s;">
                    Wachtwoord Herstellen
                </a>
            </div>
            
            <p style="font-size: 14px; color: #8B9690; margin-bottom: 24px;">
                Deze link is geldig voor de komende ${expiryHours} uur. Als je dit verzoek niet hebt gedaan, kun je deze e-mail veilig negeren.
            </p>
            
            <div style="padding: 16px; background-color: #fdfcfb; border: 1px dashed #e7e0d5; border-radius: 8px;">
                <p style="font-size: 12px; color: #8B9690; margin: 0; word-break: break-all;">
                    Werkt de knop niet? Kopieer en plak deze link in je browser:<br>
                    <a href="${resetUrl}" style="color: #4d5935;">${resetUrl}</a>
                </p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e7e0d5; text-align: center;">
                <p style="font-size: 12px; color: #8B9690; margin: 0;">
                    &copy; ${new Date().getFullYear()} ${siteConfig.company.name}. Alle rechten voorbehouden.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}
