/**
 * Utility to set/update user passwords in the D1 database.
 * Usage: node scripts/set-password.js <email> <password> [--local|--remote]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hashing parameters (matching src/shared/lib/auth.ts)
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const HASH_ALGORITHM = "SHA-256";

async function pbkdf2(password, salt, iterations, keyLength) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations,
      hash: HASH_ALGORITHM,
    },
    passwordKey,
    keyLength * 8
  );

  return new Uint8Array(derivedBits);
}

function base64Encode(bytes) {
  return Buffer.from(bytes).toString('base64');
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS, KEY_LENGTH);
  return `${ITERATIONS}:${base64Encode(salt)}:${base64Encode(hash)}`;
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const isRemote = process.argv.includes('--remote');
  const dbType = isRemote ? 'remote' : 'local';

  if (!email || !password) {
    console.log('\nUsage: node scripts/set-password.js <email> <password> [--local|--remote]');
    console.log('Example: node scripts/set-password.js theconcisnetwork@gmail.com MyNewPassword123! --local\n');
    process.exit(1);
  }

  try {
    console.log(`\n--- Password Reset Utility ---`);
    console.log(`Target Email: ${email}`);
    console.log(`Database:     ${dbType}`);
    
    console.log(`\nGenerating secure hash...`);
    const hash = await hashPassword(password);
    
    const sqlFile = path.join(__dirname, 'temp_update_pwd.sql');
    fs.writeFileSync(sqlFile, `UPDATE users SET password_hash = '${hash}' WHERE email = '${email}';`);

    console.log(`Executing database update...`);
    const flag = isRemote ? '--remote' : '--local';
    
    try {
      execSync(`npx wrangler d1 execute mijnkot ${flag} --file="${sqlFile}"`, { stdio: 'inherit' });
      console.log(`\n✅ Successfully updated password for ${email} in ${dbType} database.`);
      console.log(`You can now try to log in with the new password.`);
    } catch (dbError) {
      console.error(`\n❌ Database update failed: ${dbError.message}`);
      console.log(`Make sure you have wrangler installed and access to the 'mijnkot' database.`);
    } finally {
      if (fs.existsSync(sqlFile)) {
        fs.unlinkSync(sqlFile);
      }
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main();
