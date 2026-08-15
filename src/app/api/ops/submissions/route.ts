import { NextResponse } from "next/server";

import { isOpsAuthenticated } from "@/lib/auth/ops-session";
import { supabase } from "@/lib/db/supabase";
import { serializeSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isOpsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { data: submissions, error } = await supabase
      .from("project_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    return NextResponse.json(
      { ok: true, data: (submissions ?? []).map(serializeSubmission) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Ops submission list failed", error);
    return NextResponse.json({ ok: false, error: "Unable to load submissions." }, { status: 503 });
  }
}
