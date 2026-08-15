import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { siteContent } from "@/content/site";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect(siteContent.routes.admin);
  return <AdminLoginForm />;
}
