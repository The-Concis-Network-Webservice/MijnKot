/**
 * Password Migration Script
 * 
 * This script helps migrate from bcrypt to PBKDF2 password hashing.
 * 
 * IMPORTANT: Bcrypt hashes cannot be converted to PBKDF2 hashes.
 * Users will need to reset their passwords.
 * 
 * Options:
 * 1. Force password reset for all users on next login
 * 2. Manually update passwords in the database
 * 3. Create new admin user with PBKDF2 hash
 */

import { hashPassword } from '../lib/auth.ts';

// Example: Create a new password hash
async function createNewHash(password) {
  const hash = await hashPassword(password);
  console.log('New PBKDF2 hash:', hash);
  console.log('\nYou can use this hash to update the database:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'your-email@example.com';`);
}

// Run with: node scripts/migrate-passwords.js
const testPassword = process.argv[2] || 'admin123';
console.log(`Generating hash for password: ${testPassword}`);
createNewHash(testPassword);
