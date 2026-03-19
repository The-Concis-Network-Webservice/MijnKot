import { siteConfig } from '../lib/config';

interface ContactEmailProps {
    name: string;
    email: string;
    message: string;
    phone?: string;
    subject?: string;
}

export function generateContactEmailHtml({
    name,
    email,
    message,
    phone,
    subject,
}: ContactEmailProps): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject || 'Contactformulier website'}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #434341; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdfcfb;">
    <div style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e0d5; overflow: hidden; box-shadow: 0 4px 12px rgba(77, 89, 53, 0.08);">
        <div style="background-color: #4d5935; padding: 30px 40px; text-align: left;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Nieuw bericht van ${name}</h1>
        </div>
        
        <div style="padding: 40px;">
            <div style="margin-bottom: 30px;">
                <p style="margin: 10px 0; font-size: 15px;">
                    <strong style="color: #4d5935; width: 100px; display: inline-block;">Onderwerp:</strong> 
                    <span style="color: #434341;">${subject || 'Contactformulier website'}</span>
                </p>
                <p style="margin: 10px 0; font-size: 15px;">
                    <strong style="color: #4d5935; width: 100px; display: inline-block;">Naam:</strong> 
                    <span style="color: #434341;">${name}</span>
                </p>
                <p style="margin: 10px 0; font-size: 15px;">
                    <strong style="color: #4d5935; width: 100px; display: inline-block;">Email:</strong> 
                    <a href="mailto:${email}" style="color: #ca4b1c; text-decoration: none; font-weight: 600;">${email}</a>
                </p>
                ${phone ? `<p style="margin: 10px 0; font-size: 15px;"><strong style="color: #4d5935; width: 100px; display: inline-block;">Telefoon:</strong> <span style="color: #434341;">${phone}</span></p>` : ''}
            </div>
            
            <div style="padding: 24px; background-color: #e7e0d5; border-radius: 12px; border-left: 4px solid #4d5935;">
                <strong style="display: block; margin-bottom: 12px; color: #4d5935; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Bericht:</strong>
                <p style="white-space: pre-wrap; margin: 0; font-size: 16px; line-height: 1.6; color: #434341;">${message}</p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e7e0d5; text-align: center;">
                <p style="font-size: 12px; color: #8B9690; margin: 0;">
                    Dit bericht is verzonden via het contactformulier op <a href="${siteConfig.company.url}" style="color: #4d5935; text-decoration: none; font-weight: 600;">${siteConfig.company.url.replace('https://', '')}</a>.
                </p>
            </div>
        </div>
    </div>
    
    <div style="margin-top: 24px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <strong style="display: block; margin-bottom: 12px;">Bericht:</strong>
      <p style="white-space: pre-wrap; margin: 0;">${message}</p>
    </div>
    
    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
    
    <p style="font-size: 12px; color: #888; text-align: center;">
      Dit bericht is verzonden via het contactformulier op ${siteConfig.company.url.replace('https://', '')}.
    </p>
</body>
</html>
  `;
}
