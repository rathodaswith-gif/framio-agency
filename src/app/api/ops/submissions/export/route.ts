import { NextResponse } from "next/server";

import { isOpsAuthenticated } from "@/lib/auth/ops-session";
import { supabase } from "@/lib/db/supabase";

function safeCsvCell(value: unknown): string {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isOpsAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { data: submissions, error } = await supabase
      .from("project_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const headers = [
      "ID", "Submitted At", "Name", "Brand", "Email", "Phone",
      "Services", "Goal", "Timeline", "Budget", "Project Details",
      "Status", "Admin Note"
    ];
    const rows = (submissions ?? []).map((s) => [
      s.public_id, s.created_at, s.name, s.brand, s.email, s.phone,
      (s.services as string[]).join(" | "),
      s.goal, s.timeline, s.budget, s.project_details, s.status, s.admin_note
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
    console.error("Ops CSV export failed", error);
    return NextResponse.json({ ok: false, error: "Unable to export submissions." }, { status: 503 });
  }
}
