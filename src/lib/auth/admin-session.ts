import { createHmac, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

function deriveScryptKey(
  password: string,
  salt: string,
  length: number,
  options: { N: number; r: number; p: number; maxmem: number }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, length, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

export const ADMIN_COOKIE_NAME = "framio_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

interface AdminSessionPayload {
  scope: "admin";
  exp: number;
}

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function encode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const payload: AdminSessionPayload = {
    scope: "admin",
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS
  };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  const secret = getSessionSecret();
  if (!secret || !token) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expected = Buffer.from(sign(encoded, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminSessionPayload;
    return payload.scope === "admin" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS
  };
}

export function adminAuthIsConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD_HASH &&
      process.env.ADMIN_SESSION_SECRET &&
      process.env.ADMIN_SESSION_SECRET.length >= 32
  );
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const encodedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!encodedHash) return false;

  const [algorithm, costValue, blockSizeValue, parallelizationValue, salt, expectedHex] =
    encodedHash.split("$");
  if (algorithm !== "scrypt" || !costValue || !blockSizeValue || !parallelizationValue || !salt || !expectedHex) {
    return false;
  }

  const cost = Number(costValue);
  const blockSize = Number(blockSizeValue);
  const parallelization = Number(parallelizationValue);
  if (![cost, blockSize, parallelization].every(Number.isSafeInteger)) return false;

  const expected = Buffer.from(expectedHex, "hex");
  if (!expected.length) return false;

  const derived = await deriveScryptKey(password, salt, expected.length, {
    N: cost,
    r: blockSize,
    p: parallelization,
    maxmem: 64 * 1024 * 1024
  });

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
