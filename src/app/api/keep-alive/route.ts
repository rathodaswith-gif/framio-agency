import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily keep-awake ping, called by Vercel Cron (see vercel.json).
 * Free Supabase projects pause after 7 days without activity; one tiny
 * query a day keeps the database awake so client briefs never fail.
 *
 * Vercel sends "Authorization: Bearer <CRON_SECRET>" automatically when the
 * CRON_SECRET environment variable is set, so nobody else can trigger it.
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { error } = await supabase
    .from("project_submissions")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Keep-alive ping failed", error);
    return NextResponse.json({ ok: false, error: "Database unreachable." }, { status: 503 });
  }

  return NextResponse.json(
    { ok: true, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
