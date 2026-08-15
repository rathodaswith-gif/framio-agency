import { NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";
import { createPublicSubmissionId, getClientIp, hashPrivateIdentifier, readJson } from "@/lib/http/request";
import { serializeSubmission } from "@/lib/submissions";
import { projectSubmissionSchema } from "@/lib/validation/submission";
import type { ApiResponse, ProjectSubmissionRecord } from "@/types/submission";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await readJson(request);
  } catch (error) {
    const message = error instanceof Error && error.message === "UNSUPPORTED_MEDIA_TYPE"
      ? "Content-Type must be application/json."
      : "Request body must be valid JSON.";
    return NextResponse.json<ApiResponse<never>>({ ok: false, error: message }, { status: 400 });
  }

  if (
    payload &&
    typeof payload === "object" &&
    "companyWebsite" in payload &&
    typeof payload.companyWebsite === "string" &&
    payload.companyWebsite.trim()
  ) {
    return NextResponse.json({ ok: true, data: { publicId: "RECEIVED" } }, { status: 201 });
  }

  const parsed = projectSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        ok: false,
        error: "Please correct the highlighted form fields.",
        fieldErrors: parsed.error.flatten().fieldErrors
      },
      { status: 422 }
    );
  }

  const ipHash = hashPrivateIdentifier(getClientIp(request));
  if (!ipHash) {
    return NextResponse.json<ApiResponse<never>>(
      { ok: false, error: "The submission service is not configured." },
      { status: 503 }
    );
  }

  try {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabase
      .from("project_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);

    if (countError) throw countError;

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return NextResponse.json<ApiResponse<never>>(
        { ok: false, error: "Too many submissions. Please wait before trying again." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const { data: submission, error: insertError } = await supabase
      .from("project_submissions")
      .insert({
        id: crypto.randomUUID(),
        public_id: createPublicSubmissionId(),
        name: parsed.data.name,
        brand: parsed.data.brand,
        email: parsed.data.email,
        phone: parsed.data.phone,
        services: parsed.data.services,
        goal: parsed.data.goal,
        timeline: parsed.data.timeline,
        budget: parsed.data.budget,
        project_details: parsed.data.projectDetails,
        ip_hash: ipHash,
        user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const record = serializeSubmission(submission);
    const response: ApiResponse<Pick<ProjectSubmissionRecord, "publicId" | "createdAt">> = {
      ok: true,
      data: { publicId: record.publicId, createdAt: record.createdAt }
    };

    return NextResponse.json(response, {
      status: 201,
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("Project submission failed", error);
    return NextResponse.json<ApiResponse<never>>(
      { ok: false, error: "The submission service is temporarily unavailable." },
      { status: 503 }
    );
  }
}
