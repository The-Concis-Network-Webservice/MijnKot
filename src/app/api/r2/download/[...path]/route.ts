import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

export async function GET(request: Request, context: { params: { path: string[] } }) {
  const { params } = context;
  const key = Array.isArray(params.path) ? params.path.join('/') : (params as any).path;
  
  console.log(`[R2_DOWNLOAD] Path: ${key}`);

  try {
    const ctx = getRequestContext();
    const BUCKET = ctx?.env?.BUCKET;

    if (!BUCKET) {
      console.error("[R2_DOWNLOAD] No BUCKET binding found");
      return new Response("No BUCKET binding", { status: 500 });
    }

    console.log(`[R2_DOWNLOAD] Fetching from R2: ${key}`);
    const object = await BUCKET.get(key);

    if (!object) {
      console.log(`[R2_DOWNLOAD] Key not found: ${key}`);
      return new Response("Not found", { status: 404 });
    }

    console.log(`[R2_DOWNLOAD] Found object: ${key}, size: ${object.size}`);

    const resHeaders = new Headers();
    // Manually set common headers to avoid potential serialization issues with R2 metadata objects
    resHeaders.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
    resHeaders.set("Content-Length", object.size.toString());
    if (object.httpEtag) resHeaders.set("ETag", object.httpEtag);
    resHeaders.set("Cache-Control", "public, max-age=3600");

    return new Response(object.body, {
      status: 200,
      headers: resHeaders,
    });
  } catch (error: any) {
    // Only log the message, avoid logging the whole error object which might have non-POJO properties
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[R2_DOWNLOAD] Error:", errMsg);
    return new Response(`Error: ${errMsg}`, { status: 500 });
  }
}
