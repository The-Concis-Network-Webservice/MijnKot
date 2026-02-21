INSERT INTO contract_templates (name, content, is_default) VALUES (
    'Standard Contract',
    '<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; line-height: 1.6; color: #333; }
  h1 { color: #2c3e50; }
  .section { margin-bottom: 20px; }
  .field { font-weight: bold; }
</style>
</head>
<body>
  <h1>Huurcontract Kot</h1>
  
  <div class="section">
    <p>Dit contract is opgesteld tussen:</p>
    <p><strong>Verhuurder:</strong> Mijn Kot ({{kot_address}})</p>
    <p><strong>Huurder:</strong> <span class="field">{{tenant_firstname}} {{tenant_lastname}}</span> ({{tenant_email}})</p>
  </div>

  <div class="section">
    <h2>Details</h2>
    <p><strong>Startdatum:</strong> {{start_date}}</p>
    <p><strong>Einddatum:</strong> {{end_date}}</p>
    <p><strong>Huurprijs:</strong> €{{price}} per maand</p>
  </div>

  <div class="section">
    <h2>Voorwaarden</h2>
    <p>De huurder gaat akkoord met het huishoudelijk reglement.</p>
  </div>

  <div class="section">
    <p>Opgemaakt te Gent op {{today_date}}.</p>
  </div>
</body>
</html>',
    true
);
