import type { ProjectSubmission } from "@prisma/client";

import type { ProjectSubmissionRecord } from "@/types/submission";

export function serializeSubmission(submission: ProjectSubmission): ProjectSubmissionRecord {
  return {
    id: submission.id,
    publicId: submission.publicId,
    name: submission.name,
    brand: submission.brand,
    email: submission.email,
    phone: submission.phone,
    services: submission.services,
    goal: submission.goal,
    timeline: submission.timeline,
    budget: submission.budget,
    projectDetails: submission.projectDetails,
    status: submission.status,
    adminNote: submission.adminNote,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString()
  };
}
