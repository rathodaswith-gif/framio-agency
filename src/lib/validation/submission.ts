import { z } from "zod";

import { projectFormContent } from "@/content/project-form";
import { leadStatuses } from "@/types/submission";

const allowedServices = new Set<string>(projectFormContent.services.options.map((option) => option.value));
const allowedGoals = new Set<string>(projectFormContent.project.goal.options);
const allowedTimelines = new Set<string>(projectFormContent.project.timeline.options);
const allowedBudgets = new Set<string>(projectFormContent.budget.options.map((option) => option.value));

export const projectSubmissionSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    brand: z.string().trim().min(2).max(120),
    email: z.string().trim().email().toLowerCase().max(254),
    phone: z
      .string()
      .trim()
      .min(8)
      .max(24)
      .regex(/^[+\d][\d\s()-]+$/),
    services: z
      .array(z.string().trim())
      .min(1)
      .max(projectFormContent.services.options.length)
      .refine((services) => services.every((service) => allowedServices.has(service))),
    goal: z.string().trim().refine((goal) => allowedGoals.has(goal)),
    timeline: z.string().trim().refine((timeline) => allowedTimelines.has(timeline)),
    budget: z.string().trim().refine((budget) => allowedBudgets.has(budget)),
    projectDetails: z
      .string()
      .trim()
      .min(10)
      .max(projectFormContent.project.details.maxLength),
    companyWebsite: z.string().trim().max(0).optional().default("")
  })
  .strict();

export const adminLoginSchema = z.object({
  password: z.string().min(1).max(256)
});

export const adminSubmissionUpdateSchema = z
  .object({
    status: z.enum(leadStatuses),
    adminNote: z.string().trim().max(5000)
  })
  .strict();
