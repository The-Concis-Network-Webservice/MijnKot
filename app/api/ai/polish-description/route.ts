import { NextResponse } from "next/server";

export const runtime = 'edge';

import { getUserFromRequest } from "../../../../lib/cms/server";
import { canEditContent } from "../../../../lib/cms/permissions";
import { rateLimit } from "../../../../lib/cms/rate-limit";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Simple in-memory cache (in production, use Redis)
const cache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

function getCacheKey(text: string, language: string): string {
    // Simple hash function
    let hash = 0;
    const str = `${text}-${language}`;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

function sanitizeInput(text: string): string {
    // Remove excessive whitespace
    return text.trim().replace(/\s+/g, ' ').substring(0, 5000);
}

export async function POST(request: Request) {
    const { user, role } = await getUserFromRequest();

    if (!user || !canEditContent(role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting: 10 requests per 5 minutes
    const limit = rateLimit(`ai-polish:${user.id}`, 10, 300_000);
    if (!limit.allowed) {
        return NextResponse.json(
            { error: "Rate limit exceeded. Please wait before trying again." },
            { status: 429 }
        );
    }

    if (!GROQ_API_KEY) {
        console.error("GROQ_API_KEY not configured");
        return NextResponse.json(
            { error: "AI service not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { text, language = "nl-BE", tone = "professioneel-wervend", maxLength = 900, kotMeta, forceRefresh = false } = body;

        // Validation
        if (!text || text.trim().length < 30) {
            return NextResponse.json(
                { error: "Tekst moet minimaal 30 karakters bevatten" },
                { status: 400 }
            );
        }

        const sanitizedText = sanitizeInput(text);

        // Check cache
        const cacheKey = getCacheKey(sanitizedText, language);
        const cached = cache.get(cacheKey);

        // Use cache only if forceRefresh is false
        if (!forceRefresh && cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return NextResponse.json({
                polishedText: cached.text,
                cached: true,
                usage: { inputTokens: 0, outputTokens: 0 },
                model: "groq-cached"
            });
        }

        // Build system prompt
        const systemPrompt = `Je bent een professionele copywriter voor studentenhuisvesting in België.

STRIKTE REGELS:
1. Herschrijf ALLEEN op basis van de gegeven input
2. Verzin GEEN nieuwe feiten (geen prijzen, locaties, oppervlaktes als ze niet vermeld zijn)
3. Taal: ${language === 'nl-BE' ? 'Nederlands (België)' : 'Engels'}
4. Toon: ${tone}
5. Lengte: maximaal ${maxLength} karakters
6. Stijl: professioneel, wervend maar niet overdreven, helder, correct
7. GEEN "AI-achtige" zinnen, geen placeholders zoals "[vul hier in]"
8. GEEN overdreven marketingtaal

STRUCTUUR:
- 1 korte introzin (wat is het)
- 3-6 bullets met highlights (indien relevant)
- 1 korte afsluitzin (neutrale call-to-action)

OUTPUT:
- Pure tekst (geen markdown headings)
- Geen titels, geen verwijzing naar "AI"
- Behoud alle feiten uit de input`;

        const userPrompt = kotMeta?.title && kotMeta?.city
            ? `Kot: "${kotMeta.title}" in ${kotMeta.city}\n\nOriginele beschrijving:\n${sanitizedText}`
            : `Originele beschrijving:\n${sanitizedText}`;

        // Call Groq API
        const groqResponse = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            }),
            signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json().catch(() => ({}));
            console.error("Groq API error:", errorData);
            throw new Error(`Groq API returned ${groqResponse.status}`);
        }

        const data = await groqResponse.json();
        const polishedText = data.choices?.[0]?.message?.content?.trim();

        if (!polishedText) {
            throw new Error("No content returned from AI");
        }

        // Cache the result
        cache.set(cacheKey, { text: polishedText, timestamp: Date.now() });

        // Clean old cache entries (simple cleanup)
        if (cache.size > 100) {
            const now = Date.now();
            for (const [key, value] of cache.entries()) {
                if (now - value.timestamp > CACHE_TTL) {
                    cache.delete(key);
                }
            }
        }

        return NextResponse.json({
            polishedText,
            usage: {
                inputTokens: data.usage?.prompt_tokens || 0,
                outputTokens: data.usage?.completion_tokens || 0
            },
            model: data.model || "llama-3.3-70b-versatile",
            cached: false
        });

    } catch (error: any) {
        console.error("AI polish error:", error);

        if (error.name === 'AbortError' || error.message?.includes('timeout')) {
            return NextResponse.json(
                { error: "Request timeout. Please try again." },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate improved text. Please try again." },
            { status: 500 }
        );
    }
}
