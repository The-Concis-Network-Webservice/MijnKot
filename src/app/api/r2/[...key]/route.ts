import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: { key: string[] } }
) {
  let ctx;
  try {
    ctx = getRequestContext();
  } catch {
    return new NextResponse(null, { status: 500 });
  }

  const BUCKET = (ctx.env as any).BUCKET;
  if (!BUCKET) {
    return new NextResponse(null, { status: 500 });
  }

  const key = params.key.join("/");
  const object = await BUCKET.get(key);
  if (!object) {
    return new NextResponse(null, { status: 404 });
  }

  const data = await object.arrayBuffer();
  return new NextResponse(data, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
