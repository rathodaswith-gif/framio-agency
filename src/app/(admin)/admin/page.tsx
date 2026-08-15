import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { adminContent } from "@/content/admin";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/db/prisma";
import { serializeSubmission } from "@/lib/submissions";
import type { ProjectSubmissionRecord } from "@/types/submission";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  let initialSubmissions: ProjectSubmissionRecord[] = [];
  let initialError = "";
  try {
    const submissions = await prisma.projectSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
    initialSubmissions = submissions.map(serializeSubmission);
  } catch (error) {
    console.error("Admin page load failed", error);
    initialError = adminContent.messages.loadFailed;
  }
  return <AdminDashboard initialSubmissions={initialSubmissions} initialError={initialError} />;
}
