CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED');

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
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "project_submissions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "project_submissions_public_id_key" ON "project_submissions"("public_id");
CREATE INDEX "project_submissions_status_idx" ON "project_submissions"("status");
CREATE INDEX "project_submissions_created_at_idx" ON "project_submissions"("created_at");
CREATE INDEX "project_submissions_ip_hash_created_at_idx" ON "project_submissions"("ip_hash", "created_at");

CREATE TABLE "admin_login_attempts" (
  "id" TEXT NOT NULL,
  "ip_hash" TEXT NOT NULL,
  "success" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admin_login_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "admin_login_attempts_ip_hash_created_at_idx" ON "admin_login_attempts"("ip_hash", "created_at");

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
