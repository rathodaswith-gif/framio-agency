import { OpsLoginForm } from "@/components/ops/OpsLoginForm";

export const dynamic = "force-dynamic";

// Auth redirect is handled by middleware - no need to check here.
export default function OpsLoginPage() {
  return <OpsLoginForm />;
}
