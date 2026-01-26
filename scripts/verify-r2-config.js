import fs from "fs";
import path from "path";
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

console.log("\n🔍 Cloudflare R2 Credentials Verification\n");

const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucket = process.env.R2_BUCKET || "";
const publicUrl = process.env.R2_PUBLIC_BASE_URL || "";

let allGood = true;

// Check Account ID
if (accountId.length === 32) {
  console.log("✅ R2_ACCOUNT_ID: Correct length (32 chars)");
} else {
  console.log(`❌ R2_ACCOUNT_ID: Wrong length (${accountId.length} chars, should be 32)`);
  allGood = false;
}

// Check Access Key ID
if (accessKeyId.length === 32) {
  console.log("✅ R2_ACCESS_KEY_ID: Correct length (32 chars)");
} else {
  console.log(`❌ R2_ACCESS_KEY_ID: Wrong length (${accessKeyId.length} chars, should be 32)`);
  allGood = false;
}

// Check Secret Access Key
if (secretAccessKey.length >= 60 && secretAccessKey.length <= 70) {
  console.log(`✅ R2_SECRET_ACCESS_KEY: Correct length (${secretAccessKey.length} chars)`);
} else {
  console.log(`❌ R2_SECRET_ACCESS_KEY: Wrong length (${secretAccessKey.length} chars, should be ~64)`);
  console.log(`   Current: ${secretAccessKey.substring(0, 10)}...${secretAccessKey.substring(secretAccessKey.length - 10)}`);
  allGood = false;
}

// Check Bucket
if (bucket) {
  console.log(`✅ R2_BUCKET: Set (${bucket})`);
} else {
  console.log("❌ R2_BUCKET: Not set");
  allGood = false;
}

// Check Public URL
if (publicUrl && publicUrl.startsWith("https://")) {
  console.log(`✅ R2_PUBLIC_BASE_URL: Valid`);
} else {
  console.log("❌ R2_PUBLIC_BASE_URL: Invalid or not set");
  allGood = false;
}

console.log("\n" + "=".repeat(60));

if (allGood) {
  console.log("✅ All credentials look good!");
  console.log("   You can now run: node scripts/seed.js");
} else {
  console.log("❌ Some credentials need attention");
  console.log("\nPlease check your .env.local file and ensure:");
  console.log("1. R2_ACCESS_KEY_ID is 32 characters");
  console.log("2. R2_SECRET_ACCESS_KEY is ~64 characters (the full secret!)");
  console.log("3. No extra spaces, quotes, or line breaks in the values");
}

console.log("\n");
