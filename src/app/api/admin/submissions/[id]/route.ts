import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/db/prisma";
import { readJson } from "@/lib/http/request";
import { serializeSubmission } from "@/lib/submissions";
import { adminSubmissionUpdateSchema } from "@/lib/validation/submission";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
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

  try {
    const updated = await prisma.projectSubmission.update({
      where: { id },
      data: parsed.data
    });
    return NextResponse.json({ ok: true, data: serializeSubmission(updated) });
  } catch (error) {
    console.error("Admin submission update failed", error);
    return NextResponse.json({ ok: false, error: "Unable to update the submission." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await prisma.projectSubmission.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin submission delete failed", error);
    return NextResponse.json({ ok: false, error: "Unable to delete the submission." }, { status: 404 });
  }
}
