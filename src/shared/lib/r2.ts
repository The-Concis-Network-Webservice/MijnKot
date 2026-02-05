import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";

export const r2Client = new S3Client({
  region: "us-east-1",  // Recommended for Cloudflare R2
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

export const r2Bucket = process.env.R2_BUCKET ?? "";
export const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

