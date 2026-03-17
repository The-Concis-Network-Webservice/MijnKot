import { execSync } from 'child_process';

const emails = [
  'dominique.noblet@telenet.be',
  'stephane.maniet@gmail.com',
  'theconcisnetwork@gmail.com',
  'plaatsbeschrijvingvanmijnkot@gmail.com'
];

// Re-generating hash in Node to be sure
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const iterations = 100000;
  const keyLength = 32;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
  return `${iterations}:${salt.toString('base64')}:${hash.toString('base64')}`;
}

const password = 'MijnKot2026!';
const cleanHash = hashPassword(password);
console.log(`Generated Clean Hash: ${cleanHash}`);

const sql = `
DELETE FROM user_vestigingen WHERE user_id = (SELECT id FROM users WHERE email = 'admin@example.com');
DELETE FROM users WHERE email = 'admin@example.com';
${emails.map(email => `
INSERT INTO users (email, full_name, password_hash, role) 
SELECT '${email}', '${email.split('@')[0]}', '${cleanHash}', 'super_admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = '${email}');
UPDATE users SET password_hash = '${cleanHash}', role = 'super_admin' WHERE email = '${email}';
`).join('\n')}
`;

console.log("Updating Local Database...");
try {
  execSync(`npx wrangler d1 execute mijnkot --local --command="${sql.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  console.log("Local Update Successful.");
} catch (e) {
  console.error("Local Update Failed:", e.message);
}

console.log("Updating Remote Database...");
try {
  execSync(`npx wrangler d1 execute mijnkot --remote --command="${sql.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  console.log("Remote Update Successful.");
} catch (e) {
  console.error("Remote Update Failed:", e.message);
}
