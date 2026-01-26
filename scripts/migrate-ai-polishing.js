import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'db', 'local.sqlite');
const db = new Database(dbPath);

console.log('📝 Adding AI text polishing columns to koten table...\n');

function addColumn(table, column, type, defaultValue = null) {
  try {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : '';
    const stmt = db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}${defaultClause}`);
    stmt.run();
    console.log(`✅ Added ${column} to ${table}`);
  } catch (error) {
    if (error.message && error.message.includes('duplicate column name')) {
      console.log(`ℹ️  Column ${column} already exists in ${table}`);
    } else {
      console.error(`❌ Failed to add ${column} to ${table}: ${error.message}`);
    }
  }
}

// Add raw description fields (what user types)
addColumn('koten', 'description_raw', 'TEXT');
addColumn('koten', 'description_raw_en', 'TEXT');

// Add polished description fields (AI-improved)
addColumn('koten', 'description_polished', 'TEXT');
addColumn('koten', 'description_polished_en', 'TEXT');

// Add metadata for AI generation
addColumn('koten', 'ai_last_generated_at', 'TEXT');
addColumn('koten', 'ai_generation_count', 'INTEGER', '0');

console.log('\n✅ Migration complete!');
console.log('\nNew columns:');
console.log('  - description_raw (user input)');
console.log('  - description_raw_en (user input EN)');
console.log('  - description_polished (AI improved)');
console.log('  - description_polished_en (AI improved EN)');
console.log('  - ai_last_generated_at (timestamp)');
console.log('  - ai_generation_count (usage tracking)');

// Migrate existing data: copy current description to description_raw if needed
console.log('\n📦 Migrating existing descriptions...');
const migrateStmt = db.prepare(`
  UPDATE koten 
  SET 
    description_raw = description,
    description_raw_en = description_en
  WHERE description_raw IS NULL
`);
const result = migrateStmt.run();
console.log(`✅ Migrated ${result.changes} existing descriptions`);

console.log('\n🎉 All done!');
