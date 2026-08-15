import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/db/supabase-server";
import { readJson } from "@/lib/http/request";

export const runtime = "nodejs";

const opsLoginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(256)
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await readJson(request);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid login request." }, { status: 400 });
  }

  const parsed = opsLoginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid login request." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error || !data.user) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }

  // Only allow users with role = "admin" in app_metadata (set via service-role API, not forgeable)
  const role = (data.user.app_metadata as Record<string, unknown>)?.role;
  if (role !== "admin") {
    await supabase.auth.signOut();
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
