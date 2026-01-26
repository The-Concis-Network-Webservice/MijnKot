# R2 Upload Troubleshooting

## Het Probleem
De R2 credentials worden herkend (juiste lengtes), maar we krijgen nog steeds signature errors.

## Mogelijke Oorzaken

### 1. **API Token Permissions**
Het token heeft mogelijk niet de juiste permissies. Controleer:

In Cloudflare Dashboard → R2 → Manage R2 API Tokens:
- Zoek je token (of maak een nieuwe)
- **Permissions** moet zijn: **Object Read & Write**
- **Buckets** moet `media-kine` bevatten (of "All buckets")

### 2. **Bucket Naam**
De bucket naam moet **exact** kloppen (case-sensitive):
- Ga naar R2 → Buckets
- Controleer of de bucket heet: `media-kine`
- Let op hoofdletters/kleine letters!

### 3. **Account ID**
Controleer je Account ID:
- Staat rechtsbovenin je Cloudflare dashboard
- Of in de URL: `dash.cloudflare.com/YOUR_ACCOUNT_ID/r2`

### 4. **Token is Verlopen**
Als je token een TTL (Time To Live) had:
- Maak een nieuw token aan
- Kies "Forever" of een langere TTL

##  Alternatieve Oplossing: Via Wrangler

Als de S3 API blijft falen, kunnen we Wrangler gebruiken (Cloudflare's CLI tool):

### Optie A: Upload via Wrangler
```powershell
# Installeer wrangler
npm install -g wrangler

# Login
wrangler login

# Upload een testbestand
wrangler r2 object put media-kine/test.txt --file=package.json

# Als dit werkt, kunnen we een script maken dat alle foto's upload via wrangler
```

### Optie B: Direct via Dashboard
1. Ga naar R2 → Buckets → media-kine
2. Klik "Upload"
3. Upload de foto's uit `scripts/kot1/` en `scripts/kot2/`
4. We kunnen dan de URLs in de database zetten

## Aanbevolen Actie

**Stap 1**: Maak  een NIEUW R2 API token aan:
1. Ga naar R2 → Manage R2 API Tokens
2. Klik "Create API Token"
3. Name: `KotWebsite-Test`
4. **Permissions**: `Object Read & Write`
5. **Buckets**: Selecteer `media-kine` OF kies "Apply to all buckets"
6. **TTL**: `Forever`
7. Klik "Create"

**Stap 2**: Kopieer BEIDE credentials:
- Access Key ID (32 chars)
- Secret Access Key (64 chars) - **volledig kopiëren!**

**Stap 3**: Update `.env.local`:
```env
R2_ACCESS_KEY_ID=<nieuwe_32_char_key>
R2_SECRET_ACCESS_KEY=<nieuwe_64_char_secret>
```

**Stap 4**: Test opnieuw:
```powershell
node scripts/test-r2-simple.js
```

Als dit nog steeds faalt, laat me dan weten en we gebruiken Wrangler als alternatief!
