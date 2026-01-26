import { S3Client, PutObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
function loadEnv() {
  const envFiles = [".env", ".env.local"];
  envFiles.forEach(file => {
    const envPath = path.join(__dirname, "..", file);
    if (fs.existsSync(envPath)) {
      console.log(`Loading env from ${file}`);
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^"(.*)"$/, "$1");
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  });
}
loadEnv();

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
const r2Bucket = process.env.R2_BUCKET ?? "";
const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

console.log("\n🔍 R2 Configuration Debug:");
console.log(`   Account ID: ${accountId ? accountId.substring(0, 8) + "..." : "MISSING"}`);
console.log(`   Access Key ID: ${accessKeyId ? accessKeyId.substring(0, 8) + "..." : "MISSING"}`);
console.log(`   Secret Key: ${secretAccessKey ? "***" + secretAccessKey.substring(secretAccessKey.length - 4) : "MISSING"}`);
console.log(`   Bucket: ${r2Bucket || "MISSING"}`);
console.log(`   Public Base URL: ${r2PublicBaseUrl || "MISSING"}`);
console.log(`   Endpoint: https://${accountId}.r2.cloudflarestorage.com\n`);

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  tls: true,
  forcePathStyle: false
});

async function testR2Connection() {
  try {
    console.log("Testing R2 connection...");
    
    // Test 1: List buckets
    try {
      const listCommand = new ListBucketsCommand({});
      const result = await r2Client.send(listCommand);
      console.log("✅ Successfully connected to R2!");
      console.log(`   Found ${result.Buckets?.length || 0} buckets`);
      if (result.Buckets) {
        result.Buckets.forEach(b => console.log(`   - ${b.Name}`));
      }
    } catch (err) {
      console.log("❌ Failed to list buckets:", err.message);
      console.log("   This might be OK if you don't have list permissions");
    }

    // Test 2: Upload a small test file
    console.log(`\nTesting file upload to bucket: ${r2Bucket}...`);
    const testContent = "Test upload from KotWebsite";
    const testKey = "test-upload.txt";
    
    const uploadCommand = new PutObjectCommand({
      Bucket: r2Bucket,
      Key: testKey,
      Body: testContent,
      ContentType: "text/plain"
    });
    
    await r2Client.send(uploadCommand);
    console.log(`✅ Successfully uploaded test file: ${testKey}`);
    console.log(`   Public URL would be: ${r2PublicBaseUrl}/${testKey}`);
    
  } catch (err) {
    console.error("\n❌ R2 Connection Test Failed!");
    console.error("Error details:", err.message);
    console.error("\n💡 Common issues:");
    console.error("   1. Check that your R2_ACCOUNT_ID is correct");
    console.error("   2. Verify R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY");
    console.error("   3. Make sure the bucket name is correct");
    console.error("   4. Check if the API token has the right permissions");
    console.error("\n   Full error:");
    console.error(err);
  }
}

testR2Connection();
