import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  adminAuthIsConfigured,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword
} from "@/lib/auth/admin-session";
import { prisma } from "@/lib/db/prisma";
import { getClientIp, hashPrivateIdentifier, readJson } from "@/lib/http/request";
import { adminLoginSchema } from "@/lib/validation/submission";

export const runtime = "nodejs";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_FAILURE_LIMIT = 10;

export async function POST(request: Request) {
  if (!adminAuthIsConfigured()) {
    return NextResponse.json({ ok: false, error: "Admin authentication is not configured." }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await readJson(request);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid login request." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid login request." }, { status: 400 });
  }

  const ipHash = hashPrivateIdentifier(getClientIp(request));
  if (!ipHash) {
    return NextResponse.json({ ok: false, error: "Admin authentication is not configured." }, { status: 503 });
  }

  try {
    const failures = await prisma.adminLoginAttempt.count({
      where: {
        ipHash,
        success: false,
        createdAt: { gte: new Date(Date.now() - LOGIN_WINDOW_MS) }
      }
    });

    if (failures >= LOGIN_FAILURE_LIMIT) {
      return NextResponse.json(
        { ok: false, error: "Too many login attempts. Try again later." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const valid = await verifyAdminPassword(parsed.data.password);
    await prisma.adminLoginAttempt.create({ data: { ipHash, success: valid } });

    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const token = createAdminSessionToken();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Admin authentication is not configured." }, { status: 503 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions());
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ ok: false, error: "Admin login is temporarily unavailable." }, { status: 503 });
  }
}
