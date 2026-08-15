export const leadStatuses = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"] as const;

export type LeadStatusValue = (typeof leadStatuses)[number];

export interface ProjectSubmissionInput {
  name: string;
  brand: string;
  email: string;
  phone: string;
  services: string[];
  goal: string;
  timeline: string;
  budget: string;
  projectDetails: string;
  companyWebsite?: string;
}

export interface ProjectSubmissionRecord extends Omit<ProjectSubmissionInput, "companyWebsite"> {
  id: string;
  publicId: string;
  status: LeadStatusValue;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
  fieldErrors?: Partial<Record<keyof ProjectSubmissionInput, string[]>>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
