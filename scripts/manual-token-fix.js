import Database from 'better-sqlite3';

const dbPath = 'c:/Users/maxma/OneDrive/Bureaublad/The Consis Network/Workspace CNW/MijnKot/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6915236825a7f70e57e0867968d6c7cd7ff65f409c4e5c54c45e4db7eacc4810.sqlite';
const db = new Database(dbPath);

const email = 'plaatsbeschrijvingvanmijnkot@gmail.com';
const newToken = 'MijnKotReset2026';
const newExpiry = '2026-03-25T12:00:00.000Z'; // Valid for a week

try {
  const update = db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?');
  const result = update.run(newToken, newExpiry, email);
  console.log(`Token updated successfully. Changes: ${result.changes}`);
} catch (error) {
  console.error('Failed to update token:', error.message);
} finally {
  db.close();
}
