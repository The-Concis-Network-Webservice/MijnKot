import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Mock translation function for now - in a real app, you would call DeepL or Google Translate API here.
// You can use process.env.TRANSLATION_API_KEY to store your secret.
async function translateText(text: string, targetLanguage: string) {
    if (!text) return '';
    
    try {
        // This is a placeholder for a real translation API call.
        // For now, we simulate a simple translation for Dutch to English.
        // we could use a free API like:
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=nl&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0].map((s: any) => s[0]).join('');
        }
        
        return text; // Fallback
    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
}

export async function POST(request: Request) {
    try {
        const { text, targetLanguage = 'en' } = await request.json();
        
        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const translated = await translateText(text, targetLanguage);
        
        return NextResponse.json({ translated });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
