/**
 * Password Hashing Utility for Edge Runtime (PBKDF2)
 * This matches the implementation in lib/auth.ts
 */

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

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS, KEY_LENGTH);
  
  // Format: iterations:salt:hash (all base64 encoded)
  return `${ITERATIONS}:${base64Encode(salt)}:${base64Encode(hash)}`;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const password = process.argv[2] || 'admin123';
  console.log(`Generating PBKDF2 hash for password: ${password}`);
  hashPassword(password).then(hash => {
    console.log('\nHash:', hash);
    console.log('\nYou can use this in your seed script or to update the database:');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'your-email@example.com';`);
  });
}
