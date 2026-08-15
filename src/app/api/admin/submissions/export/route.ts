import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/db/prisma";

function safeCsvCell(value: unknown): string {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const submissions = await prisma.projectSubmission.findMany({ orderBy: { createdAt: "desc" } });
    const headers = [
      "ID",
      "Submitted At",
      "Name",
      "Brand",
      "Email",
      "Phone",
      "Services",
      "Goal",
      "Timeline",
      "Budget",
      "Project Details",
      "Status",
      "Admin Note"
    ];
    const rows = submissions.map((submission) => [
      submission.publicId,
      submission.createdAt.toISOString(),
      submission.name,
      submission.brand,
      submission.email,
      submission.phone,
      submission.services.join(" | "),
      submission.goal,
      submission.timeline,
      submission.budget,
      submission.projectDetails,
      submission.status,
      submission.adminNote
    ]);
    const csv = [headers, ...rows].map((row) => row.map(safeCsvCell).join(",")).join("\n");
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="framio-leads-${date}.csv"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Admin CSV export failed", error);
    return NextResponse.json({ ok: false, error: "Unable to export submissions." }, { status: 503 });
  }
}
