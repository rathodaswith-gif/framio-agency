import type { ProjectSubmissionRecord } from "@/types/submission";

// Raw database row shape (snake_case columns from Postgres)
export interface ProjectSubmissionRow {
  id: string;
  public_id: string;
  name: string;
  brand: string;
  email: string;
  phone: string;
  services: string[];
  goal: string;
  timeline: string;
  budget: string;
  project_details: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";
  admin_note: string;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export function serializeSubmission(row: ProjectSubmissionRow): ProjectSubmissionRecord {
  return {
    id: row.id,
    publicId: row.public_id,
    name: row.name,
    brand: row.brand,
    email: row.email,
    phone: row.phone,
    services: row.services,
    goal: row.goal,
    timeline: row.timeline,
    budget: row.budget,
    projectDetails: row.project_details,
    status: row.status,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
