
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbName = "mijnkot";
const dumpFile = "prod_dump.sql";

async function main() {
  console.log("🔄 Syncing remote D1 to local environment...");

  try {
    // 1. Export remote data
    console.log("📥 Step 1: Exporting remote data...");
    try {
      execSync(`npx wrangler d1 export ${dbName} --remote --output=${dumpFile}`, { stdio: "inherit" });
      console.log("✅ Step 1 complete: Downloaded production dump.");
    } catch (e) {
      console.error("❌ Step 1 failed:", e.message);
      throw e;
    }

    // 2. Prepare local database
    console.log("🗑️ Step 2: Clearing local database...");
    const tables = [
      "audit_logs",
      "availability_history",
      "kot_photos",
      "media_assets",
      "user_vestigingen",
      "contracts",
      "contract_templates",
      "leads",
      "faq_items",
      "site_settings",
      "koten",
      "vestigingen",
      "users"
    ];

    let dropSql = "PRAGMA foreign_keys = OFF;\n";
    tables.forEach(table => {
      dropSql += `DROP TABLE IF EXISTS ${table};\n`;
    });
    dropSql += "PRAGMA foreign_keys = ON;";

    const dropFile = "temp_drop.sql";
    fs.writeFileSync(dropFile, dropSql);
    try {
      execSync(`npx wrangler d1 execute ${dbName} --local --file=${dropFile}`, { stdio: "inherit" });
      console.log("✅ Step 2 complete: Local tables cleared.");
    } catch (e) {
      console.error("❌ Step 2 failed:", e.message);
      throw e;
    } finally {
      if (fs.existsSync(dropFile)) fs.unlinkSync(dropFile);
    }

    // 3. Import prod data locally
    console.log("📤 Step 3: Importing production data locally...");
    try {
      execSync(`npx wrangler d1 execute ${dbName} --local --file=${dumpFile}`, { stdio: "inherit" });
      console.log("✅ Step 3 complete: Data imported locally.");
    } catch (e) {
      console.error("❌ Step 3 failed:", e.message);
      throw e;
    }

    console.log("✨ ALL DONE! Your local database now matches production.");
  } catch (error) {
    console.error("💥 SYNC FAILED. Please check the errors above.");
    process.exit(1);
  }
}

main();
