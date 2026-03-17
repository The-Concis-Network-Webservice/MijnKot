import Database from 'better-sqlite3';
import path from 'path';

const dbPath = './db/local.sqlite';
const db = new Database(dbPath);

const emails = [
  'theconcisnetwork@gmail.com',
  'dominique.noblet@telenet.be',
  'stephane.maniet@gmail.com'
];

const cleanHash = '100000:GRymaBy+Tvrs2d2c3q/VCw==:4QH2TX9MKZZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=';

console.log(`Updating users in ${dbPath}...`);
const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?');

for (const email of emails) {
  const info = stmt.run(cleanHash, email);
  console.log(`Updated ${email}: ${info.changes} rows.`);
}

const check = db.prepare('SELECT email, LENGTH(password_hash) as len FROM users WHERE email = ?').get(emails[0]);
console.log(`Verification: ${check.email} length is ${check.len}`);
db.close();
