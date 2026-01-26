import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "db", "local.sqlite");
const db = new Database(dbPath);

console.log("\n📸 Adding local photo references to database...\n");

// Get first two koten
const koten = db.prepare("select id, title from koten order by created_at asc limit 2").all();

if (koten.length < 2) {
  console.log("❌ Not enough koten in database. Run seed.js first!");
  process.exit(1);
}

const kot1 = koten[0];
const kot2 = koten[1];

// Clear existing photos
db.prepare("delete from kot_photos").run();
db.prepare("delete from media_assets").run();

console.log(`Processing photos for:`);
console.log(`  - ${kot1.title} (${kot1.id.substring(0, 8)}...)`);
console.log(`  - ${kot2.title} (${kot2.id.substring(0, 8)}...)\n`);

function addLocalPhotos(kotId, folderName) {
  const folderPath = path.join(__dirname, folderName);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder ${folderName} not found`);
    return 0;
  }

  const files = fs.readdirSync(folderPath).filter(f => 
    f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp')
  );

  let count = 0;
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(folderPath, fileName);
    const stats = fs.statSync(filePath);
    
    // Use local file path as placeholder URL
    // In productie zou dit een echte R2 URL zijn
    const placeholderUrl = `/placeholder-photos/${folderName}/${fileName}`;
    const key = `koten/${kotId}/${fileName}`;
    
    // Get mime type
    const ext = path.extname(fileName).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    if (ext === '.webp') mimeType = 'image/webp';
    
    // Insert media asset
    const mediaAsset = db.prepare(
      "insert into media_assets (r2_key, public_url, file_name, mime_type, size_bytes, created_by) values (?, ?, ?, ?, ?, ?) returning id"
    ).get(key, placeholderUrl, fileName, mimeType, stats.size, null);
    
    // Insert kot photo
    db.prepare(
      "insert into kot_photos (kot_id, image_url, order_index, media_asset_id) values (?, ?, ?, ?)"
    ).run(kotId, placeholderUrl, i, mediaAsset.id);
    
    count++;
  }
  
  return count;
}

const kot1Count = addLocalPhotos(kot1.id, 'kot1');
const kot2Count = addLocalPhotos(kot2.id, 'kot2');

console.log(`\n✅ Added ${kot1Count + kot2Count} photo references to database`);
console.log(`   - ${kot1.title}: ${kot1Count} photos`);
console.log(`   - ${kot2.title}: ${kot2Count} photos`);

console.log(`\n⚠️  NOTE: Photos use placeholder URLs (/placeholder-photos/...)`);
console.log(`   Run seed.js with proper R2 credentials to upload to cloud storage.`);
console.log(`   Or use the admin panel to upload photos manually.`);

// Verify
const totalPhotos = db.prepare("select count(*) as count from kot_photos").get();
const totalAssets = db.prepare("select count(*) as count from media_assets").get();

console.log(`\n📊 Database now has:`);
console.log(`   - ${totalPhotos.count} kot photos`);
console.log(`   - ${totalAssets.count} media assets`);
