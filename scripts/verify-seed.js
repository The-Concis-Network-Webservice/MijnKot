import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'db', 'local.sqlite');
const db = new Database(dbPath);

const kotPhotos = db.prepare("select count(*) as count from kot_photos").get();
const mediaAssets = db.prepare("select count(*) as count from media_assets").get();
const koten = db.prepare("select id, title from koten limit 3").all();
const photos = db.prepare("select * from kot_photos limit 5").all();

console.log(`\n📊 Database Status:`);
console.log(`   Koten: ${koten.length} shown (total in DB)`);
console.log(`   Kot Photos: ${kotPhotos.count}`);
console.log(`   Media Assets: ${mediaAssets.count}`);

if (photos.length > 0) {
  console.log(`\n📷 Sample Photos:`);
  photos.forEach(p => {
    console.log(`   - ${p.kot_id.substring(0, 8)}... | ${p.image_url.substring(p.image_url.lastIndexOf('/') + 1)}`);
  });
} else {
  console.log(`\n⚠️  No photos found in database`);
}

console.log(`\n✅ First few koten:`);
koten.forEach(k => {
  console.log(`   - ${k.title}`);
});
