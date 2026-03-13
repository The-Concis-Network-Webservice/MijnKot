import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { jwtVerify } from "jose";
import { rateLimit } from "@/shared/lib/cms/rate-limit";
import { canEditContent } from "@/shared/lib/cms/permissions";

export const runtime = 'edge';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// Robust Base64 decoder for Edge Runtime to avoid atob() strictness issues
function base64ToArrayBuffer(base64: string) {
  const cleanBase64 = base64.replace(/[^A-Za-z0-9+/=]/g, "");
  
  // Try Buffer first (Node.js/Next.js polyfill)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(cleanBase64, 'base64');
  }

  // Fallback to strict atob
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function POST(request: Request) {
  try {
    // 1. JWT Authentication (Robust custom check)
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/cms_session=([^;]+)/);
    const token = match ? match[1] : null;

    // Safely get context
    let ctx;
    try {
      ctx = getRequestContext();
    } catch (e) {
      return NextResponse.json(
        { error: "Could not get Cloudflare request context. Ensure you are running with 'npm run dev:wrangler'." },
        { status: 500, headers: CORS_HEADERS }
      );
    }
    
    // We rely on AUTH_SECRET bound to context env, or fallback
    const secretStr = (ctx?.env as any)?.AUTH_SECRET || "change-me-in-env";
    const secret = new TextEncoder().encode(secretStr);

    if (!token) {
        return NextResponse.json({ error: "Unauthorized: No token" }, { 
            status: 401, headers: CORS_HEADERS 
        });
    }

    let decodedUserId = "unknown";
    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;
      if (!canEditContent(role as any)) {
         return NextResponse.json({ error: "Forbidden: Insufficient role" }, { 
            status: 403, headers: CORS_HEADERS 
        });
      }
      decodedUserId = payload.sub || "unknown";
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { 
            status: 401, headers: CORS_HEADERS 
      });
    }

    const limit = rateLimit(`upload:${decodedUserId}`, 20, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" }, 
        { status: 429, headers: CORS_HEADERS }
      );
    }

    const BUCKET = ctx?.env?.BUCKET;

    if (!BUCKET) {
      return NextResponse.json(
        { error: "R2 Bucket binding 'BUCKET' not found. Ensure --r2 BUCKET is in package.json." },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const file_name = request.headers.get('x-file-name');
    const mime_type = request.headers.get('x-mime-type');
    
    if (!file_name || !mime_type) {
      return NextResponse.json(
        { error: "Missing required headers: X-File-Name, X-Mime-Type" }, 
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let blob: Blob;
    try {
      blob = await request.blob();
    } catch (e: any) {
      console.error("Blob read error:", e);
      return NextResponse.json(
        { error: "Failed to read binary file body: " + e.message }, 
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!blob || blob.size === 0) {
      return NextResponse.json(
        { error: "Empty request body received." }, 
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Decode filename defensively
    const decodedFileName = decodeURIComponent(file_name);
    const safeName = decodedFileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `uploads/${crypto.randomUUID()}-${safeName}`;

    // Upload directly using Blob. Cloudflare naturally accepts Blob because it has a known .size, avoiding the FixedLengthStream error.
    const uploadedObject = await BUCKET.put(key, blob, {
      httpMetadata: { contentType: mime_type }
    });

    // 5. Generate Public URL
    // We use a local proxy route so images work in local dev (Wrangler) and production automatically
    const publicUrl = `/api/r2/download/${key}`;

    return NextResponse.json({ 
      success: true, 
      key, 
      publicUrl,
      file_name: decodedFileName,
      mime_type,
      size_bytes: uploadedObject.size
    }, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("Critical Upload Error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
