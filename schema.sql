-- ─── FRAMIO Database Schema ────────────────────────────────────────────────────
-- Run this in the Supabase SQL Editor (once, on a fresh project).
-- admin_login_attempts is no longer needed - Supabase Auth handles brute-force
-- protection natively.

-- Lead status enum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED');

-- Project submissions from the public /start-project form
CREATE TABLE "project_submissions" (
  "id" TEXT NOT NULL,
  "public_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "services" TEXT[],
  "goal" TEXT NOT NULL,
  "timeline" TEXT NOT NULL,
  "budget" TEXT NOT NULL,
  "project_details" TEXT NOT NULL,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "admin_note" TEXT NOT NULL DEFAULT '',
  "ip_hash" TEXT,
  "user_agent" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_submissions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "project_submissions_public_id_key" ON "project_submissions"("public_id");
CREATE INDEX "project_submissions_status_idx" ON "project_submissions"("status");
CREATE INDEX "project_submissions_created_at_idx" ON "project_submissions"("created_at");
CREATE INDEX "project_submissions_ip_hash_created_at_idx" ON "project_submissions"("ip_hash", "created_at");

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION "set_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "project_submissions_set_updated_at"
BEFORE UPDATE ON "project_submissions"
FOR EACH ROW
EXECUTE FUNCTION "set_updated_at"();

ALTER FUNCTION "set_updated_at"() SET search_path = '';

-- Lock the table: only the site's server (service role, which bypasses RLS)
-- may read or write briefs. The public anon key gets no access at all.
ALTER TABLE "project_submissions" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "project_submissions" FROM anon, authenticated;


-- ─── Grant admin role to an ops user ───────────────────────────────────────────
-- After creating a user in Supabase dashboard (Authentication → Users → Add user),
-- run this to grant them the admin role:
--
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-admin@email.com';
