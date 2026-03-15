-- RLS Activation
ALTER TABLE "staff_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "staff_logs" FORCE ROW LEVEL SECURITY;

-- Tenant Isolation Policy
-- Drop existing if it exists (for idempotency)
DROP POLICY IF EXISTS tenant_isolation_policy ON "staff_logs";
CREATE POLICY tenant_isolation_policy ON "staff_logs"
FOR ALL USING (
  "tenantId" = current_setting('app.current_tenant', true)
  OR current_setting('app.bypass_rls', true) = 'on'
);

-- Concurrency Protection (Double Check-In)
-- Drop existing if it exists
DROP INDEX IF EXISTS unique_open_log_per_user;
CREATE UNIQUE INDEX unique_open_log_per_user
ON staff_logs ("userId")
WHERE "checkOut" IS NULL;
