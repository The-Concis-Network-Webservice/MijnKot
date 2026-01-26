import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["'](.*)["']$/, "$1");
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  });
}
loadEnv();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;

console.log("Testing with minimal S3Client configuration...\n");

// Try minimal configuration with us-east-1 (recommended for R2)
const client = new S3Client({
  region: "us-east-1",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

async function testUpload() {
  try {
    const testContent = Buffer.from("Hello from KotWebsite!");
    const testKey = `test-${Date.now()}.txt`;
    
    console.log(`Uploading test file: ${testKey}`);
    console.log(`To bucket: ${bucket}`);
    console.log(`Using endpoint: https://${accountId}.r2.cloudflarestorage.com\n`);
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: testContent,
      ContentType: "text/plain"
    });
    
    const result = await client.send(command);
    
    console.log("✅ SUCCESS! Upload worked!");
    console.log("Result:", result);
    console.log(`\nFile uploaded to: koten/${testKey}`);
    
  } catch (err) {
    console.error("❌ Upload failed!");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    
    if (err.message.includes("signature")) {
      console.error("\n💡 Signature error - this usually means:");
      console.error("   1. Access Key ID or Secret Access Key is incorrect");
      console.error("   2. The keys don't have permission for this bucket");
      console.error("   3. The Account ID is wrong");
      console.error("\nPlease double-check your R2 credentials in .env.local");
      console.error("You can find them in Cloudflare Dashboard → R2 → Manage R2 API Tokens");
    }
    
    if (err.$metadata) {
      console.error("\nRequest metadata:", err.$metadata);
    }
  }
}

testUpload();
