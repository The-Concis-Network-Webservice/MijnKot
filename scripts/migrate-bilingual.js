import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'local.sqlite');
const db = new Database(dbPath);

console.log('Running migration: Adding English language columns...');

function addColumn(table, column, type) {
  try {
    const stmt = db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    stmt.run();
    console.log(`✅ Added ${column} to ${table}`);
  } catch (error) {
    if (error.message && error.message.includes('duplicate column name')) {
      console.log(`ℹ️ Column ${column} already exists in ${table}`);
    } else {
      console.error(`❌ Failed to add ${column} to ${table}: ${error.message}`);
    }
  }
}

// Koten
addColumn('koten', 'title_en', 'TEXT');
addColumn('koten', 'description_en', 'TEXT');

// Vestigingen
addColumn('vestigingen', 'description_en', 'TEXT');

// FaqItems
addColumn('faq_items', 'question_en', 'TEXT');
addColumn('faq_items', 'answer_en', 'TEXT');

// SiteSettings
addColumn('site_settings', 'hero_title_en', 'TEXT');
addColumn('site_settings', 'hero_subtitle_en', 'TEXT');
addColumn('site_settings', 'hero_cta_label_en', 'TEXT');

console.log('Migration complete.');
