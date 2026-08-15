import { createSupabaseServerClient } from "@/lib/db/supabase-server";

/**
 * Returns the authenticated user if they have role = "admin" in their
 * app_metadata (set via Supabase dashboard or service-role API).
 * Returns null if unauthenticated or not an admin.
 */
export async function getOpsUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Check role in app_metadata (set server-side, not forgeable by users)
  const role = (user.app_metadata as Record<string, unknown>)?.role;
  if (role !== "admin") return null;

  return user;
}

export async function isOpsAuthenticated(): Promise<boolean> {
  return (await getOpsUser()) !== null;
}
