import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { adminContent } from "@/content/admin";
import { supabase } from "@/lib/db/supabase";
import { serializeSubmission } from "@/lib/submissions";
import type { ProjectSubmissionRecord } from "@/types/submission";

export const dynamic = "force-dynamic";

// Auth is enforced by middleware - this page only renders for authenticated admins.
export default async function OpsPage() {
  let initialSubmissions: ProjectSubmissionRecord[] = [];
  let initialError = "";

  try {
    const { data: submissions, error } = await supabase
      .from("project_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    initialSubmissions = (submissions ?? []).map(serializeSubmission);
  } catch (error) {
    console.error("Ops page load failed", error);
    initialError = adminContent.messages.loadFailed;
  }

  return <AdminDashboard initialSubmissions={initialSubmissions} initialError={initialError} />;
}
