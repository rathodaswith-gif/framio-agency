import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/db/prisma";
import { serializeSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const submissions = await prisma.projectSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 500
    });
    return NextResponse.json(
      { ok: true, data: submissions.map(serializeSubmission) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Admin submission list failed", error);
    return NextResponse.json({ ok: false, error: "Unable to load submissions." }, { status: 503 });
  }
}
