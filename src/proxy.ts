import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseMiddlewareClient } from "@/lib/db/supabase-middleware";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createSupabaseMiddlewareClient(request, response);

  // Refresh the session so it stays alive on every request.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/ops/login";
  const isOpsRoute = pathname.startsWith("/ops");

  // Not on an ops route - nothing to do.
  if (!isOpsRoute) return response;

  const role = (user?.app_metadata as Record<string, unknown> | undefined)?.role;
  const isAdmin = role === "admin";

  // Authenticated admin trying to access login → redirect to dashboard.
  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL("/ops", request.url));
  }

  // Unauthenticated or non-admin trying to access protected ops pages → redirect to login.
  if (!isAdmin && !isLoginPage) {
    const loginUrl = new URL("/ops/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/ops/:path*"]
};
