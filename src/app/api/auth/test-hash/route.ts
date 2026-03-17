import { NextResponse } from "next/server";

export const runtime = 'edge';

const ITERATIONS = 100000;
const KEY_LENGTH = 32;

async function pbkdf2(password: string, salt: Uint8Array, iterations: number, keyLength: number): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derivedBits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, passwordKey, keyLength * 8);
  return new Uint8Array(derivedBits);
}

function base64Encode(bytes: Uint8Array): string {
  if (typeof btoa === 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  return btoa(String.fromCharCode(...bytes));
}

function base64Decode(str: string): Uint8Array {
  if (typeof atob === 'undefined') {
    const buf = Buffer.from(str, 'base64');
    return new Uint8Array(buf);
  }
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

export async function GET() {
  const password = "MijnKot2026!";
  const storedSaltBase64 = "GRymaBy+Tvrs2d2c3q/VCw==";
  const storedHashOnlyBase64 = "4QH2TX9MKZZEoZLUs1FNtjpPRzGG3MyO2GlUwl04rO3Y=";
  
  const salt = base64Decode(storedSaltBase64);
  const iterations = 100000;
  const keyLength = 32;
  
  // Re-hash with the same salt
  const generatedHashArray = await pbkdf2(password, salt, iterations, keyLength);
  const generatedHashBase64 = base64Encode(generatedHashArray);
  
  const matches = generatedHashBase64 === storedHashOnlyBase64;
  
  return NextResponse.json({
    passwordUsed: password,
    saltUsedBase64: storedSaltBase64,
    storedHashBase64: storedHashOnlyBase64,
    generatedHashBase64: generatedHashBase64,
    doTheyMatch: matches,
    saltBytes: Array.from(salt),
    generatedHashBytes: Array.from(generatedHashArray)
  });
}
