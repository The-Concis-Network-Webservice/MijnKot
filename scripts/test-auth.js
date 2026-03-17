
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const HASH_ALGORITHM = "SHA-256";

async function pbkdf2(
  password,
  salt,
  iterations,
  keyLength
) {
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

function base64Decode(str) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function verifyPassword(
  password,
  storedHash
) {
  try {
    const parts = storedHash.trim().split(":");
    if (parts.length === 3) {
      const iterations = parseInt(parts[0], 10);
      const salt = base64Decode(parts[1]);
      const originalHash = base64Decode(parts[2]);

      const hash = await pbkdf2(password, salt, iterations, KEY_LENGTH);

      if (hash.length !== originalHash.length) return false;
      let result = 0;
      for (let i = 0; i < hash.length; i++) {
        result |= hash[i] ^ originalHash[i];
      }
      return result === 0;
    }
    return false;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
}

// TEST CASE
const storedHash = "100000:rOdiyh6WrrbKo+z+kEkPmA==:d+v0D1CCzxLzxDex5MkJl80YtVehRDYTckyPOKBEOng=";
// The user presumably set a password. I don't know it, but I can test if the HASHING logic works by hashing a new one and verifying it.

async function test() {
    const testPassword = "TestPassword2026!"; // Something the user might have used
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hashBytes = await pbkdf2(testPassword, salt, ITERATIONS, KEY_LENGTH);
    
    const b64Parts = [
        ITERATIONS,
        btoa(String.fromCharCode(...salt)),
        btoa(String.fromCharCode(...hashBytes))
    ].join(':');
    
    console.log("Generated hash:", b64Parts);
    const isValid = await verifyPassword(testPassword, b64Parts);
    console.log("Is valid (self-check):", isValid);
    
    // Check against the one in DB (should be false unless I guessed right)
    const isDbValid = await verifyPassword(testPassword, storedHash);
    console.log("Is DB hash valid for test password:", isDbValid);
}

test();
