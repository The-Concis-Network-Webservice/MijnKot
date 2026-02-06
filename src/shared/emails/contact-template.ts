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
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #8FA89A; margin-bottom: 24px;">Nieuw bericht van ${name}</h1>
    <div style="margin-bottom: 24px;">
      <p style="margin: 8px 0;">
        <strong>Onderwerp:</strong> ${subject || 'Contactformulier website'}
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="margin: 8px 0;">
        <strong>Naam:</strong> ${name}
      </p>
      <p style="margin: 8px 0;">
        <strong>Email:</strong> <a href="mailto:${email}" style="color: #8FA89A; text-decoration: none;">${email}</a>
      </p>
      ${phone ? `<p style="margin: 8px 0;"><strong>Telefoon:</strong> ${phone}</p>` : ''}
    </div>
    
    <div style="margin-top: 24px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <strong style="display: block; margin-bottom: 12px;">Bericht:</strong>
      <p style="white-space: pre-wrap; margin: 0;">${message}</p>
    </div>
    
    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
    
    <p style="font-size: 12px; color: #888; text-align: center;">
      Dit bericht is verzonden via het contactformulier op Mijn-Kot.be.
    </p>
</body>
</html>
  `;
}
