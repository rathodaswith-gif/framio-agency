import { NextResponse } from "next/server";

import { isOpsAuthenticated } from "@/lib/auth/ops-session";
import { supabase } from "@/lib/db/supabase";
import { readJson } from "@/lib/http/request";
import { serializeSubmission } from "@/lib/submissions";
import { adminSubmissionUpdateSchema } from "@/lib/validation/submission";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isOpsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  let payload: unknown;
  try {
    payload = await readJson(request);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = adminSubmissionUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid submission update." }, { status: 422 });
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.adminNote !== undefined) updateData.admin_note = parsed.data.adminNote;

  try {
    const { data: updated, error } = await supabase
      .from("project_submissions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Submission not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: serializeSubmission(updated) });
  } catch (error) {
    console.error("Ops submission update failed", error);
    return NextResponse.json({ ok: false, error: "Unable to update the submission." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isOpsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const { error } = await supabase
      .from("project_submissions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ops submission delete failed", error);
    return NextResponse.json({ ok: false, error: "Unable to delete the submission." }, { status: 503 });
  }
}
