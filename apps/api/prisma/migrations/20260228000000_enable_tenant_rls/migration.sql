-- 1. Enable RLS on all tenant-aware tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_modifier_groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "modifiers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inventory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "restaurant_tables" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_modifiers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment_attempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "outbox_events" ENABLE ROW LEVEL SECURITY;

-- 2. Force RLS (even for table owners - default Postgres behavior bypasses RLS for owners)
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;
ALTER TABLE "categories" FORCE ROW LEVEL SECURITY;
ALTER TABLE "product_modifier_groups" FORCE ROW LEVEL SECURITY;
ALTER TABLE "modifiers" FORCE ROW LEVEL SECURITY;
ALTER TABLE "inventory" FORCE ROW LEVEL SECURITY;
ALTER TABLE "zones" FORCE ROW LEVEL SECURITY;
ALTER TABLE "restaurant_tables" FORCE ROW LEVEL SECURITY;
ALTER TABLE "orders" FORCE ROW LEVEL SECURITY;
ALTER TABLE "order_items" FORCE ROW LEVEL SECURITY;
ALTER TABLE "order_modifiers" FORCE ROW LEVEL SECURITY;
ALTER TABLE "payment_attempts" FORCE ROW LEVEL SECURITY;
ALTER TABLE "outbox_events" FORCE ROW LEVEL SECURITY;

-- 3. Create Policies for each table
-- The policy ensures that a row is only accessible if:
-- A) The session variable 'app.current_tenant' matches the row's tenantId OR
-- B) The session variable 'app.bypass_rls' is set to 'on' (used for background workers / seeding)

CREATE POLICY tenant_isolation_policy ON "users" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "products" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "categories" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "product_modifier_groups" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "modifiers" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "inventory" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "zones" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "restaurant_tables" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "orders" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "order_items" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "order_modifiers" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "payment_attempts" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
CREATE POLICY tenant_isolation_policy ON "outbox_events" FOR ALL USING ("tenantId" = current_setting('app.current_tenant', true) OR current_setting('app.bypass_rls', true) = 'on');
