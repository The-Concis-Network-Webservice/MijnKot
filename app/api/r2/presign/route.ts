import { NextResponse } from "next/server";

export const runtime = 'edge';

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Bucket, r2Client, r2PublicBaseUrl } from "../../../../lib/r2";
import { getUserFromRequest } from "../../../../lib/cms/server";
import { rateLimit } from "../../../../lib/cms/rate-limit";
import { canEditContent } from "../../../../lib/cms/permissions";

export async function POST(request: Request) {
  if (!r2Bucket || !r2PublicBaseUrl) {
    return NextResponse.json(
      { error: "R2 configuration is missing." },
      { status: 500 }
    );
  }
  const { user, role } = await getUserFromRequest();
  if (!user || !canEditContent(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limit = rateLimit(`r2:${user.id}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const body = await request.json();
  const { filename, contentType, kotId } = body as {
    filename?: string;
    contentType?: string;
    kotId?: string;
  };

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "filename and contentType are required." },
      { status: 400 }
    );
  }

  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const folder = kotId ? `koten/${kotId}` : "library";
  const key = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: r2Bucket,
    Key: key,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });
  const publicUrl = `${r2PublicBaseUrl}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}

