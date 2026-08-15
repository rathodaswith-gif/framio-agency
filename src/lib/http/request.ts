import { createHmac, randomBytes } from "node:crypto";

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function hashPrivateIdentifier(value: string): string | null {
  const secret = process.env.SUBMISSION_HASH_SECRET;
  if (!secret || secret.length < 32) return null;
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createPublicSubmissionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `FRM-${timestamp}-${random}`;
}

export async function readJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }
  return request.json();
}
