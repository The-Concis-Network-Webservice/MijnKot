import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types";

const SESSION_COOKIE = "cms_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "change-me-in-env"
);

export type CmsUser = {
  id: string;
  email: string;
  role: UserRole;
};

// Web Crypto API-based password hashing (Edge Runtime compatible)
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const HASH_ALGORITHM = "SHA-256";

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
  keyLength: number
): Promise<Uint8Array> {
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
      salt: salt as unknown as BufferSource,
      iterations,
      hash: HASH_ALGORITHM,
    },
    passwordKey,
    keyLength * 8
  );

  return new Uint8Array(derivedBits);
}

function base64Encode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function base64Decode(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS, KEY_LENGTH);

  // Format: iterations:salt:hash (all base64 encoded)
  return `${ITERATIONS}:${base64Encode(salt)}:${base64Encode(hash)}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const parts = storedHash.split(":");

    // Check if it's our new format (iterations:salt:hash)
    if (parts.length === 3) {
      const iterations = parseInt(parts[0], 10);
      const salt = base64Decode(parts[1]);
      const originalHash = base64Decode(parts[2]);

      const hash = await pbkdf2(password, salt, iterations, KEY_LENGTH);

      // Constant-time comparison
      if (hash.length !== originalHash.length) return false;
      let result = 0;
      for (let i = 0; i < hash.length; i++) {
        result |= hash[i] ^ originalHash[i];
      }
      return result === 0;
    }

    // Fallback: if it's an old bcrypt hash, we can't verify it in Edge Runtime
    // You'll need to migrate existing passwords or use a different approach
    console.warn("Legacy bcrypt hash detected - cannot verify in Edge Runtime");
    return false;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

export async function createSession(user: CmsUser) {
  return new SignJWT({ role: user.role, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.sub as string,
      role: payload.role as UserRole,
      email: payload.email as string
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}


