# Cloudflare R2 Setup Instructies

## Het Probleem
We krijgen een signature error bij het uploaden naar R2. Dit komt meestal door één van deze redenen:

## Mogelijke Oplossingen

### 1. **Controleer je R2 API Token**

In Cloudflare dashboard:
1. Ga naar **R2** > **Overview**
2. Klik op **Manage R2 API Tokens**
3. Maak een nieuwe API token aan met:
   - **Permissions**: `Object Read & Write` 
   - **TTL**: Kies een geschikte verloopdatum
   - **Buckets**: Selecteer je `media-kine` bucket (of "All buckets")

4. **Belangrijk**: Kopieer de gegenereerde credentials:
   - `Access Key ID` (ongeveer 32 karakters)
   - `Secret Access Key` (ongeveer 64 karakters)

### 2. **Controleer je Account ID**

Je Account ID vind je in:
- Cloudflare Dashboard → R2 → rechterbovenhoek
- Of in de URL wanneer je in R2 bent: `https://dash.cloudflare.com/<ACCOUNT_ID>/r2`

### 3. **Controleer je Bucket Naam**

Bucket naam moet **exact** overeenkomen (case-sensitive):
- In je `.env.local`: `R2_BUCKET=media-kine`
- In Cloudflare R2 dashboard controleren of de bucket zo heet

### 4. **Controleer je Public URL**

Voor de public URL heb je 2 opties:

**Optie A: R2.dev subdomain (gratis, maar beperkt)**
```
R2_PUBLIC_BASE_URL=https://pub-<hash>.r2.dev
```
Deze moet je activeren in Cloudflare:
- R2 → je bucket → Settings → Public Access → "Allow Access"

**Optie B: Custom domain (aanbevolen)**
```
R2_PUBLIC_BASE_URL=https://media.jouwdomein.be
```

### 5. **Juiste `.env.local` Format**

```env
R2_ACCOUNT_ID=2b5fa6331234567890abcdef
R2_ACCESS_KEY_ID=5a9e479d1234567890abcdef12345678
R2_SECRET_ACCESS_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
R2_BUCKET=media-kine
R2_PUBLIC_BASE_URL=https://pub-b8efefa10f094a24b39c7ca529192345.r2.dev
```

**Let op**: 
- Geen quotes rond de waarden
- Geen spaties voor of na het `=` teken
- Elke waarde op een nieuwe regel

## Test Stappen

### Stap 1: Verifieer credentials
```powershell
# In de project root:
node scripts/test-r2.js
```

### Stap 2: Als test succesvol is, run seed script
```powershell
node scripts/seed.js
```

### Stap 3: Verifieer uploads
```powershell
node scripts/verify-seed.js
```

## Alternatieve Oplossing: Handmatige Upload Test

Als de automatische upload blijft falen, kunnen we:

1. **Via Cloudflare Dashboard**:
   - Ga naar R2 → je bucket
   - Upload handmatig 1-2 testfoto's uit `scripts/kot1/`
   - Noteer de publieke URL

2. **Database handmatig updaten**:
   We kunnen dan een script maken om de foto URLs in de database te zetten

## Volgende Stap

Als je de credentials hebt gecontroleerd/vernieuwd:
1. Update `.env.local` met de nieuwe waarden
2. Run: `node scripts/test-r2.js`
3. Als die succesvol is, run: `node scripts/seed.js`

Laat me weten als je hulp nodig hebt bij één van deze stappen!
